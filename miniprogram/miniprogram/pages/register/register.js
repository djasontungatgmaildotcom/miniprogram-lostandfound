// pages/register/register.js
import { ajax } from '../../utils/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        password: '',
        confirmPwd: ''
    },

    async submit() {
        const { username, password, confirmPwd } = this.data;

        // 判断是否存在未填项
        if (!username || !password || !confirmPwd) {
            wx.showToast({
              title: '存在未填项!',
              icon: 'none'
            });
            return;
        }

        // 判断两次输入的密码是否一致
        if (password !== confirmPwd) {
            wx.showToast({
              title: '两次输入密码不一致!',
              icon: 'none'
            });
            return;
        }

        const params = {
            openid: wx.getStorageSync('openid'),
            username,
            password,
            date: new Date().getTime()
        };

        const result = await ajax('/register', 'POST', params);
        const { data } = result;

        if (data === "Registered") {
            // 这个账号已被注册
            wx.showToast({
              title: '此账号已被注册!',
              icon: 'none'
            });
            return;
        } else if (data === "success") {
            // 注册成功
            wx.redirectTo({
              url: '../login/login',
              success: () => {
                  wx.showToast({
                    title: '注册成功!',
                    icon: 'none'
                  })
              }
            })
        }
    },

    getUsername(e) {
        this.setData({
            username: e.detail.value
        })
    },

    getPassword(e) {
        this.setData({
            password: e.detail.value
        })
    },

    getConfirmPwd(e) {
        this.setData({
            confirmPwd: e.detail.value
        })
    },

    toLogin() {
        wx.redirectTo({
          url: '../login/login',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const openid = wx.getStorageSync('openid');

        if (!openid) {
            const { code } = await wx.login();
            const params1 = {
                code
            };
            const result1 = await ajax('/login', 'GET', params1);
            const { data } = result1;
            if (data !== "error") {
              wx.setStorageSync('openid', data);
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})