<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">{{ isSignUp ? "Đăng ký" : "Đăng nhập" }}</h2>
      <el-form
        :model="form"
        :rules="isSignUp ? signUpRules : loginRules"
        ref="loginFormRef"
        class="login-form"
      >
        <el-form-item label="Tên đăng nhập" prop="username">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Mật khẩu" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          v-if="isSignUp"
          label="Xác nhận mật khẩu"
          prop="confirmPassword"
        >
          <el-input
            v-model="form.confirmPassword"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="isLoading">
            {{ isSignUp ? "Đăng ký" : "Đăng nhập" }}
          </el-button>
          <el-button type="text" @click="toggleMode">
            {{
              isSignUp
                ? "Đã có tài khoản? Đăng nhập"
                : "Chưa có tài khoản? Đăng ký"
            }}
          </el-button>
        </el-form-item>
      </el-form>

      <hr />

      <!-- 🔐 Đăng nhập bằng LaoID -->
      <el-button id="laoid-signin" type="primary">
        Đăng nhập bằng LaoID
      </el-button>
    </el-card>
  </div>
</template>

<script>
import { login, getCurrentUser } from "@/api/auth";
import Cookies from "js-cookie";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  data() {
    const validateConfirm = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error("Mật khẩu xác nhận không khớp"));
      } else {
        callback();
      }
    };
    return {
      isSignUp: false,
      isLoading: false,
      form: {
        username: "",
        password: "",
        confirmPassword: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            message: "Vui lòng nhập tên đăng nhập",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Vui lòng nhập mật khẩu",
            trigger: "blur",
          },
        ],
      },
      signUpRules: {
        username: [
          {
            required: true,
            message: "Vui lòng nhập tên đăng nhập",
            trigger: "blur",
          },
          {
            min: 4,
            message: "Tên đăng nhập tối thiểu 4 ký tự",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Vui lòng nhập mật khẩu",
            trigger: "blur",
          },
          { min: 6, message: "Mật khẩu tối thiểu 6 ký tự", trigger: "blur" },
        ],
        confirmPassword: [
          {
            required: true,
            message: "Vui lòng xác nhận mật khẩu",
            trigger: "blur",
          },
          { validator: validateConfirm, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapMutations(["setAuthenticated", "setUser"]),
    async onSubmit() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;

        this.isLoading = true;

        try {
          const { token } = await login(this.form.username, this.form.password);
          Cookies.set("token", token);

          const userInfo = await getCurrentUser();

          const fixedUser = {
            ...userInfo,
            username: userInfo.username || userInfo.user || this.form.username,
          };

          this.setAuthenticated(true);
          this.setUser(fixedUser);

          this.$router.replace({ name: "HomeView" });
        } catch (err) {
          console.error("Auth error:", err);
          this.$message.error("Sai tài khoản hoặc mật khẩu!");
        } finally {
          this.isLoading = false;
        }
      });
    },
    toggleMode() {
      this.isSignUp = !this.isSignUp;
      this.form.username = "";
      this.form.password = "";
      this.form.confirmPassword = "";
      this.$nextTick(() => {
        if (this.$refs.loginFormRef) this.$refs.loginFormRef.clearValidate();
      });
    },
  },
  mounted() {
    const script = document.createElement("script");
    script.src = "https://demo-sso.tinasoft.io/laoid.auth.js";
    script.async = true;
    document.body.appendChild(script);

    this.$nextTick(() => {
      const retrySSO = () => {
        console.log("⏳ Thử lại gọi initializeSSO sau 500ms...");
        if (window.initializeSSO) {
          window.initializeSSO();
        }
      };

      const tryBindSSO = () => {
        const btn = document.getElementById("laoid-signin");

        if (btn && window.openSSO) {
          console.log("✅ Tự gắn openSSO thủ công");
          btn.removeEventListener("click", window.openSSO);
          btn.addEventListener("click", window.openSSO);
        }
      };

      const checkAndInit = () => {
        const btn = document.getElementById("laoid-signin");
        if (window.initializeSSO && btn) {
          console.log("✅ Tìm thấy nút laoid-signin, gọi initializeSSO()");
          window.initializeSSO();
          tryBindSSO(); // ép gắn nếu SDK không gắn
          setTimeout(retrySSO, 500); // fallback lần nữa
        } else {
          console.warn("⏳ Chưa sẵn sàng, thử lại sau...");
          setTimeout(checkAndInit, 200);
        }
      };

      checkAndInit();
    });
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
}
.login-card {
  width: 350px;
  padding: 32px 24px;
}
.login-title {
  text-align: center;
  margin-bottom: 24px;
  font-weight: bold;
  font-size: 22px;
  color: #333;
}
.login-form {
  margin-top: 12px;
}
</style>
