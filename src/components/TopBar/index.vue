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
        <span v-if="normalizedUser" class="greeting">
          Xin chào, <b>{{ normalizedUser.username }}</b>
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
              <el-dropdown-item v-if="isAuthenticated" command="logout" divided>
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
    ...mapState(["serverAddr", "user", "isAuthenticated"]),
    normalizedUser() {
      // Nếu user là object và có username
      if (this.user && typeof this.user === "object" && this.user.username) {
        return this.user;
      }
      // Nếu user là chuỗi (ví dụ: "you")
      if (typeof this.user === "string") {
        return { username: this.user };
      }
      return null;
    },
  },
  mounted() {
    this.formConfig.domain = this.serverAddr;
    console.log("✅ TopBar mounted. Raw user:", this.user);
    console.log("✅ Normalized user:", this.normalizedUser);
  },
  methods: {
    handleCommand(command) {
      if (command === "config") {
        this.dialogConfig = true;
        this.formConfig.domain = this.serverAddr;
      }
      if (command === "logout") {
        this.$store.commit("logout");
        Cookies.remove("token");
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
  background-color: transparent !important; /* hoàn toàn trong suốt */
  // backdrop-filter: blur(6px); /* mờ nhẹ phần nền phía sau */
  height: 50px;
  width: 100vw;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15); /* viền mờ nhẹ */
  z-index: 9999;
}

.left-bar,
.center-bar,
.right-bar {
  display: flex;
  align-items: center;
  background-color: transparent; /* cũng trong suốt */
}

.logo-container {
  border-radius: 12px;
  padding: 10px 8px;
  background-color: transparent; /* trong suốt */
  transition: background 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
}

.greeting {
  color: #fff;
  margin-right: 12px;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  background-color: transparent;
}

.el-dropdown {
  background-color: transparent;
}

.el-dropdown-menu {
  background-color: rgba(30, 30, 30, 0.9); /* tối và mờ nhẹ */
  backdrop-filter: blur(4px);
  border-radius: 8px;
  border: none;
}
</style>
