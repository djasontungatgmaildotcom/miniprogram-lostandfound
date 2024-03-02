<template>
    <div class="body">
        <img class="bg" src="../assets/bg.jpeg" alt="">

        <div class="form">
            <h2>后台管理系统</h2>
            <el-input v-model="username" placeholder="请输入账号"></el-input>
            <el-input v-model="password" placeholder="请输入密码" show-password></el-input>
            <el-button @click="submit">登录</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: "",
                password: ""
            }
        },
        methods: {
            async submit() {
                const { username, password } = this;
                if (!username || !password) {
                    this.$message.error("存在必填项未填!");
                    return;
                }

                const params = {
                    username,
                    password
                };

                const res = await this.$http.post("/admin/login", params);
                const { data } = res;
                if (typeof data === 'object') {
                    localStorage.setItem("userInfo", JSON.stringify(data));
                    this.$message.success("登录成功!");
                    this.$router.push("/home");
                } else {
                    this.$message.error("账号或密码错误!");
                }
                console.log(res);
            }
        }
    }
</script>

<style lang="less" scoped>
.body {
    width: 100vw;
    height: 100vh;
    position: relative;

    .bg {
        width: 100vw;
        height: 100vh;
        position: absolute;
        z-index: 10;
    }

    .form {
        position: absolute;
        z-index: 11;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        background-color: aqua;
        padding: 20px 30px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;

        h2 {
            margin-bottom: 20px;
        }

        .el-input {
            margin-bottom: 10px;
            width: 300px;
        }

        .el-button {
            width: 100px;
        }
    }
}


</style>