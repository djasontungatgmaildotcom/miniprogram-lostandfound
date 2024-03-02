<template>
  <div class="body">
    <h2>寻主管理</h2>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="openid" label="OpenID"> </el-table-column>
      <el-table-column prop="classify1" label="一级分类"> </el-table-column>
      <el-table-column prop="classify2" label="二级分类"> </el-table-column>
      <el-table-column prop="name" label="名字"> </el-table-column>
      <el-table-column prop="date" label="丢失时间"> </el-table-column>
      <el-table-column prop="region" label="丢失地点"> </el-table-column>
      <el-table-column prop="phone" label="联系方式"> </el-table-column>
      <el-table-column prop="desc" label="描述"> </el-table-column>
      <el-table-column prop="state" label="认领状态">
        <template slot-scope="scope">
          <p>{{ 
            scope.row.state === 0 ? '未认领' : (scope.row.state === 1 ? '认领中' : '已认领')   
           }}</p>
          <el-button v-if="scope.row.state === 1" @click="showClaimModal(scope)">审核</el-button>
        </template>
      </el-table-column>
      <el-table-column label="相关图片" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.imgList[0]"
            :preview-src-list="scope.row.imgList"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="发布时间" width="160">
      </el-table-column>
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

    <el-dialog
      title="审核认领"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleClose"
    >
      <div class="dialog-claim-container">
        <p class="desc">{{ claimInfo.desc }}</p>
        <img class="img" :src="claimInfo.img_url" alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toClaim(0)">认领失败</el-button>
        <el-button type="primary" @click="toClaim(2)">认领成功</el-button>
      </span>
    </el-dialog>
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
      dialogVisible: false,
      claimInfo: {},
      _id: ''
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const params = {
        type: 0,
        page: this.page,
        size: this.size,
      };
      const {
        data: { result, total },
      } = await this.$http.post("/admin/getLose", params);
      this.tableData = result.map((item) => {
        return {
          ...item,
          time: dayjs(item.time).format("YYYY-MM-DD HH:mm:ss"),
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
      const { data } = await this.$http.post("/admin/delete", params);
      if (data === "success") {
        this.$message.success("删除成功!");
        this.getTableData();
      } else {
        this.$message.error("删除失败!");
      }
    },
    showClaimModal(scope) {
      this.dialogVisible = true;
      const { row: { claimInfo, _id } } = scope;
      this.claimInfo = claimInfo;
      this._id = _id;
    },
    async toClaim(state) {
      const params = {
        _id: this._id,
        state,
      };
      const { data } = await this.$http.post("/admin/reviewClaim", params);

      if (data === "success") {
        this.$message.success("操作成功!");
        this.dialogVisible = false;
        this.claimInfo = {};
        this._id = '';
        this.getTableData();
      } else {
        this.$message.error("操作失败!");
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

  h2 {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
.dialog-claim-container {
  display: flex;
  flex-direction: column;

  .img {
    width: 100%;
    height: 300px;
    margin-top: 20px;
  }
}

</style>