var ttttttt = require("./components/1.js"), eeeeeee = ttttttt.crateRandomArray, ssssss = ttttttt.crateArray, iiiiiii = require("./components/2.js");
Page({
    data: {
        isPause: !0,
        tagStyle: {
            pre: "font-size: 12.25px;color:#f8f8f2;line-height: 1.5;user-select:text;",
            code: "font-size: 12.25px;background-color:#f0f0f0;border-radius: 3px;"
        },
        desStyle: {
            table: "color:#cccccc;font-size: 11px;"
        },
        setting: [ 0, 7, 0, 1 ],
        sorts: iiiiiii,
        numbers: ssssss(20, 3, 1),
        numbers2: ssssss(10, 4, 2),
        delays: ssssss(10, 100, 100)
    },
    onLoad: function(t) {
        var e = this, s = wx.getMenuButtonBoundingClientRect(), i = wx.getSystemInfoSync(), o = i.safeArea, a = i.screenHeight, n = i.pixelRatio;
        this.setData({
            navbarHeight: s.bottom + s.top,
            menuH: s.height,
            menuW: 1.5 * s.width + 2,
            menuT: s.top,
            codeW: o.width / 2,
            codeH: a - (s.bottom + s.top),
            safeW: o.top
        }), wx.createSelectorQuery().select("#app").fields({
            node: !0,
            size: !0
        }).exec(function(t) {
            var s = t[0].node, i = n;
            s.width = t[0].width * i, s.height = t[0].height * i, e.ctx = s.getContext("2d"), 
            e.ctx.scale(i, i), wx.createSelectorQuery().select("#code").fields({
                node: !0,
                size: !0
            }).exec(function(t) {
                var s = t[0].node, i = n;
                s.width = t[0].width * i, s.height = t[0].height * i, e.pointer = s.getContext("2d"), 
                e.pointer.scale(i, i), e.reset();
            });
        });
    },
    onShareAppMessage: function() {
        return {
            title: "算法可视化"
        };
    },
    toSetting: function() {
        this.setData({
            showSetting: !0
        });
    },
    closeSetting: function() {
        this.setData({
            showSetting: !1
        });
    },
    setting: function(e) {
        var setting = e.detail.value
        if (setting[0] == 3 && this.data.setting[0] != 3) {
            setting[1] = parseInt(this.data.setting[1] / 2)
        } else if (this.data.setting[0] == 3 && setting[0] != 3) {
            setting[1] = setting[1] * 2 + 1
        }
        this.setData({
            setting: setting
        }), this.reset();
    },
    toNext: function() {
        this.data.status ? (wx.vibrateShort(), this.sort.run(this)) : wx.showToast({
            title: "已有序，请重置数据",
            icon: "none"
        });
    },
    toStart: function() {
        var t = this;
        this.data.status ? (this.setData({
            isPause: !1,
            status: 1
        }), this.timer = setInterval(function() {
            t.sort.run(t);
        }, this.data.delays[this.data.setting[2]])) : wx.showToast({
            title: "已有序，请重置数据",
            icon: "none"
        });
    },
    toPause: function() {
        this.setData({
            isPause: !0
        });
    },
    success: function() {
        this.setData({
            status: 0
        });
    },
    reset: function() {
        this.sort = iiiiiii[this.data.setting[0]], this.selectComponent("#code").setContent(this.sort.code), 
        this.selectComponent("#description").setContent(this.sort.description);
        var t;
        if (this.data.setting[0] == 3) {
            t = eeeeeee(this.data.numbers2[this.data.setting[1]], 180)
        } else {
            t = eeeeeee(this.data.numbers[this.data.setting[1]], 180)
        }
        this.variable = this.sort.init(t), this.draw(this.variable.array, -1, -1, -1), this.point(1), 
        this.setData({
            status: this.data.setting[3] ? -1 : 1
        });
    },
    draw: function(t, e, s, i) {
        this.ctx.clearRect(0, 0, 200, 200);
        for (var o = 200 / t.length, a = 0; a < t.length; a++) this.ctx.fillStyle = a < i ? "#28c93f" : a === e ? "#ff1408" : a === s ? "#ffde02" : "white", 
        this.ctx.fillRect(o * a - 2, 200 - t[a] - 2, o - 2, t[a] + 2), this.ctx.fillText(t[a].toString(), o * a - 2, 200 - t[a] - 12);
    },
    point: function(t) {
        this.pointer.clearRect(0, 0, this.data.codeW, this.data.codeH), this.pointer.fillStyle = "rgba(255,20,8,0.5)", 
        this.pointer.fillRect(0, 21.25 + 18.375 * (t - 1), this.data.codeW, 18.375);
    }
});