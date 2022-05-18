// require("./Arrayincludes.js");

var t = require("7.js"), i = t.blankChar, s = require("4.js"), e = wx.getSystemInfoSync().windowWidth;

function a(i) {
    var a = this, h = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    this.attrs = {}, this.CssHandler = new s(h.tagStyle, e), this.data = i, this.domain = h.domain, 
    this.DOM = [], this.i = this.start = this.audioNum = this.imgNum = this.videoNum = 0, 
    h.prot = (this.domain || "").includes("://") ? this.domain.split("://")[0] : "http", 
    this.options = h, this.state = this.Text, this.STACK = [], this.bubble = function() {
        for (var i, s = a.STACK.length; i = a.STACK[--s]; ) {
            if (t.richOnlyTags[i.name]) return "table" != i.name || Object.hasOwnProperty.call(i, "c") || (i.c = 1), 
            !1;
            i.c = 1;
        }
        return !0;
    }, this.decode = function(i, s) {
        for (var e, a, h = -1; -1 != (h = i.indexOf("&", h + 1)) && -1 != (e = i.indexOf(";", h + 2)); ) "#" == i[h + 1] ? (a = parseInt(("x" == i[h + 2] ? "0" : "") + i.substring(h + 2, e)), 
        isNaN(a) || (i = i.substr(0, h) + String.fromCharCode(a) + i.substr(e + 1))) : (a = i.substring(h + 1, e), 
        (t.entities[a] || a == s) && (i = i.substr(0, h) + (t.entities[a] || "&") + i.substr(e + 1)));
        return i;
    }, this.getUrl = function(t) {
        return "/" == t[0] ? "/" == t[1] ? t = a.options.prot + ":" + t : a.domain && (t = a.domain + t) : a.domain && 0 != t.indexOf("data:") && !t.includes("://") && (t = a.domain + "/" + t), 
        t;
    }, this.isClose = function() {
        return ">" == a.data[a.i] || "/" == a.data[a.i] && ">" == a.data[a.i + 1];
    }, this.section = function() {
        return a.data.substring(a.start, a.i);
    }, this.parent = function() {
        return a.STACK[a.STACK.length - 1];
    }, this.siblings = function() {
        return a.STACK.length ? a.parent().children : a.DOM;
    };
}

a.prototype.parse = function() {
    for (var t; t = this.data[this.i]; this.i++) this.state(t);
    for (this.state == this.Text && this.setText(); this.STACK.length; ) this.popNode(this.STACK.pop());
    return this.DOM;
}, a.prototype.setAttr = function() {
    var s = this.attrName.toLowerCase(), e = this.attrVal;
    for (t.boolAttrs[s] ? this.attrs[s] = "T" : e && ("src" == s || "data-src" == s && !this.attrs.src ? this.attrs.src = this.getUrl(this.decode(e, "amp")) : "href" == s || "style" == s ? this.attrs[s] = this.decode(e, "amp") : "data-" != s.substr(0, 5) && (this.attrs[s] = e)), 
    this.attrVal = ""; i[this.data[this.i]]; ) this.i++;
    this.isClose() ? this.setNode() : (this.start = this.i, this.state = this.AttrName);
}, a.prototype.setText = function() {
    var s, e = this.section();
    if (e) if (e = t.onText && t.onText(e, function() {
        return s = !0;
    }) || e, s) {
        this.data = this.data.substr(0, this.start) + e + this.data.substr(this.i);
        var a = this.start + e.length;
        for (this.i = this.start; this.i < a; this.i++) this.state(this.data[this.i]);
    } else {
        if (!this.pre) {
            for (var h, r = [], n = e.length; h = e[--n]; ) (!i[h] || !i[r[0]] && (h = " ")) && r.unshift(h);
            e = r.join("");
        }
        this.siblings().push({
            type: "text",
            text: this.decode(e)
        });
    }
}, a.prototype.setNode = function() {
    var s = {
        name: this.tagName.toLowerCase(),
        attrs: this.attrs
    }, a = t.selfClosingTags[s.name];
    if (this.attrs = {}, t.ignoreTags[s.name]) if (a) if ("source" == s.name) {
        var h = this.parent();
        h && ("video" == h.name || "audio" == h.name) && s.attrs.src && h.attrs.source.push(s.attrs.src);
    } else "base" != s.name || this.domain || (this.domain = s.attrs.href); else this.remove(s); else {
        var r = s.attrs, n = this.CssHandler.match(s.name, r, s) + (r.style || ""), o = {};
        switch (r.id && (1 & this.options.compress ? r.id = void 0 : this.options.useAnchor && this.bubble()), 
        2 & this.options.compress && r.class && (r.class = void 0), s.name) {
          case "a":
          case "ad":
            this.bubble();
            break;

          case "font":
            if (r.color && (o.color = r.color, r.color = void 0), r.face && (o["font-family"] = r.face, 
            r.face = void 0), r.size) {
                var l = parseInt(r.size);
                l < 1 ? l = 1 : l > 7 && (l = 7);
                o["font-size"] = [ "xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large" ][l - 1], 
                r.size = void 0;
            }
            break;

          case "embed":
            var d = s.attrs.src || "", c = s.attrs.type || "";
            if (c.includes("video") || d.includes(".mp4") || d.includes(".3gp") || d.includes(".m3u8")) s.name = "video"; else {
                if (!(c.includes("audio") || d.includes(".m4a") || d.includes(".wav") || d.includes(".mp3") || d.includes(".aac"))) break;
                s.name = "audio";
            }
            s.attrs.autostart && (s.attrs.autoplay = "T"), s.attrs.controls = "T";

          case "video":
          case "audio":
            r.id ? this["".concat(s.name, "Num")]++ : r.id = s.name + ++this["".concat(s.name, "Num")], 
            "video" == s.name && (this.videoNum > 3 && (s.lazyLoad = 1), r.width && (o.width = parseFloat(r.width) + (r.width.includes("%") ? "%" : "px"), 
            r.width = void 0), r.height && (o.height = parseFloat(r.height) + (r.height.includes("%") ? "%" : "px"), 
            r.height = void 0)), r.source = [], r.src && (r.source.push(r.src), r.src = void 0), 
            this.bubble();
            break;

          case "td":
          case "th":
            if (r.colspan || r.rowspan) for (var u, p = this.STACK.length; u = this.STACK[--p]; ) if ("table" == u.name) {
                u.c = void 0;
                break;
            }
        }
        r.align && (o["text-align"] = r.align, r.align = void 0);
        var f, m = n.split(";");
        n = "";
        for (var g = 0, v = m.length; g < v; g++) {
            var b = m[g].split(":");
            if (!(b.length < 2)) {
                var x = b[0].trim().toLowerCase(), y = b.slice(1).join(":").trim();
                y.includes("-webkit") || y.includes("-moz") || y.includes("-ms") || y.includes("-o") || y.includes("safe") ? n += ";".concat(x, ":").concat(y) : o[x] && !y.includes("import") && o[x].includes("import") || (o[x] = y);
            }
        }
        if ("img" == s.name) r.src && !r.ignore && (this.bubble() ? r.i = (this.imgNum++).toString() : r.ignore = "T"), 
        r.ignore && (n += ";-webkit-touch-callout:none", o["max-width"] = "100%"), o.position || (o.top = o.bottom = o.left = o.right = o["z-index"] = void 0), 
        o.width ? f = o.width : r.width && (f = r.width.includes("%") ? r.width : r.width + "px"), 
        f && (o.width = f, r.width = "100%", parseInt(f) > e && (o.height = "", r.height && (r.height = void 0))), 
        o.height ? (r.height = o.height, o.height = "") : r.height && !r.height.includes("%") && (r.height += "px");
        for (var C in o) {
            var T = o[C];
            if (T) {
                if ((C.includes("flex") || "order" == C || "self-align" == C) && (s.c = 1), T.includes("url")) {
                    var w = T.indexOf("(");
                    if (-1 != w++) {
                        for (;'"' == T[w] || "'" == T[w] || i[T[w]]; ) w++;
                        T = T.substr(0, w) + this.getUrl(T.substr(w));
                    }
                } else T.includes("rpx") ? T = T.replace(/[0-9.]+\s*rpx/g, function(t) {
                    return parseFloat(t) * e / 750 + "px";
                }) : "white-space" == C && T.includes("pre") && !a && (this.pre = s.pre = !0);
                n += ";".concat(C, ":").concat(T);
            }
        }
        (n = n.substr(1)) && (r.style = n), a ? t.filter && 0 == t.filter(s, this) || this.siblings().push(s) : (s.children = [], 
        "pre" == s.name && t.highlight && (this.remove(s), this.pre = s.pre = !0), this.siblings().push(s), 
        this.STACK.push(s));
    }
    "/" == this.data[this.i] && this.i++, this.start = this.i + 1, this.state = this.Text;
}, a.prototype.remove = function(s) {
    var e = this, a = s.name, h = this.i, r = function() {
        var t = e.data.substring(h, e.i + 1);
        s.attrs.xmlns || (t = ' xmlns="http://www.w3.org/2000/svg"' + t);
        for (var i = h; "<" != e.data[h]; ) h--;
        t = e.data.substring(h, i) + t;
        var a = e.parent();
        "100%" == s.attrs.width && a && (a.attrs.style || "").includes("inline") && (a.attrs.style = "width:300px;max-width:100%;" + a.attrs.style), 
        e.siblings().push({
            name: "img",
            attrs: {
                src: "data:image/svg+xml;utf8," + t.replace(/#/g, "%23"),
                style: (/vertical[^;]+/.exec(s.attrs.style) || []).shift(),
                ignore: "T"
            }
        });
    };
    if ("svg" == s.name && "/" == this.data[h]) return r(this.i++);
    for (;;) {
        if (-1 == (this.i = this.data.indexOf("</", this.i + 1))) return void (this.i = "pre" == a || "svg" == a ? h : this.data.length);
        for (this.start = this.i += 2; !i[this.data[this.i]] && !this.isClose(); ) this.i++;
        if (this.section().toLowerCase() == a) return "pre" == a ? (this.data = this.data.substr(0, h + 1) + t.highlight(this.data.substring(h + 1, this.i - 5), s.attrs) + this.data.substr(this.i - 5), 
        this.i = h) : ("style" == a ? this.CssHandler.getStyle(this.data.substring(h + 1, this.i - 7)) : "title" == a && (this.DOM.title = this.data.substring(h + 1, this.i - 7)), 
        -1 == (this.i = this.data.indexOf(">", this.i)) && (this.i = this.data.length), 
        void ("svg" == a && r()));
    }
}, a.prototype.popNode = function(i) {
    if (i.pre) {
        i.pre = this.pre = void 0;
        for (var s = this.STACK.length; s--; ) this.STACK[s].pre && (this.pre = !0);
    }
    var e = this.siblings(), a = e.length, h = i.children;
    if ("head" == i.name || t.filter && 0 == t.filter(i, this)) return e.pop();
    var r = i.attrs;
    if (t.blockTags[i.name] ? i.name = "div" : t.trustTags[i.name] || (i.name = "span"), 
    "div" != i.name && "p" != i.name && "t" != i.name[0] || (a > 1 && " " == e[a - 2].text && e.splice(--a - 1, 1), 
    h.length && " " == h[h.length - 1].text && h.pop()), i.c && ("ul" == i.name || "ol" == i.name)) if ((i.attrs.style || "").includes("list-style:none")) for (var n, o = 0; n = h[o++]; ) "li" == n.name && (n.name = "div"); else if ("ul" == i.name) {
        for (var l = 1, d = this.STACK.length; d--; ) "ul" == this.STACK[d].name && l++;
        if (1 != l) for (var c = h.length; c--; ) h[c].floor = l;
    } else for (var u, p = 0, f = 1; u = h[p++]; ) "li" == u.name && (u.type = "ol", 
    u.num = function(t, i) {
        if ("a" == i) return String.fromCharCode(97 + (t - 1) % 26);
        if ("A" == i) return String.fromCharCode(65 + (t - 1) % 26);
        if ("i" == i || "I" == i) {
            t = (t - 1) % 99 + 1;
            var s = ([ "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC" ][Math.floor(t / 10) - 1] || "") + ([ "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX" ][t % 10 - 1] || "");
            return "i" == i ? s.toLowerCase() : s;
        }
        return t;
    }(f++, r.type) + ".");
    if ("table" == i.name) {
        var m = r.cellpadding, g = r.cellspacing, v = r.border;
        if (i.c && (this.bubble(), r.style = (r.style || "") + ";display:table", m || (m = 2), 
        g || (g = 2)), v && (r.style = "border:".concat(v, "px solid gray;").concat(r.style || "")), 
        g && (r.style = "border-spacing:".concat(g, "px;").concat(r.style || "")), (v || m || i.c) && function t(s) {
            for (var e, a = 0; e = s[a]; a++) if ("text" != e.type) {
                var h = e.attrs.style || "";
                i.c && "t" == e.name[0] && (e.c = 1, h += ";display:table-" + ("th" == e.name || "td" == e.name ? "cell" : "tr" == e.name ? "row" : "row-group")), 
                "th" == e.name || "td" == e.name ? (v && (h = "border:".concat(v, "px solid gray;").concat(h)), 
                m && (h = "padding:".concat(m, "px;").concat(h))) : t(e.children || []), h && (e.attrs.style = h);
            }
        }(h), this.options.autoscroll) {
            var b = Object.assign({}, i);
            i.name = "div", i.attrs = {
                style: "overflow:scroll"
            }, i.children = [ b ];
        }
    }
    this.CssHandler.pop && this.CssHandler.pop(i), "div" != i.name || Object.keys(r).length || 1 != h.length || "div" != h[0].name || (e[a - 1] = h[0]);
}, a.prototype.Text = function(t) {
    if ("<" == t) {
        var i = this.data[this.i + 1], s = function(t) {
            return t >= "a" && t <= "z" || t >= "A" && t <= "Z";
        };
        s(i) ? (this.setText(), this.start = this.i + 1, this.state = this.TagName) : "/" == i ? (this.setText(), 
        s(this.data[++this.i + 1]) ? (this.start = this.i + 1, this.state = this.EndTag) : this.Comment()) : "!" != i && "?" != i || (this.setText(), 
        this.Comment());
    }
}, a.prototype.Comment = function() {
    var t;
    t = "--" == this.data.substring(this.i + 2, this.i + 4) ? "--\x3e" : "[CDATA[" == this.data.substring(this.i + 2, this.i + 9) ? "]]>" : ">", 
    -1 == (this.i = this.data.indexOf(t, this.i + 2)) ? this.i = this.data.length : this.i += t.length - 1, 
    this.start = this.i + 1, this.state = this.Text;
}, a.prototype.TagName = function(t) {
    if (i[t]) {
        for (this.tagName = this.section(); i[this.data[this.i]]; ) this.i++;
        this.isClose() ? this.setNode() : (this.start = this.i, this.state = this.AttrName);
    } else this.isClose() && (this.tagName = this.section(), this.setNode());
}, a.prototype.AttrName = function(t) {
    if ("=" == t || i[t] || this.isClose()) {
        if (this.attrName = this.section(), i[t]) for (;i[this.data[++this.i]]; ) ;
        if ("=" == this.data[this.i]) {
            for (;i[this.data[++this.i]]; ) ;
            this.start = this.i--, this.state = this.AttrValue;
        } else this.setAttr();
    }
}, a.prototype.AttrValue = function(t) {
    if ('"' == t || "'" == t) {
        if (this.start++, -1 == (this.i = this.data.indexOf(t, this.i + 1))) return this.i = this.data.length;
        this.attrVal = this.section(), this.i++;
    } else {
        for (;!i[this.data[this.i]] && !this.isClose(); this.i++) ;
        this.attrVal = this.section();
    }
    this.setAttr();
}, a.prototype.EndTag = function(t) {
    if (i[t] || ">" == t || "/" == t) {
        for (var s = this.section().toLowerCase(), e = this.STACK.length; e-- && this.STACK[e].name != s; ) ;
        if (-1 != e) {
            for (var a; (a = this.STACK.pop()).name != s; ) this.popNode(a);
            this.popNode(a);
        } else "p" != s && "br" != s || this.siblings().push({
            name: s,
            attrs: {}
        });
        this.i = this.data.indexOf(">", this.i), this.start = this.i + 1, -1 == this.i ? this.i = this.data.length : this.state = this.Text;
    }
}, module.exports = a;