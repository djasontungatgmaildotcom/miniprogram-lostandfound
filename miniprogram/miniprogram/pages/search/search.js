// pages/search/search.js
import { ajax } from '../../utils/index';
let t = null;

// 1. 进入到页面时, 在onLoad里, 获取缓存中的searchLog, 进行赋值展示
// 2. 页面内, 通过wx:for动态渲染searchLog
// 3. 当搜索框延迟响应时, 将本次搜索内容添加到缓存中数据的头部, 并对页面内的数据进行赋值, 达到动态展示的效果

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 延迟响应
        search: '',
        // 及时响应
        _search: '',
        // 搜索历史
        searchLog: [],
        // 搜索结果
        searchRes: [],
    },

    toSearchLog(e) {
        const { name } = e.currentTarget.dataset;
        wx.navigateTo({
          url: `../searchResult/searchResult?name=${name}`,
        })
    },


    toDetail(e) {
        const { info: { _id } } = e.currentTarget.dataset;

        wx.navigateTo({
            url: `../infoDetail/infoDetail?_id=${_id}`,
        })
    },

    deleteLog() {
        // 删除视图内的数据
        this.setData({
            searchLog: []
        });
        // 删除缓存中的数据
        wx.removeStorageSync('searchLog');
    },

    deleteSearch() {
        this.setData({
            search: '',
            _search: ''
        })
    },

    getSearch(e) {
       // 实现简单版本的防抖
       this.setData({
           _search: e.detail.value
       })
        if (t) clearTimeout(t);
        t = setTimeout(async () => {
            this.setData({
                search: e.detail.value
            });
            let searchLog = wx.getStorageSync('searchLog');
            if (searchLog) {
                // 缓存有值的时候
                searchLog.unshift(e.detail.value);
            } else {
                // 没有缓存的时候
                searchLog = [e.detail.value];
            }
            wx.setStorageSync('searchLog', searchLog);
            this.setData({
                searchLog
            })
            const params = {
                name: e.detail.value
            };
            const result = await ajax('/searchLose', 'GET', params);
            console.log(result);
            const { data } = result;
            this.setData({
                searchRes: data
            })
        }, 1000);
        // 当你输入的内容，在数据库中能查到，就切换视图
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const searchLog = wx.getStorageSync('searchLog');
        this.setData({
            searchLog
        })
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