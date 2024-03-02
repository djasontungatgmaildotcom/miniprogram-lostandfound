<template>
  <div>
    <el-container>
      <el-header>
        <h2>失物招领后台管理系统</h2>
        <div class="info">
          <p>{{ role }} {{ nickname }} 你好!</p>
          <el-button @click="quit">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="currentPath"
            class="el-menu-vertical-demo"
            @select="handleSelect"
          >
          <el-menu-item index="/findPerson">
              <i class="el-icon-menu"></i>
              <span slot="title">寻主管理</span>
            </el-menu-item>
            <el-menu-item index="/findGoods">
              <i class="el-icon-location"></i>
              <span slot="title">寻物管理</span>
            </el-menu-item>
            <el-menu-item index="/advice">
              <i class="el-icon-zoom-in"></i>
              <span slot="title">意见反馈管理</span>
            </el-menu-item>
            <el-menu-item index="/banner">
              <i class="el-icon-picture-outline-round"></i>
              <span slot="title">轮播图管理</span>
            </el-menu-item>
            <el-menu-item index="/user">
              <i class="el-icon-document"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/admin">
              <i class="el-icon-setting"></i>
              <span slot="title">管理员管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      role: "",
      nickname: "",
      currentPath: "/findPerson",
    };
  },
  created() {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { role, nickname } = JSON.parse(userInfo);
      this.role = role === 0 ? "超级管理员" : "管理员";
      this.nickname = nickname;
    } else {
      this.$router.push("/login");
    }
    const { path } = this.$route;
    this.currentPath = path;
  },
  methods: {
    quit() {
      localStorage.removeItem("userInfo");
      this.$router.push("/login");
    },
    async handleSelect(path) {
      if (path === "/admin") {
        const params = {
          username: JSON.parse(localStorage.getItem("userInfo")).username,
        };
        const { data } = await axios.post("/admin/getPower", params);
        if (data) {
          // 有权限
          if (path !== this.currentPath) {
            this.$router.push(path);
            this.currentPath = path;
          }
        } else if (!data) {
          // 没权限
          this.$message.error("没有权限查看!");
        } else {
          // 服务端出错了
          this.$message.error("出错了!");
        }
      } else {
        if (path !== this.currentPath) {
            this.$router.push(path);
            this.currentPath = path;
          }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  .info {
    display: flex;
    align-items: center;

    .el-button {
      margin-left: 20px;
    }
  }
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  height: calc(100vh - 60px);

  .el-menu-vertical-demo {
    height: 100%;
  }
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>