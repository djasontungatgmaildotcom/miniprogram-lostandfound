<template>
  <div class="body">
    <div class="top">
      <h2>意见反馈管理</h2>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="openid" label="OpenID"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="advice_content" label="反馈内容">
      </el-table-column>
      <el-table-column prop="create_time" label="反馈时间"> </el-table-column>

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
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      size: 5,
      total: 0,
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      let params = {
        page: this.page,
        size: this.size,
      };
      const {
        data: { result, total },
      } = await this.$http.post("/admin/getAdviceList", params);
      this.tableData = result.map((item) => {
        return {
          ...item,
          create_time: dayjs(item.create_time).format("YYYY-MM-DD HH:mm:ss"),
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
      const { data } = await this.$http.post("/admin/deleteAdvice", params);
      if (data === "success") {
        this.$message.success("删除成功!");
        this.getTableData();
      } else {
        this.$message.error("删除失败!");
      }
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
