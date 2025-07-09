<template>
  <div class="mail-container">
    <div class="main-content">
      <aside class="sidebar">
        <h3>📥 Inbox</h3>
        <el-button
          type="primary"
          size="small"
          @click="dialogSend = true"
          style="margin-bottom: 10px"
        >
          ✉️ Gửi Mail
        </el-button>
        <ul class="mail-list">
          <li
            v-for="mail in mailList"
            :key="mail.uid"
            @click="selectMail(mail.uid)"
            :class="{ active: mail.uid === selectedId }"
          >
            <strong>{{ mail.subject }}</strong
            ><br />
            <span>{{ mail.from }}</span
            ><br />
            <small>{{ mail.date }}</small>
          </li>
        </ul>
        <pre v-if="mailList.length === 0">📭 Chưa có email nào</pre>
      </aside>

      <main class="mail-content" v-if="mailDetail">
        <h2>{{ mailDetail.subject }}</h2>
        <p><strong>From:</strong> {{ mailDetail.from }}</p>
        <!-- <p><strong>To:</strong> {{ mailDetail.to }}</p> -->
        <p><strong>Date:</strong> {{ mailDetail.date }}</p>
        <hr />
        <pre class="mail-body">{{ mailDetail.body }}</pre>
      </main>
    </div>

    <!-- Dialog gửi mail -->
    <el-dialog v-model="dialogSend" title="Gửi Email" width="500px">
      <el-form :model="sendForm" label-width="80px">
        <el-form-item label="To">
          <el-input
            v-model="sendForm.to"
            placeholder="Tên người nhận (không cần @domain)"
          />
        </el-form-item>
        <el-form-item label="Subject">
          <el-input v-model="sendForm.subject" />
        </el-form-item>
        <el-form-item label="Body">
          <el-input type="textarea" v-model="sendForm.body" :rows="6" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogSend = false">Hủy</el-button>
        <el-button type="primary" @click="onSendMail">Gửi</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCurrentUser,
  getMailDetail,
  sendMail,
  connectMailRealtime,
  disconnectMailRealtime,
} from "@/api/auth"; // connectMailRealtime đã thêm từ trước
import Cookies from "js-cookie";

export default {
  name: "MailView",
  data() {
    return {
      user: null,
      mailList: [],
      selectedId: null,
      mailDetail: null,
      dialogSend: false,
      sendForm: {
        to: "",
        subject: "",
        body: "",
      },
    };
  },
  async mounted() {
    try {
      this.user = await getCurrentUser();
      console.log("✅ Current user:", this.user);

      // ✅ Kết nối WebSocket để nhận realtime mail list
      connectMailRealtime(
        (data) => {
          this.mailList = data.emails || data || [];
          if (this.selectedId) {
            // Nếu đang xem 1 email cụ thể thì giữ nguyên nội dung đó
            const stillExist = this.mailList.some(
              (m) => m.uid === this.selectedId
            );
            if (!stillExist) this.mailDetail = null;
          }
        },
        () => {
          this.$message.warning("🔌 Mất kết nối realtime đến mail server");
        }
      );
    } catch (e) {
      console.error("❌ Lỗi tải user/mail:", e);
      this.$message.error("Lỗi tải hộp thư");
    }
  },
  beforeUnmount() {
    disconnectMailRealtime(); // ✅ Ngắt kết nối WS khi rời khỏi
  },
  methods: {
    async selectMail(uid) {
      try {
        this.selectedId = uid;
        const res = await getMailDetail(uid);
        this.mailDetail = res;
      } catch (err) {
        console.error("❌ Lỗi tải nội dung mail:", err);
        this.$message.error("Không thể tải nội dung email");
      }
    },
    async onSendMail() {
      if (!this.sendForm.to || !this.sendForm.subject || !this.sendForm.body) {
        this.$message.warning("Vui lòng điền đầy đủ thông tin");
        return;
      }
      try {
        const res = await sendMail(this.sendForm);
        this.$message.success(res.message || "Gửi mail thành công");
        this.dialogSend = false;
        this.sendForm = { to: "", subject: "", body: "" };
        // Không cần fetch lại, vì WS sẽ tự cập nhật
      } catch (err) {
        this.$message.error("❌ Không gửi được email");
      }
    },
    logout() {
      Cookies.remove("token");
      this.$router.replace({ name: "Login" });
    },
  },
};
</script>

<style scoped>
.mail-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: sans-serif;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background: #f7f7f7;
  border-right: 1px solid #ccc;
  padding: 20px;
  overflow-y: auto;
}

.mail-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mail-list li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.mail-list li.active {
  background-color: #e0f3ff;
}

.mail-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.mail-body {
  white-space: pre-wrap;
  font-family: monospace;
}
</style>
