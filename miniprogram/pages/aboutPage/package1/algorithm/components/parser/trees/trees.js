var t = require("../../@babel/runtime/helpers/interopRequireDefault")(require("../../@babel/runtime/helpers/defineProperty"))
// var e = require("../../7.js").errorImg;

Component({
    data: {
        canIUse: !!wx.chooseMessageFile,
        placeholder: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='225'/>"
    },
    properties: {
        nodes: Array,
        lazyLoad: Boolean,
        loading: String
    },
    methods: {
        copyCode: function(t) {
            wx.showActionSheet({
                itemList: [ "复制代码" ],
                success: function() {
                    return wx.setClipboardData({
                        data: t.target.dataset.content
                    });
                }
            });
        },
        play: function(t) {
            if (this.top.group && this.top.group.pause(this.top.i), this.top.videoContexts.length > 1 && this.top.data.autopause) for (var e = this.top.videoContexts.length; e--; ) this.top.videoContexts[e].id != t.currentTarget.id && this.top.videoContexts[e].pause();
        },
        imgtap: function(t) {
            var e = t.currentTarget.dataset.attrs;
            if (!e.ignore) {
                var a = !0;
                if (this.top.triggerEvent("imgtap", {
                    id: t.currentTarget.id,
                    src: e.src,
                    ignore: function() {
                        return a = !1;
                    }
                }), a) {
                    if (this.top.group) return this.top.group.preview(this.top.i, e.i);
                    var r = this.top.imgList, i = r[e.i] ? r[e.i] : (r = [ e.src ], e.src);
                    wx.previewImage({
                        current: i,
                        urls: r
                    });
                }
            }
        },
        loadImg: function(e) {
            var a = e.target.dataset.i;
            this.data.lazyLoad && !this.data.nodes[a].load ? this.setData((0, t.default)({}, "nodes[".concat(a, "].load"), 1)) : this.data.loading && 2 != this.data.nodes[a].load && this.setData((0, 
            t.default)({}, "nodes[".concat(a, "].load"), 2));
        },
        linkpress: function(t) {
            var e = !0, a = t.currentTarget.dataset.attrs;
            a.ignore = function() {
                return e = !1;
            }, this.top.triggerEvent("linkpress", a), e && (a["app-id"] ? wx.navigateToMiniProgram({
                appId: a["app-id"],
                path: a.path
            }) : a.href && ("#" == a.href[0] ? this.top.navigateTo({
                id: a.href.substring(1)
            }) : 0 == a.href.indexOf("http") || 0 == a.href.indexOf("//") ? wx.setClipboardData({
                data: a.href,
                success: function() {
                    return wx.showToast({
                        title: "链接已复制"
                    });
                }
            }) : wx.navigateTo({
                url: a.href,
                fail: function() {
                    wx.switchTab({
                        url: a.href
                    });
                }
            })));
        },
        error: function(a) {
            var r = a.target.dataset.source, i = a.target.dataset.i, s = this.data.nodes[i];
            if ("video" == r || "audio" == r) {
                var o = (s.i || 0) + 1;
                if (o < s.attrs.source.length) return this.setData((0, t.default)({}, "nodes[".concat(i, "].i"), o));
            } else "img" == r && e && (this.top.imgList.setItem(a.target.dataset.index, e), 
            this.setData((0, t.default)({}, "nodes[".concat(i, "].attrs.src"), e)));
            this.top && this.top.triggerEvent("error", {
                source: r,
                target: a.target,
                errMsg: a.detail.errMsg
            });
        },
        loadVideo: function(e) {
            var a = e.target.dataset.i;
            this.setData((0, t.default)({}, "nodes[".concat(a, "].attrs.autoplay"), !0));
        }
    }
});