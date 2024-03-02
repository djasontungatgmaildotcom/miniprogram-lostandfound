<template>
  <div class="body">
    <div class="top">
      <h2>用户管理</h2>

      <el-input
        placeholder="请输入用户名"
        prefix-icon="el-icon-search"
        v-model="search"
        @input="toSearch"
      >
      </el-input>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="openid" label="OpenID"> </el-table-column>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="password" label="密码"> </el-table-column>
      <el-table-column prop="date" label="注册时间"> </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
            title="是否确认删掉此条数据？不可恢复"
            @confirm="deleteItem(scope.row._id)"
          >
            <el-button slot="reference">删除</el-button>
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
  </div>
</template>

<script>
import dayjs from "dayjs";
import { debounce } from 'lodash';
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      size: 5,
      total: 0,
      search: "",
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData(search) {
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
      } = await this.$http.post("/admin/getUser", params);
      this.tableData = result.map((item) => {
        return {
          ...item,
          date: dayjs(item.date).format("YYYY-MM-DD HH:mm:ss"),
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
      };
      const { data } = await this.$http.post("/admin/deleteUser", params);
      if (data === "success") {
        this.$message.success("删除成功!");
        this.getTableData();
      } else {
        this.$message.error("删除失败!");
      }
    },
    toSearch() {
        let a = debounce(() => this.getTableData(this.search), 1000)
        a();

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
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>