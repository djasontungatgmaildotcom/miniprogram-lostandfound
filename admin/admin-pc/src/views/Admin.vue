<template>
  <div class="body">
    <div class="top">
      <h2>管理员管理</h2>
      <div>
        <el-button @click="dialogVisible = true">新增</el-button>
        <el-input
          placeholder="请输入用户名"
          prefix-icon="el-icon-search"
          v-model="search"
          @input="toSearch"
        >
        </el-input>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="password" label="密码"> </el-table-column>
      <el-table-column prop="create_time" label="创建时间"> </el-table-column>
      <el-table-column prop="role" label="权限"> </el-table-column>
      <el-table-column prop="nickname" label="昵称"> </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            style="margin-right: 20px"
            type="primary"
            @click="editItem(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="是否确认删掉此条数据？不可恢复"
            @confirm="deleteItem(scope.row._id)"
          >
            <el-button type="danger" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleClose"
    >
      <el-input
        class="margin"
        v-model="username"
        placeholder="请输入用户名"
      ></el-input>
      <el-input
        class="margin"
        v-model="password"
        placeholder="请输入密码"
      ></el-input>
      <el-radio-group class="margin" v-model="role">
        <el-radio :label="0">超级管理员</el-radio>
        <el-radio :label="1">管理员</el-radio>
      </el-radio-group>
      <el-input
        class="margin"
        v-model="nickname"
        placeholder="请输入昵称"
      ></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script>
import dayjs from "dayjs";
import { debounce } from "lodash";
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      size: 5,
      total: 0,
      search: "",
      dialogVisible: false,

      username: "",
      password: "",
      nickname: "",
      role: 0,
      _id: "",
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData(search, _id) {
      let params = {};
      if (search) {
        params = {
          search,
          page: this.page,
          size: this.size,
        };
      } else {
        params = {
          page: this.page,
          size: this.size,
        };
      }
      const {
        data: { result, total },
      } = await this.$http.post("/admin/getAdmin", params);
      this.tableData = result.map((item) => {
        if (_id && item._id === _id) {
            localStorage.setItem("userInfo", JSON.stringify(item));
            window.location.reload();
        } 
        return {
          ...item,
          create_time: dayjs(item.create_time).format("YYYY-MM-DD HH:mm:ss"),
          role: item.role === 0 ? "超级管理员" : "管理员",
        };
      });
      this.total = total;
    },
    handleSizeChange(val) {
      this.size = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTableData();
    },
    async deleteItem(_id) {
      const params = {
        _id,
        username: JSON.parse(localStorage.getItem("userInfo")).username,
      };
      const { data } = await this.$http.post("/admin/deleteAdmin", params);
      if (data === "success") {
        this.$message.success("删除成功!");
        this.getTableData();
      } else if (data === "noPower") {
        this.$message.error("没有权限!");
      } else {
        this.$message.error("删除失败!");
      }
    },
    toSearch() {
      let a = debounce(() => this.getTableData(this.search), 1000);
      a();
    },
    async addAdmin() {
      const { username, password, role, nickname, _id } = this;
      if (!username || !password || !nickname) {
        this.$message.error("未填写必填项!");
        return;
      }
      const params = {
        username,
        password,
        role,
        nickname,
        _id,
      };
      const { data } = await axios.post("/admin/addAdmin", params);
      if (data === "success") {
        this.$message.success(_id ? "编辑成功!" : "新增成功!");
        this.dialogVisible = false;
        
        if (_id === JSON.parse(localStorage.getItem("userInfo"))._id) {
            this.getTableData("", _id);
        } else {
            this.getTableData();
        }
        this.username = "";
        this.password = "";
        this.nickname = "";
        this._id = "";

      } else {
        this.$message.error(_id ? "编辑失败!" : "新增失败!");
      }
    },
    editItem(item) {
      console.log(item);
      const { username, password, role, nickname, _id } = item;
      this.username = username;
      this.password = password;
      this.role = role === "超级管理员" ? 0 : 1;
      this.nickname = nickname;
      this._id = _id;
      this.dialogVisible = true;
    },
    handleClose() {
      this.username = "";
      this.password = "";
      this.nickname = "";
      this._id = "";
    },
  },
};
</script>
  
  <style lang="less" scoped>
.body {
  padding: 20px;
  background-color: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .el-input {
      width: 300px;
      margin-left: 20px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}

.margin {
  margin-bottom: 20px;
}
</style>