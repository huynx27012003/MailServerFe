<template>
  <div class="top-bar">
    <nav id="top-windows">
      <div class="left-bar">
        <div
          @click="$router.push({ name: 'HomeView' }).catch(() => {})"
          class="iconHover logo-container"
          style="user-select: none"
        >
          <img
            src="@/assets/logo.png"
            alt="Logo"
            style="height: 28px; width: auto; display: block"
          />
        </div>
      </div>

      <div class="right-bar">
        <span v-if="$store.state.user" class="greeting">
          Xin chào, <b>{{ $store.state.user.username }}</b>
        </span>
        <el-dropdown @command="handleCommand" trigger="click">
          <div
            class="iconHover"
            style="
              width: 45px;
              height: 38px;
              background-color: inherit;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 20px;
            "
          >
            <i
              style="font-size: 19px; color: white"
              class="fa-solid fa-gears"
            ></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="config">
                <i style="font-size: 19px" class="fa-solid fa-wrench"></i>
                Config Server
              </el-dropdown-item>
              <el-dropdown-item
                v-if="$store.state.isAuthenticated"
                command="logout"
                divided
              >
                <i
                  style="font-size: 19px"
                  class="fa-solid fa-right-from-bracket"
                ></i>
                Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </nav>

    <!-- Dialog cấu hình server -->
    <el-dialog
      v-model="dialogConfig"
      title="Config server address"
      width="400px"
    >
      <el-form :model="formConfig" label-width="80px">
        <el-form-item label="Domain">
          <el-input
            v-model="formConfig.domain"
            placeholder="https://domain.com/api/"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogConfig = false">Cancel</el-button>
          <el-button type="primary" @click="setServerAddr">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Cookies from "js-cookie";

export default {
  name: "TopBar",
  data() {
    return {
      dialogConfig: false,
      formConfig: {
        domain: "",
      },
    };
  },
  computed: {
    ...mapState(["serverAddr"]),
  },
  mounted() {
    this.formConfig.domain = this.serverAddr;
  },
  methods: {
    handleCommand(command) {
      if (command === "config") {
        this.dialogConfig = true;
        this.formConfig.domain = this.serverAddr;
      }
      if (command === "logout") {
        this.$store.commit("logout");
        Cookies.remove("token"); // Xóa token khỏi cookie
        this.$router.replace({ name: "login" });
        this.$message.success("Đăng xuất thành công!");
      }
    },
    setServerAddr() {
      if (
        this.formConfig.domain &&
        /^https?:\/\//.test(this.formConfig.domain)
      ) {
        this.$store.commit("setServerAddr", this.formConfig.domain);
        this.dialogConfig = false;
        this.$message.success("Config successfully");
      } else {
        this.$message.error("Invalid domain");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  background-color: #012596;
  height: 50px;
  width: 100vw;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  border-bottom: 1px solid #aeb6bf;
  overflow: visible;
}

.left-bar,
.center-bar,
.right-bar {
  display: flex;
  align-items: center;
}

.left-bar {
  z-index: 10;
  width: 15%;
  min-width: 80px;
}

.center-bar {
  width: 70%;
  justify-content: center;
}

.right-bar {
  width: 15%;
  min-width: 80px;
  justify-content: flex-end;
}

.logo-container {
  border-radius: 12px;
  transition: background 0.2s, box-shadow 0.2s;
  padding: 10px 8px;
  display: flex;
  align-items: center;
}

.greeting {
  color: #fff;
  margin-right: 12px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
</style>
