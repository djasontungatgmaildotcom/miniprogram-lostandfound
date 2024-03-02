<template>
  <div class="body">
    <div class="top">
      <h2>轮播图管理</h2>
      <el-button type="primary" @click="dialogVisible = true">新增</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="title" label="标题"> </el-table-column>
      <el-table-column prop="index" label="索引"> </el-table-column>
      <el-table-column prop="image_url" label="图片地址"> </el-table-column>
      <el-table-column prop="create_time" label="创建时间"> </el-table-column>
      <el-table-column prop="update_time" label="修改时间"> </el-table-column>
      <el-table-column prop="desc" label="描述"> </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
            <el-button slot="reference" type="primary" style="margin-right: 10px;" @click="updateItem(scope.row)">修改</el-button>
          <el-popconfirm
            title="是否确认删掉此条数据？不可恢复"
            @confirm="deleteItem(scope.row._id)"
          >
            <el-button slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-input
        class="margin"
        v-model="title"
        placeholder="请输入标题"
      ></el-input>
      <el-input
        class="margin"
        v-model="index"
        placeholder="请输入索引"
      ></el-input>
      <el-upload
        class="margin"
        action="http://192.168.31.62:3001/uploadImg"
        :on-remove="handleRemove"
        :on-success="handleUploadSuccess"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-input
        class="margin"
        v-model="desc"
        placeholder="请输入描述"
      ></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBanner">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      title: '',
      index: 0,
      fileList: [],
      desc: '',
      _id: ""
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const {
        data: { result },
      } = await this.$http.post('/getBannerList');
      this.tableData = result.map((item) => {
        return {
          ...item,
          create_time: dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
          update_time: dayjs(item.update_time).format('YYYY-MM-DD HH:mm:ss'),
        };
      });
    },
    async deleteItem(_id) {
      const params = {
        _id,
      };
      const { data } = await this.$http.post('/admin/deleteBanner', params);
      if (data === 'success') {
        this.$message.success('删除成功!');
        this.getTableData();
      } else {
        this.$message.error('删除失败!');
      }
    },
    handleClose() {
      this.title= "";
      this.index= 0;
      this.fileList= [];
      this.desc= "";
      this.dialogVisible = false;
      this._id=""; 

      this.getTableData();
    },
    handleUploadSuccess(response, file, fileList) {
      const { path, originalname } = response[0];
      let arr = path.split("\\");
      let image_url = `http://192.168.31.62:3001/${arr[0]}/${arr[1]}`;
      this.fileList = [
        {
          name: originalname,
          url: image_url
        }
      ]  
    },
    async addBanner() {
      const { title, index, fileList, desc, tableData, _id } = this;
      if (!title.trim() || fileList.length === 0 ) {
        this.$$message.error("存在必填项未填!");
        return;
      }

      if (_id ? tableData.find((item) => item.index === Number(index) && item._id !== _id) : tableData.find(item => item.index === index)) {
        this.$message.error("当前索引已存在!");
        return;
      }

      if (!(Number(index) >= 0)) {
        this.$message.error("当前索引格式错误");
        return;
      }

      if (_id) {
        const params = {
          image_url: fileList[0].url,
          index: Number(index),
          title,
          desc,
          _id
        };

        const { data } = await this.$http.post("/admin/updateBanner", params);
        if( data === "success" ) {
          this.$message.success("修改成功!");
          this.handleClose();
        } else {
          this.$message.error("修改失败!");
        }
      } else {
        const params = {
          image_url: fileList[0].url,
          index: Number(index),
          title,
          desc
        };

        const { data } = await this.$http.post("/admin/addBanner", params);
        if (data === "success") {
          this.$message.success("新增成功");
          this.handleClose();
        } else {
          this.$message.error("新增失败!");
        }
      }    
    },

    updateItem(item) {
      const { title, desc, image_url, index, _id } = item;

      this.title = title;
      this.desc = desc; 
      this.fileList = [{ name: title, url: image_url }];
      this.index = index;
      this._id = _id;
      
      this.dialogVisible = true;
    },

    handleRemove() {
      this.fileList = [];
    }
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

  .margin {
    margin-bottom: 20px;
  }
}
</style>
