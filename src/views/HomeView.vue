<template>
  <div class="mail-container">
    <div class="main-content">
      <aside class="sidebar">
        <div class="search-container">
          <el-input
            v-model="searchKeyword"
            placeholder="Tìm kiếm email..."
            clearable
            @input="onSearchInput"
            style="margin-bottom: 10px"
          />
          <el-button
            type="primary"
            size="small"
            @click="searchMails"
            :disabled="!searchKeyword.trim()"
          >
            🔍 Tìm
          </el-button>
        </div>
        <h3>📥 Inbox</h3>
        <ul class="mail-list">
          <li
            v-for="mail in mailList"
            :key="mail.uid"
            @click="selectMail(mail.uid)"
            :class="{ active: mail.uid === selectedId }"
          >
            <strong>{{ mail.subject }}</strong
            ><br />
            <span>{{ formatEmail(mail.from) }}</span
            ><br />
            <small>{{ mail.date }}</small>
          </li>
        </ul>
        <pre v-if="mailList.length === 0">
📟 {{ searchKeyword ? "Không tìm thấy email" : "Chưa có email nào" }}</pre
        >
      </aside>

      <main class="mail-content" v-if="mailDetail">
        <h2>{{ mailDetail.subject }}</h2>
        <p><strong>From:</strong> {{ formatEmail(mailDetail.from) }}</p>
        <p><strong>Date:</strong> {{ mailDetail.date }}</p>
        <hr />
        <pre class="mail-body">{{ mailDetail.body }}</pre>

        <!-- Hiển thị file đính kèm -->
        <div
          v-if="mailDetail.attachments && mailDetail.attachments.length > 0"
          class="attachments"
        >
          <h3>📎 File đính kèm:</h3>
          <ul class="attachment-list">
            <li
              v-for="attachment in mailDetail.attachments"
              :key="attachment.filename"
            >
              <el-button
                type="primary"
                size="small"
                @click="downloadAttachment(mailDetail.uid, attachment.filename)"
                :loading="downloadingFiles.includes(attachment.filename)"
              >
                📥 {{ attachment.filename }}
              </el-button>
            </li>
          </ul>
        </div>
      </main>

      <!-- Nút gửi mail ở góc phải dưới -->
      <el-button
        type="primary"
        circle
        class="send-mail-button"
        @click="dialogSend = true"
      >
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>

    <!-- Dialog gửi mail -->
    <el-dialog v-model="dialogSend" title="Gửi Email" width="600px">
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
        <el-form-item label="File đính kèm">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :file-list="fileList"
            multiple
            :show-file-list="true"
          >
            <el-button type="primary" size="small">📎 Chọn file</el-button>
            <template #tip>
              <div class="el-upload__tip">Có thể chọn nhiều file cùng lúc</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogSend = false">Hủy</el-button>
        <el-button type="primary" @click="onSendMail" :loading="sending">
          {{ sending ? "Đang gửi..." : "Gửi" }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCurrentUser,
  getMailList,
  getMailDetail,
  sendMail,
  sendMailWithAttachments,
  downloadAttachment,
  searchMails,
} from "@/api/auth";
import { Plus } from "@element-plus/icons-vue";
import Cookies from "js-cookie";

export default {
  name: "MailView",
  components: {
    Plus,
  },
  data() {
    return {
      user: null,
      mailList: [],
      selectedId: null,
      mailDetail: null,
      dialogSend: false,
      sending: false,
      downloadingFiles: [],
      sendForm: {
        to: "",
        subject: "",
        body: "",
      },
      fileList: [],
      attachedFiles: [],
      searchKeyword: "",
      isSearching: false,
    };
  },
  async mounted() {
    try {
      this.user = await getCurrentUser();
      console.log("✅ Current user:", this.user);
      await this.loadMailList();
    } catch (e) {
      console.error("❌ Lỗi tải user/mail:", e);
      this.$message.error("Lỗi tải hộp thư");
    }
  },
  methods: {
    async loadMailList() {
      try {
        const mails = await getMailList();
        console.log("📥 Mail list mới nhận:", mails);
        this.mailList = mails;
        this.isSearching = false;

        if (this.selectedId) {
          const stillExist = this.mailList.some(
            (m) => m.uid === this.selectedId
          );
          if (!stillExist) {
            this.mailDetail = null;
            this.selectedId = null;
          }
        }
      } catch (err) {
        console.error("❌ Lỗi tải danh sách mail:", err);
        this.$message.error("Không thể tải danh sách email");
      }
    },
    async searchMails() {
      if (!this.searchKeyword.trim()) {
        await this.loadMailList();
        return;
      }
      try {
        const mails = await searchMails(this.searchKeyword.trim());
        console.log("🔍 Search results:", mails);
        this.mailList = mails;
        this.isSearching = true;

        if (this.selectedId) {
          const stillExist = this.mailList.some(
            (m) => m.uid === this.selectedId
          );
          if (!stillExist) {
            this.mailDetail = null;
            this.selectedId = null;
          }
        }
      } catch (err) {
        console.error("❌ Lỗi tìm kiếm mail:", err);
        this.$message.error("Không thể tìm kiếm email");
      }
    },
    async onSearchInput() {
      if (!this.searchKeyword.trim()) {
        await this.loadMailList();
      }
    },
    async selectMail(uid) {
      try {
        this.selectedId = uid;
        const res = await getMailDetail(uid);
        this.mailDetail = res;
        console.log("📧 Mail detail:", res);
      } catch (err) {
        console.error("❌ Lỗi tải nội dung mail:", err);
        this.$message.error("Không thể tải nội dung email");
      }
    },
    async downloadAttachment(uid, filename) {
      try {
        this.downloadingFiles.push(filename);
        await downloadAttachment(uid, filename);
        this.$message.success(`Đã tải xuống ${filename}`);
      } catch (err) {
        console.error("❌ Lỗi tải file:", err);
        this.$message.error("Không thể tải file");
      } finally {
        this.downloadingFiles = this.downloadingFiles.filter(
          (f) => f !== filename
        );
      }
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
      this.attachedFiles = fileList.map((f) => f.raw);
    },
    handleFileRemove(file, fileList) {
      this.fileList = fileList;
      this.attachedFiles = fileList.map((f) => f.raw);
    },
    async onSendMail() {
      const trimmedTo = this.sendForm.to.trim();
      if (
        !trimmedTo ||
        trimmedTo === "undefined" ||
        !this.sendForm.subject.trim() ||
        !this.sendForm.body.trim()
      ) {
        this.$message.warning("Vui lòng điền đầy đủ thông tin hợp lệ");
        return;
      }

      try {
        this.sending = true;

        let res;
        if (this.attachedFiles.length > 0) {
          res = await sendMailWithAttachments({
            to: trimmedTo,
            subject: this.sendForm.subject.trim(),
            body: this.sendForm.body.trim(),
            files: this.attachedFiles,
          });
        } else {
          res = await sendMail({
            to: trimmedTo,
            subject: this.sendForm.subject.trim(),
            body: this.sendForm.body.trim(),
          });
        }

        this.$message.success(res.message || "Gửi mail thành công");
        this.dialogSend = false;
        this.sendForm = { to: "", subject: "", body: "" };
        this.fileList = [];
        this.attachedFiles = [];
        await this.loadMailList();
      } catch (err) {
        console.error("❌ Lỗi gửi mail:", err);
        this.$message.error("❌ Không gửi được email");
      } finally {
        this.sending = false;
      }
    },
    logout() {
      Cookies.remove("token");
      this.$router.replace({ name: "Login" });
    },
    formatEmail(raw) {
      if (!raw) return "";
      const parts = raw.split("@");
      return parts.slice(0, 2).join("@");
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

.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
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

.attachments {
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 5px;
}

.attachment-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
}

.attachment-list li {
  margin: 5px 0;
}

.el-upload__tip {
  color: #999;
  font-size: 12px;
}

.send-mail-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
