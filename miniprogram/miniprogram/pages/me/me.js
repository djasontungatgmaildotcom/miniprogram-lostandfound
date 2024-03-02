// pages/me/me.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        login: false,
        avatarUrl: '',
        nickName: '',
        cellList: [
            {
                url: '../../images/publish.png',
                text: '我的发布',
                page: '../myPublish/myPublish'
            },
            {
                url: '../../images/collection1.png',
                text: '我的收藏',
                page: '../myCollection/myCollection'
            },
            {
                url: '../../images/info.png',
                text: '我的信息',
                page: '../myInfo/myInfo'
            },
            {
                url: '../../images/point.png',
                text: '意见反馈',
                page: '../advice/advice'
            },
            {
                url: '../../images/quit.png',
                text: '退出登录'
            }
        ]
    },

    toDetail(e) {
        const { page } = e.currentTarget.dataset;
        if (page){
            wx.navigateTo({
                url: page,
            })
        } else {
            wx.showModal({
              title: '提示',
              content: '确定退出吗?',
              success: (res) => {
                  const { confirm} = res;
                  if (confirm) {
                      wx.removeStorageSync('login');
                      wx.removeStorageSync('userInfo');
                      wx.removeStorageSync('account');
                      wx.removeStorageSync('login_account');

                      this.setData({
                          login: false
                      })

                      wx.redirectTo({
                        url: '../login/login',
                      })
                  }
              }
            })
        }
    },

    toLogin() {
        wx.getUserProfile({
          desc: '获取用户信息',
          success: (res) => {
              console.log(res);
              const { userInfo: { avatarUrl, nickName } } = res;
              const userInfo = {
                  avatarUrl,
                  nickName
              }
              wx.setStorageSync('userInfo', userInfo);
              wx.setStorageSync('login', true);
              this.setData({
                  login: true,
                  avatarUrl,
                  nickName
              })
          }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const login = wx.getStorageSync('login');
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            const { avatarUrl, nickName } = userInfo;
            this.setData({
                avatarUrl,
                nickName
            })
        }
        this.setData({
            login: !!login
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
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                select: 4
            })
        }
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