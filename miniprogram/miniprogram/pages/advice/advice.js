// pages/advice/advice.js
import { ajax } from '../../utils/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      phone: '',
      advice_content: ''
    },

    getPhone(e) {
      this.setData({
        phone: e.detail.value
      })
    },

    getAdviceContent(e) {
      this.setData({
        advice_content: e.detail.value
      })
    },

    async submit(e) {
      const { phone, advice_content } = this.data;
      console.log(phone, advice_content);
      const params = {
        openid: wx.getStorageSync('openid'),
        phone,
        advice_content
      };

      const { data } = await ajax("/addAdvice", "POST", params);
      console.log(data);
      if (data === "success") {
        wx.switchTab({
          url: '../me/me',
          success: () => {
            wx.showToast({
              title: '添加成功!',
              icon: 'none'
            })
          } 
        })
      } else {
        wx.showToast({
          title: '添加失败!',
          icon: 'none'
        })
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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