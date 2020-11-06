// require("../@babel/runtime/helpers/Arrayincludes");

var t = {}, e = require("../6.js"), i = wx.getFileSystemManager && wx.getFileSystemManager();

Component({
    options: {
        pureDataPattern: /^[acdgtu]|W/
    },
    data: {
        nodes: []
    },
    properties: {
        html: {
            type: String,
            observer: function(t) {
                this.setContent(t);
            }
        },
        autopause: {
            type: Boolean,
            value: !0
        },
        autoscroll: Boolean,
        autosetTitle: {
            type: Boolean,
            value: !0
        },
        compress: Number,
        domain: String,
        lazyLoad: Boolean,
        loadingImg: String,
        selectable: Boolean,
        tagStyle: Object,
        showWithAnimation: Boolean,
        useAnchor: Boolean,
        useCache: Boolean
    },
    relations: {
        "../parser-group/parser-group": {
            type: "ancestor"
        }
    },
    created: function() {
        this.imgList = [], this.imgList.setItem = function(t, e) {
            var n = this;
            if (t && e) {
                if (0 == e.indexOf("http") && this.includes(e)) {
                    for (var a, s = "", o = 0; (a = e[o]) && ("/" != a || "/" == e[o - 1] || "/" == e[o + 1]); o++) s += Math.random() > .5 ? a.toUpperCase() : a;
                    return s += e.substr(o), this[t] = s;
                }
                if (this[t] = e, e.includes("data:image")) {
                    var r = e.match(/data:image\/(\S+?);(\S+?),(.+)/);
                    if (!r) return;
                    var l = "".concat(wx.env.USER_DATA_PATH, "/").concat(Date.now(), ".").concat(r[1]);
                    i && i.writeFile({
                        filePath: l,
                        data: r[3],
                        encoding: r[2],
                        success: function() {
                            return n[t] = l;
                        }
                    });
                }
            }
        }, this.imgList.each = function(t) {
            for (var e = 0, i = this.length; e < i; e++) this.setItem(e, t(this[e], e, this));
        };
    },
    detached: function() {
        this.imgList.each(function(t) {
            t && t.includes(wx.env.USER_DATA_PATH) && i && i.unlink({
                filePath: t
            });
        }), clearInterval(this._timer);
    },
    methods: {
        in: function(t) {
            t.page && t.selector && t.scrollTop && (this._in = t);
        },
        navigateTo: function(t) {
            var e = this;
            if (!this.data.useAnchor) return t.fail && t.fail("Anchor is disabled");
            var i = (this._in ? this._in.page : this).createSelectorQuery().select((this._in ? this._in.selector : ".top") + (t.id ? ">>>#" + t.id : "")).boundingClientRect();
            this._in ? i.select(this._in.selector).fields({
                rect: !0,
                scrollOffset: !0
            }) : i.selectViewport().scrollOffset(), i.exec(function(i) {
                if (!i[0]) return e.group ? e.group.navigateTo(e.i, t) : t.fail && t.fail("Label not found");
                var n = i[1].scrollTop + i[0].top - (i[1].top || 0) + (t.offset || 0);
                if (e._in) {
                    var a = {};
                    a[e._in.scrollTop] = n, e._in.page.setData(a);
                } else wx.pageScrollTo({
                    scrollTop: n
                });
                t.success && t.success();
            });
        },
        getText: function() {
            for (var t, e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.data.html, i = "", n = 0; t = e[n++]; ) if ("text" == t.type) i += t.text.replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"); else if ("br" == t.type) i += "\n"; else {
                var a = "p" == t.name || "div" == t.name || "tr" == t.name || "li" == t.name || "h" == t.name[0] && t.name[1] > "0" && t.name[1] < "7";
                a && i && "\n" != i[i.length - 1] && (i += "\n"), t.children && (i += this.getText(t.children)), 
                a && "\n" != i[i.length - 1] ? i += "\n" : "td" != t.name && "th" != t.name || (i += "\t");
            }
            return i;
        },
        getVideoContext: function(t) {
            if (!t) return this.videoContexts;
            for (var e = this.videoContexts.length; e--; ) if (this.videoContexts[e].id == t) return this.videoContexts[e];
        },
        setContent: function(i, n) {
            var a, s = this, o = new e(i, this.data);
            if (this.data.useCache) {
                var r = function(t) {
                    for (var e = t.length, i = 5381; e--; ) i += (i << 5) + t.charCodeAt(e);
                    return i;
                }(i);
                t[r] ? a = t[r] : t[r] = a = o.parse();
            } else a = o.parse();
            this.triggerEvent("parse", a);
            var l = {};
            if (n) for (var c = this.data.nodes.length, h = a.length; h--; ) l["nodes[".concat(c + h, "]")] = a[h]; else l.nodes = a;
            this.showWithAnimation && (l.showAm = "animation: show .5s"), this.setData(l, function() {
                s.triggerEvent("load");
            }), a.title && this.data.autosetTitle && wx.setNavigationBarTitle({
                title: a.title
            }), this.imgList.length = 0, this.videoContexts = [];
            for (var d, u, g = this.selectAllComponents(".top,.top>>>._node"), f = 0; d = g[f++]; ) {
                d.top = this;
                for (var p, m = 0; p = d.data.nodes[m++]; ) if (!p.c) if ("img" == p.name) this.imgList.setItem(p.attrs.i, p.attrs.src); else if ("video" == p.name || "audio" == p.name) {
                    var v;
                    (v = "video" == p.name ? wx.createVideoContext(p.attrs.id, d) : d.selectComponent("#" + p.attrs.id)) && (v.id = p.attrs.id, 
                    this.videoContexts.push(v));
                }
            }
            clearInterval(this._timer), this._timer = setInterval(function() {
                s.createSelectorQuery().select(".top").boundingClientRect(function(t) {
                    t && (s.rect = t, t.height == u && (s.triggerEvent("ready", t), clearInterval(s._timer)), 
                    u = t.height);
                }).exec();
            }, 350);
        }
    }
});