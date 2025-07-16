<template>
  <div>Đang xử lý đăng nhập LaoID...</div>
</template>

<script>
import axios from "axios";

export default {
  async created() {
    const code = this.$route.query.authorization_code || this.$route.query.code;

    if (!code) {
      alert("Không có mã xác thực từ LaoID");
      return;
    }

    try {
      console.log("📥 Gửi code sang backend:", code);

      const jwtRes = await axios.post(
        "http://localhost:8000/auth/laoid-login",
        { code }
      );

      const jwt = jwtRes.data.token;

      // ✅ Gửi token về cửa sổ cha (nếu là popup)
      if (window.opener) {
        window.opener.postMessage(
          { type: "LAOID_LOGIN_SUCCESS", token: jwt },
          "*" // hoặc thay bằng window.origin nếu 2 bên cùng domain
        );
        window.close(); // ✅ Đóng popup lại
      } else {
        // Nếu không phải popup thì fallback như cũ
        document.cookie = `token=${jwt}; path=/`;
        axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

        const userRes = await axios.get("http://localhost:8000/auth/me");
        const user = userRes.data.user;

        this.$store.commit("setAuthenticated", true);
        this.$store.commit("setUser", user);

        const password = prompt("Nhập mật khẩu email để sử dụng gửi/nhận thư:");
        if (password) {
          await axios.post("http://localhost:8000/auth/imap-auth", {
            password,
          });
        }

        this.$router.replace({ name: "HomeView" });
      }
    } catch (err) {
      console.error("❌ Lỗi đăng nhập LaoID:", err);
      alert("Đăng nhập LaoID thất bại");
    }
  },
};
</script>