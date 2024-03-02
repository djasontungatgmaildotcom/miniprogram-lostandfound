// pages/classify/classify.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        asideBar: ["卡片、证件类", "生活用品", "数码产品", "美妆护肤类", "衣服物品类", "饰品", "文娱", "其它"],
        login: false,
        rightList: [
            [
                {
                    url: "../../images/classify/card.png",
                    text: "身份证"
                },
                {
                    url: "../../images/classify/card.png",
                    text: "校园卡"
                },
                {
                    url: "../../images/classify/card.png",
                    text: "学生证"
                },
                {
                    url: "../../images/classify/card.png",
                    text: "水卡"
                },
                {
                    url: "../../images/classify/card.png",
                    text: "公交卡"
                },
                {
                    url: "../../images/classify/card.png",
                    text: "银行卡"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "其它"
                }
            ],
            [
                {
                    url: "../../images/classify/items.png",
                    text: "水杯"
                },
                {
                    url: "../../images/classify/items.png",
                    text: "雨伞"
                },
                {
                    url: "../../images/classify/items.png",
                    text: "小风扇"
                },
                {
                    url: "../../images/classify/items.png",
                    text: "钥匙/钥匙扣"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "其它"
                }
            ],
            [
                {
                    url: "../../images/classify/database.png",
                    text: "手机"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "相机"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "U盘/硬盘"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "充电宝"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "平板电脑"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "鼠标"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "充电线"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "耳机"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "手写笔"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "支架"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "音箱"
                },
                {
                    url: "../../images/classify/database.png",
                    text: "MP3"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "其它"
                }
            ],
            [
                {
                    url: "../../images/classify/makeup.png",
                    text: "口红"
                },
                {
                    url: "../../images/classify/makeup.png",
                    text: "粉底"
                },
                {
                    url: "../../images/classify/makeup.png",
                    text: "眉笔"
                },
                {
                    url: "../../images/classify/makeup.png",
                    text: "腮红"
                },
                {
                    url: "../../images/classify/makeup.png",
                    text: "眼影"
                },
                {
                    url: "../../images/classify/makeup.png",
                    text: "防晒"
                },
                {
                    url: "../../images/classify/makeup.png",
                    text: "喷雾"
                },
                {
                    url: "../../images/classify/makeup.png",
                    text: "香水"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "其它"
                }
            ],
            [
                {
                    url: "../../images/classify/cloth.png",
                    text: "男装"
                },
                {
                    url: "../../images/classify/cloth.png",
                    text: "女装"
                },
                {
                    url: "../../images/classify/cloth.png",
                    text: "男鞋"
                },
                {
                    url: "../../images/classify/cloth.png",
                    text: "女鞋"
                },
                {
                    url: "../../images/classify/cloth.png",
                    text: "包包"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "其它"
                }
            ],
            [
                {
                    url: "../../images/classify/dec.png",
                    text: "手表"
                },
                {
                    url: "../../images/classify/dec.png",
                    text: "项链"
                },
                {
                    url: "../../images/classify/dec.png",
                    text: "手链"
                },
                {
                    url: "../../images/classify/dec.png",
                    text: "戒指"
                },
                {
                    url: "../../images/classify/dec.png",
                    text: "耳饰"
                },
                {
                    url: "../../images/classify/dec.png",
                    text: "眼镜"
                },
                {
                    url: "../../images/classify/dec.png",
                    text: "帽子"
                },
                {
                    url: "../../images/classify/dec.png",
                    text: "发饰"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "其它"
                }
            ],
            [
                {
                    url: "../../images/classify/entertain.png",
                    text: "教材"
                },
                {
                    url: "../../images/classify/entertain.png",
                    text: "笔记"
                },
                {
                    url: "../../images/classify/entertain.png",
                    text: "文具"
                },
                {
                    url: "../../images/classify/entertain.png",
                    text: "球/球拍"
                },
                {
                    url: "../../images/classify/entertain.png",
                    text: "护具"
                },
                {
                    url: "../../images/classify/entertain.png",
                    text: "跳绳"
                },
                {
                    url: "../../images/classify/entertain.png",
                    text: "自行车"
                },
                {
                    url: "../../images/classify/entertain.png",
                    text: "棋牌"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "其它"
                }
            ],
            [
                {
                    url: "../../images/classify/other.png",
                    text: "药品"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "零食"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "周边"
                },
                {
                    url: "../../images/classify/other.png",
                    text: "其它"
                }
            ]
        ],
        select: 0,
    },

    toSearch() {
        wx.navigateTo({
          url: '../search/search',
        })
    },

    toClassify(e) {
        const { text }  = e.currentTarget.dataset;
        wx.navigateTo({
          url: `../classifyList/classifyList?text=${text}`,
        })
    },

    selectLeft(e) {
        const { index } = e.currentTarget.dataset;
        this.setData({
            select: index
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            login: wx.getStorageSync('login')
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
                select: 1
            })
        }
        this.onLoad();
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