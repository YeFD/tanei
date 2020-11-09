Component({
    properties: {
        home: {
            type: String,
            value: "/pages/index/index"
        },
        navType: {
            type: String,
            value: "switchTab"
        },
        navigationBarStyle: {
            type: String,
            value: "white"
        },
        hideHomeButton: {
            type: Boolean,
            value: !1
        }
    },
    externalClasses: [ "ext-class" ],
    lifetimes: {
        attached: function() {
            var t = this, e = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
            wx.getSystemInfo({
                success: function(i) {
                    t.setData({
                        statusBarHeight: i.statusBarHeight,
                        menuBtn: {
                            height: e ? e.height - 1 : 30,
                            width: e ? e.width - 1 : 85,
                            top: e ? e.top - i.statusBarHeight : 6,
                            left: e ? i.screenWidth - e.right : 10
                        },
                        title: {
                            height: e ? e.height : 32,
                            width: e ? 4 * e.right - 2 * e.width - 3 * i.screenWidth : 161,
                            top: e ? e.top - i.statusBarHeight : 6,
                            right: e ? e.width + 2 * (i.screenWidth - e.right) : 107
                        }
                    });
                }
            }), 1 === getCurrentPages().length && this.setData({
                return: !1,
                hide: this.data.hideHomeButton
            });
        }
    },
    methods: {
        toHome(){
            const app = getApp()
            wx.reLaunch({
                url: '/pages/index/index',
            })
      }
    }
});