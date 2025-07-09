<template>
  <div>Đang đăng nhập với LaoID...</div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  async created() {
    const code = this.$route.query.authorization_code;

    if (!code) {
      this.$message.error("Không có mã xác thực từ LaoID");
      return;
    }

    try {
      console.log("📥 Gửi code sang backend:", code);

      // ✅ Gửi code cho backend, backend sẽ lấy access_token + user info
      const jwtRes = await axios.post(
        "http://localhost:8000/auth/laoid-login",
        {
          code, // ✅ Gửi code, không gửi access_token nữa
        }
      );

      const jwt = jwtRes.data.token;
      Cookies.set("token", jwt);
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      // ✅ Lấy thông tin người dùng
      const user = (await axios.get("http://localhost:8000/auth/me")).data.user;
      this.$store.commit("setAuthenticated", true);
      this.$store.commit("setUser", user);

      // ✅ Nhập mật khẩu IMAP nếu cần
      const password = prompt("Nhập mật khẩu email để sử dụng gửi/nhận thư:");
      if (password) {
        await axios.post("http://localhost:8000/auth/imap-auth", { password });
      }

      this.$router.replace({ name: "HomeView" });
    } catch (err) {
      console.error("Lỗi đăng nhập LaoID:", err);
      this.$message.error("Đăng nhập LaoID thất bại");
    }
  },
};
</script>
