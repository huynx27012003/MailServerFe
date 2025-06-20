<template>
  <div class="home-container">
    <!-- User list -->
    <div
      class="user-list-section"
      style="margin-left: 300px; margin-top: 100px"
    >
      <h3>Danh sách người dùng</h3>
      <el-button
        type="success"
        size="small"
        @click="showAddDialog = true"
        style="margin-bottom: 10px"
      >
        Thêm user
      </el-button>
      <table class="cim-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userList" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.role }}</td>
            <td>
              <el-button size="small" @click="openEditDialog(user)"
                >Sửa</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="handleDeleteUser(user.id)"
                >Xóa</el-button
              >
              <el-button
                size="small"
                type="warning"
                @click="openChangePasswordDialog(user)"
                >Đổi mật khẩu</el-button
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <el-dialog v-model="showAddDialog" title="Thêm user mới" width="400px">
      <el-form :model="addForm">
        <el-form-item label="Username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input
            v-model="addForm.password"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">Hủy</el-button>
        <el-button type="primary" @click="handleAddUser">Thêm</el-button>
      </template>
    </el-dialog>


    <el-dialog v-model="showEditDialog" title="Sửa username" width="400px">
      <el-form :model="editForm">
        <el-form-item label="Username">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Hủy</el-button>
        <el-button type="primary" @click="handleEditUser">Lưu</el-button>
      </template>
    </el-dialog>

    <!-- Dialog Đổi mật khẩu -->
    <el-dialog
      v-model="showChangePasswordDialog"
      title="Đổi mật khẩu"
      width="400px"
    >
      <el-form :model="changePasswordForm">
        <el-form-item label="Mật khẩu mới">
          <el-input
            v-model="changePasswordForm.newPassword"
            type="password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showChangePasswordDialog = false">Hủy</el-button>
        <el-button type="primary" @click="handleChangePassword">Đổi</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateUsername,
  getUsers,
  register,
  deleteUser,
  updatePassword,
} from "@/api/auth";

export default {
  name: "Home",
  data() {
    return {
      userList: [],
      showAddDialog: false,
      showEditDialog: false,
      showChangePasswordDialog: false,
      addForm: {
        username: "",
        password: "",
      },
      editForm: {
        id: null,
        username: "",
      },
      changePasswordForm: {
        newPassword: "",
      },
      changePasswordUser: null,
    };
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      const res = await getUsers();
      this.userList = res.users || [];
    },
    async handleAddUser() {
      if (!this.addForm.username.trim() || !this.addForm.password.trim()) {
        this.$message.error("Vui lòng nhập đầy đủ thông tin");
        return;
      }
      try {
        await register(
          this.addForm.username.trim(),
          this.addForm.password.trim()
        );
        this.$message.success("Thêm user thành công!");
        this.showAddDialog = false;
        this.addForm.username = "";
        this.addForm.password = "";
        await this.fetchUsers();
      } catch (e) {
        this.$message.error("Thêm user thất bại!");
      }
    },
    openEditDialog(user) {
      this.editForm.id = user.id;
      this.editForm.username = user.username;
      this.showEditDialog = true;
    },
    async handleEditUser() {
      if (!this.editForm.username.trim()) {
        this.$message.error("Vui lòng nhập username mới");
        return;
      }
      try {
        await updateUsername(this.editForm.id, this.editForm.username.trim());
        this.$message.success("Cập nhật thành công!");
        this.showEditDialog = false;
        await this.fetchUsers();
      } catch (e) {
        this.$message.error("Cập nhật thất bại!");
      }
    },
    async handleDeleteUser(id) {
      this.$confirm("Bạn có chắc muốn xóa user này?", "Xác nhận", {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning",
      })
        .then(async () => {
          try {
            await deleteUser(id);
            this.$message.success("Xóa user thành công!");
            await this.fetchUsers();
          } catch (e) {
            this.$message.error("Xóa user thất bại!");
          }
        })
        .catch(() => {});
    },
    openChangePasswordDialog(user) {
      this.changePasswordUser = user;
      this.changePasswordForm.newPassword = "";
      this.showChangePasswordDialog = true;
    },
    async handleChangePassword() {
      if (!this.changePasswordForm.newPassword) {
        this.$message.error("Vui lòng nhập mật khẩu mới");
        return;
      }
      try {
        await updatePassword(
          this.changePasswordUser.id,
          this.changePasswordForm.newPassword
        );
        this.$message.success("Đổi mật khẩu thành công!");
        this.showChangePasswordDialog = false;
        this.changePasswordForm.newPassword = "";
      } catch (e) {
        this.$message.error("Đổi mật khẩu thất bại!");
      }
    },
  },
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #fff;
  color: #333;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.user-list-section {
  margin-left: 500px;
  margin-top: 100px;
}

.cim-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  background: white;
  border: 1px solid #ddd;
}

.cim-table th,
.cim-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.cim-table th {
  background: #f5f5f5;
  text-align: left;
}

.cim-table tr:hover {
  background-color: #f9f9f9;
}
</style>
