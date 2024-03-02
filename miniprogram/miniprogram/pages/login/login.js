// pages/login/login.js
import { ajax } from '../../utils/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: '',
        password: ''
    },

    async submit() {
        const { username, password } = this.data;

        // 判断必填项是否未填
        if (!username || !password) {
            wx.showToast({
              title: '存在未填项!',
              icon: 'none'
            });
            return;
        }

        const params = {
            username,
            password
        };

        const result = await ajax('/toLogin', 'POST', params);
        const { data } = result;
        if (data === "pwdError") {
            // 填写的密码不对
            wx.showToast({
              title: '密码错误!',
              icon: 'none'
            });
            return;
        } else if (data === "error") {
            // 账号信息不存在
            wx.showToast({
              title: '请检查您的账号是否正确!',
              icon: 'none',
            });
            return;
        } else if (data === "success") {
            // 登录成功
            wx.setStorageSync('login_account', true);
            wx.setStorageSync('account', params);
            wx.switchTab({
              url: '../index/index',
              success: () => {
                  wx.showToast({
                    title: '登录成功!',
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

    toRegister() {
        wx.redirectTo({
          url: '../register/register',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const openid = wx.getStorageSync('openid');

        if (wx.getStorageSync('login_account')) {
            wx.switchTab({
              url: '../index/index',
            })
        } else {
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