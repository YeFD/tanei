var e, n, t, a = function(e) {
    var n = /\blang(?:uage)?-([\w-]+)\b/i, t = 0, a = {
        manual: e.Prism && e.Prism.manual,
        disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
        util: {
            encode: function e(n) {
                return n instanceof r ? new r(n.type, e(n.content), n.alias) : Array.isArray(n) ? n.map(e) : n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
            },
            type: function(e) {
                return Object.prototype.toString.call(e).slice(8, -1);
            },
            objId: function(e) {
                return e.__id || Object.defineProperty(e, "__id", {
                    value: ++t
                }), e.__id;
            },
            clone: function e(n, t) {
                var r, i, s = a.util.type(n);
                switch (t = t || {}, s) {
                  case "Object":
                    if (i = a.util.objId(n), t[i]) return t[i];
                    for (var o in r = {}, t[i] = r, n) n.hasOwnProperty(o) && (r[o] = e(n[o], t));
                    return r;

                  case "Array":
                    return i = a.util.objId(n), t[i] ? t[i] : (r = [], t[i] = r, n.forEach(function(n, a) {
                        r[a] = e(n, t);
                    }), r);

                  default:
                    return n;
                }
            },
            getLanguage: function(e) {
                for (;e && !n.test(e.className); ) e = e.parentElement;
                return e ? (e.className.match(n) || [ , "none" ])[1].toLowerCase() : "none";
            },
            currentScript: function() {
                if ("undefined" == typeof document) return null;
                if ("currentScript" in document) return document.currentScript;
                try {
                    throw new Error();
                } catch (a) {
                    var e = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(a.stack) || [])[1];
                    if (e) {
                        var n = document.getElementsByTagName("script");
                        for (var t in n) if (n[t].src == e) return n[t];
                    }
                    return null;
                }
            }
        },
        languages: {
            extend: function(e, n) {
                var t = a.util.clone(a.languages[e]);
                for (var r in n) t[r] = n[r];
                return t;
            },
            insertBefore: function(e, n, t, r) {
                var i = (r = r || a.languages)[e], s = {};
                for (var o in i) if (i.hasOwnProperty(o)) {
                    if (o == n) for (var l in t) t.hasOwnProperty(l) && (s[l] = t[l]);
                    t.hasOwnProperty(o) || (s[o] = i[o]);
                }
                var u = r[e];
                return r[e] = s, a.languages.DFS(a.languages, function(n, t) {
                    t === u && n != e && (this[n] = s);
                }), s;
            },
            DFS: function e(n, t, r, i) {
                i = i || {};
                var s = a.util.objId;
                for (var o in n) if (n.hasOwnProperty(o)) {
                    t.call(n, o, n[o], r || o);
                    var l = n[o], u = a.util.type(l);
                    "Object" !== u || i[s(l)] ? "Array" !== u || i[s(l)] || (i[s(l)] = !0, e(l, t, o, i)) : (i[s(l)] = !0, 
                    e(l, t, null, i));
                }
            }
        },
        plugins: {},
        highlightAll: function(e, n) {
            a.highlightAllUnder(document, e, n);
        },
        highlightAllUnder: function(e, n, t) {
            var r = {
                callback: t,
                container: e,
                selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
            };
            a.hooks.run("before-highlightall", r), r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)), 
            a.hooks.run("before-all-elements-highlight", r);
            for (var i, s = 0; i = r.elements[s++]; ) a.highlightElement(i, !0 === n, r.callback);
        },
        highlightElement: function(t, r, i) {
            var s = a.util.getLanguage(t), o = a.languages[s];
            t.className = t.className.replace(n, "").replace(/\s+/g, " ") + " language-" + s;
            var l = t.parentNode;
            l && "pre" === l.nodeName.toLowerCase() && (l.className = l.className.replace(n, "").replace(/\s+/g, " ") + " language-" + s);
            var u = {
                element: t,
                language: s,
                grammar: o,
                code: t.textContent
            };
            function c(e) {
                u.highlightedCode = e, a.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, 
                a.hooks.run("after-highlight", u), a.hooks.run("complete", u), i && i.call(u.element);
            }
            if (a.hooks.run("before-sanity-check", u), !u.code) return a.hooks.run("complete", u), 
            void (i && i.call(u.element));
            if (a.hooks.run("before-highlight", u), u.grammar) if (r && e.Worker) {
                var d = new Worker(a.filename);
                d.onmessage = function(e) {
                    c(e.data);
                }, d.postMessage(JSON.stringify({
                    language: u.language,
                    code: u.code,
                    immediateClose: !0
                }));
            } else c(a.highlight(u.code, u.grammar, u.language)); else c(a.util.encode(u.code));
        },
        highlight: function(e, n, t) {
            var i = {
                code: e,
                grammar: n,
                language: t
            };
            return a.hooks.run("before-tokenize", i), i.tokens = a.tokenize(i.code, i.grammar), 
            a.hooks.run("after-tokenize", i), r.stringify(a.util.encode(i.tokens), i.language);
        },
        tokenize: function(e, n) {
            var t = n.rest;
            if (t) {
                for (var l in t) n[l] = t[l];
                delete n.rest;
            }
            var u = new i();
            return s(u, u.head, e), function e(n, t, i, l, u, c, d) {
                for (var p in i) if (i.hasOwnProperty(p) && i[p]) {
                    var g = i[p];
                    g = Array.isArray(g) ? g : [ g ];
                    for (var f = 0; f < g.length; ++f) {
                        if (d && d == p + "," + f) return;
                        var h = g[f], m = h.inside, b = !!h.lookbehind, k = !!h.greedy, y = 0, v = h.alias;
                        if (k && !h.pattern.global) {
                            var S = h.pattern.toString().match(/[imsuy]*$/)[0];
                            h.pattern = RegExp(h.pattern.source, S + "g");
                        }
                        h = h.pattern || h;
                        for (var w = l.next, _ = u; w !== t.tail; _ += w.value.length, w = w.next) {
                            var A = w.value;
                            if (t.length > n.length) return;
                            if (!(A instanceof r)) {
                                var E = 1;
                                if (k && w != t.tail.prev) {
                                    if (h.lastIndex = _, !(T = h.exec(n))) break;
                                    var x = T.index + (b && T[1] ? T[1].length : 0), F = T.index + T[0].length, $ = _;
                                    for ($ += w.value.length; $ <= x; ) $ += (w = w.next).value.length;
                                    if (_ = $ -= w.value.length, w.value instanceof r) continue;
                                    for (var O = w; O !== t.tail && ($ < F || "string" == typeof O.value && !O.prev.value.greedy); O = O.next) E++, 
                                    $ += O.value.length;
                                    E--, A = n.slice(_, $), T.index -= _;
                                } else {
                                    h.lastIndex = 0;
                                    var T = h.exec(A);
                                }
                                if (T) {
                                    b && (y = T[1] ? T[1].length : 0);
                                    F = (x = T.index + y) + (T = T[0].slice(y)).length;
                                    var I = A.slice(0, x), R = A.slice(F), N = w.prev;
                                    if (I && (N = s(t, N, I), _ += I.length), o(t, N, E), w = s(t, N, new r(p, m ? a.tokenize(T, m) : T, v, T, k)), 
                                    R && s(t, w, R), 1 < E && e(n, t, i, w.prev, _, !0, p + "," + f), c) break;
                                } else if (c) break;
                            }
                        }
                    }
                }
            }(e, u, n, u.head, 0), function(e) {
                for (var n = [], t = e.head.next; t !== e.tail; ) n.push(t.value), t = t.next;
                return n;
            }(u);
        },
        hooks: {
            all: {},
            add: function(e, n) {
                var t = a.hooks.all;
                t[e] = t[e] || [], t[e].push(n);
            },
            run: function(e, n) {
                var t = a.hooks.all[e];
                if (t && t.length) for (var r, i = 0; r = t[i++]; ) r(n);
            }
        },
        Token: r
    };
    function r(e, n, t, a, r) {
        this.type = e, this.content = n, this.alias = t, this.length = 0 | (a || "").length, 
        this.greedy = !!r;
    }
    function i() {
        var e = {
            value: null,
            prev: null,
            next: null
        }, n = {
            value: null,
            prev: e,
            next: null
        };
        e.next = n, this.head = e, this.tail = n, this.length = 0;
    }
    function s(e, n, t) {
        var a = n.next, r = {
            value: t,
            prev: n,
            next: a
        };
        return n.next = r, a.prev = r, e.length++, r;
    }
    function o(e, n, t) {
        for (var a = n.next, r = 0; r < t && a !== e.tail; r++) a = a.next;
        (n.next = a).prev = n, e.length -= r;
    }
    if (e.Prism = a, r.stringify = function e(n, t) {
        if ("string" == typeof n) return n;
        if (Array.isArray(n)) {
            var r = "";
            return n.forEach(function(n) {
                r += e(n, t);
            }), r;
        }
        var i = {
            type: n.type,
            content: e(n.content, t),
            tag: "span",
            classes: [ "token", n.type ],
            attributes: {},
            language: t
        }, s = n.alias;
        s && (Array.isArray(s) ? Array.prototype.push.apply(i.classes, s) : i.classes.push(s)), 
        a.hooks.run("wrap", i);
        var o = "";
        for (var l in i.attributes) o += " " + l + '="' + (i.attributes[l] || "").replace(/"/g, "&quot;") + '"';
        return "<" + i.tag + ' class="' + i.classes.join(" ") + '"' + o + ">" + i.content + "</" + i.tag + ">";
    }, !e.document) return e.addEventListener && (a.disableWorkerMessageHandler || e.addEventListener("message", function(n) {
        var t = JSON.parse(n.data), r = t.language, i = t.code, s = t.immediateClose;
        e.postMessage(a.highlight(i, a.languages[r], r)), s && e.close();
    }, !1)), a;
    var l = a.util.currentScript();
    function u() {
        a.manual || a.highlightAll();
    }
    if (l && (a.filename = l.src, l.hasAttribute("data-manual") && (a.manual = !0)), 
    !a.manual) {
        var c = document.readyState;
        "loading" === c || "interactive" === c && l && l.defer ? document.addEventListener("DOMContentLoaded", u) : window.requestAnimationFrame ? window.requestAnimationFrame(u) : window.setTimeout(u, 16);
    }
    return a;
}("undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {});

"undefined" != typeof module && module.exports && (module.exports = a), "undefined" != typeof global && (global.Prism = a), 
a.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: {
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: !0,
        inside: {
            "internal-subset": {
                pattern: /(\[)[\s\S]+(?=\]>$)/,
                lookbehind: !0,
                greedy: !0,
                inside: null
            },
            string: {
                pattern: /"[^"]*"|'[^']*'/,
                greedy: !0
            },
            punctuation: /^<!|>$|[[\]]/,
            "doctype-tag": /^DOCTYPE/,
            name: /[^\s<>'"]+/
        }
    },
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s\/>])))+)?\s*\/?>/,
        greedy: !0,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            "attr-value": {
                pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                inside: {
                    punctuation: [ {
                        pattern: /^=/,
                        alias: "attr-equals"
                    }, /"|'/ ]
                }
            },
            punctuation: /\/?>/,
            "attr-name": {
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/
                }
            }
        }
    },
    entity: [ {
        pattern: /&[\da-z]{1,8};/i,
        alias: "named-entity"
    }, /&#x?[\da-f]{1,8};/i ]
}, a.languages.markup.tag.inside["attr-value"].inside.entity = a.languages.markup.entity, 
a.languages.markup.doctype.inside["internal-subset"].inside = a.languages.markup, 
a.hooks.add("wrap", function(e) {
    "entity" === e.type && (e.attributes.title = e.content.replace(/&amp;/, "&"));
}), Object.defineProperty(a.languages.markup.tag, "addInlined", {
    value: function(e, n) {
        var t = {};
        t["language-" + n] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: !0,
            inside: a.languages[n]
        }, t.cdata = /^<!\[CDATA\[|\]\]>$/i;
        var r = {
            "included-cdata": {
                pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                inside: t
            }
        };
        r["language-" + n] = {
            pattern: /[\s\S]+/,
            inside: a.languages[n]
        };
        var i = {};
        i[e] = {
            pattern: RegExp("(<__[^]*?>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g, function() {
                return e;
            }), "i"),
            lookbehind: !0,
            greedy: !0,
            inside: r
        }, a.languages.insertBefore("markup", "cdata", i);
    }
}), a.languages.html = a.languages.markup, a.languages.mathml = a.languages.markup, 
a.languages.svg = a.languages.markup, a.languages.xml = a.languages.extend("markup", {}), 
a.languages.ssml = a.languages.xml, a.languages.atom = a.languages.xml, a.languages.rss = a.languages.xml, 
function(e) {
    var n = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    e.languages.css = {
        comment: /\/\*[\s\S]*?\*\//,
        atrule: {
            pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
            inside: {
                rule: /^@[\w-]+/,
                "selector-function-argument": {
                    pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
                    lookbehind: !0,
                    alias: "selector"
                }
            }
        },
        url: {
            pattern: RegExp("url\\((?:" + n.source + "|[^\n\r()]*)\\)", "i"),
            greedy: !0,
            inside: {
                function: /^url/i,
                punctuation: /^\(|\)$/
            }
        },
        selector: RegExp("[^{}\\s](?:[^{};\"']|" + n.source + ")*?(?=\\s*\\{)"),
        string: {
            pattern: n,
            greedy: !0
        },
        property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
        important: /!important\b/i,
        function: /[-a-z0-9]+(?=\()/i,
        punctuation: /[(){};:,]/
    }, e.languages.css.atrule.inside.rest = e.languages.css;
    var t = e.languages.markup;
    t && (t.tag.addInlined("style", "css"), e.languages.insertBefore("inside", "attr-value", {
        "style-attr": {
            pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
            inside: {
                "attr-name": {
                    pattern: /^\s*style/i,
                    inside: t.tag.inside
                },
                punctuation: /^\s*=\s*['"]|['"]\s*$/,
                "attr-value": {
                    pattern: /.+/i,
                    inside: e.languages.css
                }
            },
            alias: "language-css"
        }
    }, t.tag));
}(a), a.languages.clike = {
    comment: [ {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0,
        greedy: !0
    } ],
    string: {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "class-name": {
        pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /[.\\]/
        }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*\/~^%]/,
    punctuation: /[{}[\];(),.:]/
}, a.languages.javascript = a.languages.extend("clike", {
    "class-name": [ a.languages.clike["class-name"], {
        pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
        lookbehind: !0
    } ],
    keyword: [ {
        pattern: /((?:^|})\s*)(?:catch|finally)\b/,
        lookbehind: !0
    }, {
        pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0
    } ],
    number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*\/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
}), a.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/, 
a.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^\/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
        lookbehind: !0,
        greedy: !0
    },
    "function-variable": {
        pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
        alias: "function"
    },
    parameter: [ {
        pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
        lookbehind: !0,
        inside: a.languages.javascript
    }, {
        pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
        inside: a.languages.javascript
    }, {
        pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: a.languages.javascript
    }, {
        pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: a.languages.javascript
    } ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
}), a.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
        greedy: !0,
        inside: {
            "template-punctuation": {
                pattern: /^`|`$/,
                alias: "string"
            },
            interpolation: {
                pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
                lookbehind: !0,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\${|}$/,
                        alias: "punctuation"
                    },
                    rest: a.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    }
}), a.languages.markup && a.languages.markup.tag.addInlined("script", "javascript"), 
a.languages.js = a.languages.javascript, function(e) {
    var n = "\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b", t = {
        environment: {
            pattern: RegExp("\\$" + n),
            alias: "constant"
        },
        variable: [ {
            pattern: /\$?\(\([\s\S]+?\)\)/,
            greedy: !0,
            inside: {
                variable: [ {
                    pattern: /(^\$\(\([\s\S]+)\)\)/,
                    lookbehind: !0
                }, /^\$\(\(/ ],
                number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee]-?\d+)?/,
                operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
                punctuation: /\(\(?|\)\)?|,|;/
            }
        }, {
            pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
            greedy: !0,
            inside: {
                variable: /^\$\(|^`|\)$|`$/
            }
        }, {
            pattern: /\$\{[^}]+\}/,
            greedy: !0,
            inside: {
                operator: /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
                punctuation: /[\[\]]/,
                environment: {
                    pattern: RegExp("(\\{)" + n),
                    lookbehind: !0,
                    alias: "constant"
                }
            }
        }, /\$(?:\w+|[#?*!@$])/ ],
        entity: /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|x[0-9a-fA-F]{1,2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/
    };
    e.languages.bash = {
        shebang: {
            pattern: /^#!\s*\/.*/,
            alias: "important"
        },
        comment: {
            pattern: /(^|[^"{\\$])#.*/,
            lookbehind: !0
        },
        "function-name": [ {
            pattern: /(\bfunction\s+)\w+(?=(?:\s*\(?:\s*\))?\s*\{)/,
            lookbehind: !0,
            alias: "function"
        }, {
            pattern: /\b\w+(?=\s*\(\s*\)\s*\{)/,
            alias: "function"
        } ],
        "for-or-select": {
            pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
            alias: "variable",
            lookbehind: !0
        },
        "assign-left": {
            pattern: /(^|[\s;|&]|[<>]\()\w+(?=\+?=)/,
            inside: {
                environment: {
                    pattern: RegExp("(^|[\\s;|&]|[<>]\\()" + n),
                    lookbehind: !0,
                    alias: "constant"
                }
            },
            alias: "variable",
            lookbehind: !0
        },
        string: [ {
            pattern: /((?:^|[^<])<<-?\s*)(\w+?)\s*(?:\r?\n|\r)[\s\S]*?(?:\r?\n|\r)\2/,
            lookbehind: !0,
            greedy: !0,
            inside: t
        }, {
            pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s*(?:\r?\n|\r)[\s\S]*?(?:\r?\n|\r)\3/,
            lookbehind: !0,
            greedy: !0
        }, {
            pattern: /(^|[^\\](?:\\\\)*)(["'])(?:\\[\s\S]|\$\([^)]+\)|`[^`]+`|(?!\2)[^\\])*\2/,
            lookbehind: !0,
            greedy: !0,
            inside: t
        } ],
        environment: {
            pattern: RegExp("\\$?" + n),
            alias: "constant"
        },
        variable: t.variable,
        function: {
            pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|aptitude|apt-cache|apt-get|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
            lookbehind: !0
        },
        keyword: {
            pattern: /(^|[\s;|&]|[<>]\()(?:if|then|else|elif|fi|for|while|in|case|esac|function|select|do|done|until)(?=$|[)\s;|&])/,
            lookbehind: !0
        },
        builtin: {
            pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|break|cd|continue|eval|exec|exit|export|getopts|hash|pwd|readonly|return|shift|test|times|trap|umask|unset|alias|bind|builtin|caller|command|declare|echo|enable|help|let|local|logout|mapfile|printf|read|readarray|source|type|typeset|ulimit|unalias|set|shopt)(?=$|[)\s;|&])/,
            lookbehind: !0,
            alias: "class-name"
        },
        boolean: {
            pattern: /(^|[\s;|&]|[<>]\()(?:true|false)(?=$|[)\s;|&])/,
            lookbehind: !0
        },
        "file-descriptor": {
            pattern: /\B&\d\b/,
            alias: "important"
        },
        operator: {
            pattern: /\d?<>|>\||\+=|==?|!=?|=~|<<[<-]?|[&\d]?>>|\d?[<>]&?|&[>&]?|\|[&|]?|<=?|>=?/,
            inside: {
                "file-descriptor": {
                    pattern: /^\d/,
                    alias: "important"
                }
            }
        },
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
        number: {
            pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
            lookbehind: !0
        }
    };
    for (var a = [ "comment", "function-name", "for-or-select", "assign-left", "string", "environment", "function", "keyword", "builtin", "boolean", "file-descriptor", "operator", "punctuation", "number" ], r = t.variable[1].inside, i = 0; i < a.length; i++) r[a[i]] = e.languages.bash[a[i]];
    e.languages.shell = e.languages.bash;
}(a), function(e) {
    e.languages.diff = {
        coord: [ /^(?:\*{3}|-{3}|\+{3}).*$/m, /^@@.*@@$/m, /^\d+.*$/m ]
    };
    var n = {
        "deleted-sign": "-",
        "deleted-arrow": "<",
        "inserted-sign": "+",
        "inserted-arrow": ">",
        unchanged: " ",
        diff: "!"
    };
    Object.keys(n).forEach(function(t) {
        var a = n[t], r = [];
        /^\w+$/.test(t) || r.push(/\w+/.exec(t)[0]), "diff" === t && r.push("bold"), e.languages.diff[t] = {
            pattern: RegExp("^(?:[" + a + "].*(?:\r\n?|\n|(?![\\s\\S])))+", "m"),
            alias: r,
            inside: {
                line: {
                    pattern: /(.)(?=[\s\S]).*(?:\r\n?|\n)?/,
                    lookbehind: !0
                },
                prefix: {
                    pattern: /[\s\S]/,
                    alias: /\w+/.exec(t)[0]
                }
            }
        };
    }), Object.defineProperty(e.languages.diff, "PREFIXES", {
        value: n
    });
}(a), n = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|null|open|opens|package|private|protected|provides|public|record|requires|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/, 
t = /\b[A-Z](?:\w*[a-z]\w*)?\b/, (e = a).languages.java = e.languages.extend("clike", {
    "class-name": [ t, /\b[A-Z]\w*(?=\s+\w+\s*[;,=())])/ ],
    keyword: n,
    function: [ e.languages.clike.function, {
        pattern: /(\:\:)[a-z_]\w*/,
        lookbehind: !0
    } ],
    number: /\b0b[01][01_]*L?\b|\b0x[\da-f_]*\.?[\da-f_p+-]+\b|(?:\b\d[\d_]*\.?[\d_]*|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    operator: {
        pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*\/%&|^!=<>]=?)/m,
        lookbehind: !0
    }
}), e.languages.insertBefore("java", "string", {
    "triple-quoted-string": {
        pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
        greedy: !0,
        alias: "string"
    }
}), e.languages.insertBefore("java", "class-name", {
    annotation: {
        alias: "punctuation",
        pattern: /(^|[^.])@\w+/,
        lookbehind: !0
    },
    namespace: {
        pattern: RegExp("(\\b(?:exports|import(?:\\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\\s+)(?!<keyword>)[a-z]\\w*(?:\\.[a-z]\\w*)*\\.?".replace(/<keyword>/g, function() {
            return n.source;
        })),
        lookbehind: !0,
        inside: {
            punctuation: /\./
        }
    },
    generics: {
        pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
        inside: {
            "class-name": t,
            keyword: n,
            punctuation: /[<>(),.:]/,
            operator: /[?&|]/
        }
    }
}), a.languages.json = {
    property: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
        greedy: !0
    },
    string: {
        pattern: /"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
        greedy: !0
    },
    comment: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:true|false)\b/,
    null: {
        pattern: /\bnull\b/,
        alias: "keyword"
    }
}, a.languages.webmanifest = a.languages.json, function(e) {
    function n(e) {
        return e = e.replace(/<inner>/g, function() {
            return "(?:\\\\.|[^\\\\\n\r]|(?:\n|\r\n?)(?!\n|\r\n?))";
        }), RegExp("((?:^|[^\\\\])(?:\\\\{2})*)(?:" + e + ")");
    }
    var t = "(?:\\\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\\\|\r\n`])+", a = "\\|?__(?:\\|__)+\\|?(?:(?:\n|\r\n?)|$)".replace(/__/g, function() {
        return t;
    }), r = "\\|?[ \t]*:?-{3,}:?[ \t]*(?:\\|[ \t]*:?-{3,}:?[ \t]*)+\\|?(?:\n|\r\n?)";
    e.languages.markdown = e.languages.extend("markup", {}), e.languages.insertBefore("markdown", "prolog", {
        blockquote: {
            pattern: /^>(?:[\t ]*>)*/m,
            alias: "punctuation"
        },
        table: {
            pattern: RegExp("^" + a + r + "(?:" + a + ")*", "m"),
            inside: {
                "table-data-rows": {
                    pattern: RegExp("^(" + a + r + ")(?:" + a + ")*$"),
                    lookbehind: !0,
                    inside: {
                        "table-data": {
                            pattern: RegExp(t),
                            inside: e.languages.markdown
                        },
                        punctuation: /\|/
                    }
                },
                "table-line": {
                    pattern: RegExp("^(" + a + ")" + r + "$"),
                    lookbehind: !0,
                    inside: {
                        punctuation: /\||:?-{3,}:?/
                    }
                },
                "table-header-row": {
                    pattern: RegExp("^" + a + "$"),
                    inside: {
                        "table-header": {
                            pattern: RegExp(t),
                            alias: "important",
                            inside: e.languages.markdown
                        },
                        punctuation: /\|/
                    }
                }
            }
        },
        code: [ {
            pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
            lookbehind: !0,
            alias: "keyword"
        }, {
            pattern: /``.+?``|`[^`\r\n]+`/,
            alias: "keyword"
        }, {
            pattern: /^```[\s\S]*?^```$/m,
            greedy: !0,
            inside: {
                "code-block": {
                    pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
                    lookbehind: !0
                },
                "code-language": {
                    pattern: /^(```).+/,
                    lookbehind: !0
                },
                punctuation: /```/
            }
        } ],
        title: [ {
            pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
            alias: "important",
            inside: {
                punctuation: /==+$|--+$/
            }
        }, {
            pattern: /(^\s*)#+.+/m,
            lookbehind: !0,
            alias: "important",
            inside: {
                punctuation: /^#+|#+$/
            }
        } ],
        hr: {
            pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
            lookbehind: !0,
            alias: "punctuation"
        },
        list: {
            pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
            lookbehind: !0,
            alias: "punctuation"
        },
        "url-reference": {
            pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
            inside: {
                variable: {
                    pattern: /^(!?\[)[^\]]+/,
                    lookbehind: !0
                },
                string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
                punctuation: /^[\[\]!:]|[<>]/
            },
            alias: "url"
        },
        bold: {
            pattern: n("\\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\\b|\\*\\*(?:(?!\\*)<inner>|\\*(?:(?!\\*)<inner>)+\\*)+\\*\\*"),
            lookbehind: !0,
            greedy: !0,
            inside: {
                content: {
                    pattern: /(^..)[\s\S]+(?=..$)/,
                    lookbehind: !0,
                    inside: {}
                },
                punctuation: /\*\*|__/
            }
        },
        italic: {
            pattern: n("\\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\\b|\\*(?:(?!\\*)<inner>|\\*\\*(?:(?!\\*)<inner>)+\\*\\*)+\\*"),
            lookbehind: !0,
            greedy: !0,
            inside: {
                content: {
                    pattern: /(^.)[\s\S]+(?=.$)/,
                    lookbehind: !0,
                    inside: {}
                },
                punctuation: /[*_]/
            }
        },
        strike: {
            pattern: n("(~~?)(?:(?!~)<inner>)+?\\2"),
            lookbehind: !0,
            greedy: !0,
            inside: {
                content: {
                    pattern: /(^~~?)[\s\S]+(?=\1$)/,
                    lookbehind: !0,
                    inside: {}
                },
                punctuation: /~~?/
            }
        },
        url: {
            pattern: n('!?\\[(?:(?!\\])<inner>)+\\](?:\\([^\\s)]+(?:[\t ]+"(?:\\\\.|[^"\\\\])*")?\\)| ?\\[(?:(?!\\])<inner>)+\\])'),
            lookbehind: !0,
            greedy: !0,
            inside: {
                variable: {
                    pattern: /(\[)[^\]]+(?=\]$)/,
                    lookbehind: !0
                },
                content: {
                    pattern: /(^!?\[)[^\]]+(?=\])/,
                    lookbehind: !0,
                    inside: {}
                },
                string: {
                    pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
                }
            }
        }
    }), [ "url", "bold", "italic", "strike" ].forEach(function(n) {
        [ "url", "bold", "italic", "strike" ].forEach(function(t) {
            n !== t && (e.languages.markdown[n].inside.content.inside[t] = e.languages.markdown[t]);
        });
    }), e.hooks.add("after-tokenize", function(e) {
        "markdown" !== e.language && "md" !== e.language || function e(n) {
            if (n && "string" != typeof n) for (var t = 0, a = n.length; t < a; t++) {
                var r = n[t];
                if ("code" === r.type) {
                    var i = r.content[1], s = r.content[3];
                    if (i && s && "code-language" === i.type && "code-block" === s.type && "string" == typeof i.content) {
                        var o = i.content.replace(/\b#/g, "sharp").replace(/\b\+\+/g, "pp"), l = "language-" + (o = (/[a-z][\w-]*/i.exec(o) || [ "" ])[0].toLowerCase());
                        s.alias ? "string" == typeof s.alias ? s.alias = [ s.alias, l ] : s.alias.push(l) : s.alias = [ l ];
                    }
                } else e(r.content);
            }
        }(e.tokens);
    }), e.hooks.add("wrap", function(n) {
        if ("code-block" === n.type) {
            for (var t = "", a = 0, r = n.classes.length; a < r; a++) {
                var i = n.classes[a], s = /language-(.+)/.exec(i);
                if (s) {
                    t = s[1];
                    break;
                }
            }
            var o = e.languages[t];
            if (o) {
                var l = n.content.replace(/&lt;/g, "<").replace(/&amp;/g, "&");
                n.content = e.highlight(l, o, t);
            } else if (t && "none" !== t && e.plugins.autoloader) {
                var u = "md-" + new Date().valueOf() + "-" + Math.floor(1e16 * Math.random());
                n.attributes.id = u, e.plugins.autoloader.loadLanguages(t, function() {
                    var n = document.getElementById(u);
                    n && (n.innerHTML = e.highlight(n.textContent, e.languages[t], t));
                });
            }
        }
    }), e.languages.md = e.languages.markdown;
}(a), function(e) {
    function n(e, n) {
        return "___" + e.toUpperCase() + n + "___";
    }
    Object.defineProperties(e.languages["markup-templating"] = {}, {
        buildPlaceholders: {
            value: function(t, a, r, i) {
                if (t.language === a) {
                    var s = t.tokenStack = [];
                    t.code = t.code.replace(r, function(e) {
                        if ("function" == typeof i && !i(e)) return e;
                        for (var r, o = s.length; -1 !== t.code.indexOf(r = n(a, o)); ) ++o;
                        return s[o] = e, r;
                    }), t.grammar = e.languages.markup;
                }
            }
        },
        tokenizePlaceholders: {
            value: function(t, a) {
                if (t.language === a && t.tokenStack) {
                    t.grammar = e.languages[a];
                    var r = 0, i = Object.keys(t.tokenStack);
                    !function s(o) {
                        for (var l = 0; l < o.length && !(r >= i.length); l++) {
                            var u = o[l];
                            if ("string" == typeof u || u.content && "string" == typeof u.content) {
                                var c = i[r], d = t.tokenStack[c], p = "string" == typeof u ? u : u.content, g = n(a, c), f = p.indexOf(g);
                                if (-1 < f) {
                                    ++r;
                                    var h = p.substring(0, f), m = new e.Token(a, e.tokenize(d, t.grammar), "language-" + a, d), b = p.substring(f + g.length), k = [];
                                    h && k.push.apply(k, s([ h ])), k.push(m), b && k.push.apply(k, s([ b ])), "string" == typeof u ? o.splice.apply(o, [ l, 1 ].concat(k)) : u.content = k;
                                }
                            } else u.content && s(u.content);
                        }
                        return o;
                    }(t.tokens);
                }
            }
        }
    });
}(a), function(e) {
    e.languages.php = e.languages.extend("clike", {
        keyword: /\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|namespace|new|or|parent|print|private|protected|public|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield)\b/i,
        boolean: {
            pattern: /\b(?:false|true)\b/i,
            alias: "constant"
        },
        constant: [ /\b[A-Z_][A-Z0-9_]*\b/, /\b(?:null)\b/i ],
        comment: {
            pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
            lookbehind: !0
        }
    }), e.languages.insertBefore("php", "string", {
        "shell-comment": {
            pattern: /(^|[^\\])#.*/,
            lookbehind: !0,
            alias: "comment"
        }
    }), e.languages.insertBefore("php", "comment", {
        delimiter: {
            pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
            alias: "important"
        }
    }), e.languages.insertBefore("php", "keyword", {
        variable: /\$+(?:\w+\b|(?={))/i,
        package: {
            pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        }
    }), e.languages.insertBefore("php", "operator", {
        property: {
            pattern: /(->)[\w]+/,
            lookbehind: !0
        }
    });
    var n = {
        pattern: /{\$(?:{(?:{[^{}]+}|[^{}]+)}|[^{}])+}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)*)/,
        lookbehind: !0,
        inside: e.languages.php
    };
    e.languages.insertBefore("php", "string", {
        "nowdoc-string": {
            pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
            greedy: !0,
            alias: "string",
            inside: {
                delimiter: {
                    pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
                    alias: "symbol",
                    inside: {
                        punctuation: /^<<<'?|[';]$/
                    }
                }
            }
        },
        "heredoc-string": {
            pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
            greedy: !0,
            alias: "string",
            inside: {
                delimiter: {
                    pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
                    alias: "symbol",
                    inside: {
                        punctuation: /^<<<"?|[";]$/
                    }
                },
                interpolation: n
            }
        },
        "single-quoted-string": {
            pattern: /'(?:\\[\s\S]|[^\\'])*'/,
            greedy: !0,
            alias: "string"
        },
        "double-quoted-string": {
            pattern: /"(?:\\[\s\S]|[^\\"])*"/,
            greedy: !0,
            alias: "string",
            inside: {
                interpolation: n
            }
        }
    }), delete e.languages.php.string, e.hooks.add("before-tokenize", function(n) {
        /<\?/.test(n.code) && e.languages["markup-templating"].buildPlaceholders(n, "php", /<\?(?:[^"'\/#]|\/(?![*\/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#)(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|\/\*[\s\S]*?(?:\*\/|$))*?(?:\?>|$)/gi);
    }), e.hooks.add("after-tokenize", function(n) {
        e.languages["markup-templating"].tokenizePlaceholders(n, "php");
    });
}(a), a.languages.python = {
    comment: {
        pattern: /(^|[^\\])#.*/,
        lookbehind: !0
    },
    "string-interpolation": {
        pattern: /(?:f|rf|fr)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /((?:^|[^{])(?:{{)*){(?!{)(?:[^{}]|{(?!{)(?:[^{}]|{(?!{)(?:[^{}])+})+})+}/,
                lookbehind: !0,
                inside: {
                    "format-spec": {
                        pattern: /(:)[^:(){}]+(?=}$)/,
                        lookbehind: !0
                    },
                    "conversion-option": {
                        pattern: /![sra](?=[:}]$)/,
                        alias: "punctuation"
                    },
                    rest: null
                }
            },
            string: /[\s\S]+/
        }
    },
    "triple-quoted-string": {
        pattern: /(?:[rub]|rb|br)?("""|''')[\s\S]*?\1/i,
        greedy: !0,
        alias: "string"
    },
    string: {
        pattern: /(?:[rub]|rb|br)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
        greedy: !0
    },
    function: {
        pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
        lookbehind: !0
    },
    "class-name": {
        pattern: /(\bclass\s+)\w+/i,
        lookbehind: !0
    },
    decorator: {
        pattern: /(^\s*)@\w+(?:\.\w+)*/im,
        lookbehind: !0,
        alias: [ "annotation", "punctuation" ],
        inside: {
            punctuation: /\./
        }
    },
    keyword: /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin: /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    boolean: /\b(?:True|False|None)\b/,
    number: /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
    operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/
}, a.languages.python["string-interpolation"].inside.interpolation.inside.rest = a.languages.python, 
a.languages.py = a.languages.python, function() {
    if (void 0 !== a && a.languages.diff) {
        var e = /diff-([\w-]+)/i, n = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s\/>])))+)?\s*\/?>/gi, t = RegExp("(?:__|[^\r\n<])*(?:\r\n?|\n|(?:__|[^\r\n<])(?![^\r\n]))".replace(/__/g, function() {
            return n.source;
        }), "gi"), r = a.languages.diff.PREFIXES;
        a.hooks.add("before-sanity-check", function(n) {
            var t = n.language;
            e.test(t) && !n.grammar && (n.grammar = a.languages[t] = a.languages.diff);
        }), a.hooks.add("before-tokenize", function(n) {
            var t = n.language;
            e.test(t) && !a.languages[t] && (a.languages[t] = a.languages.diff);
        }), a.hooks.add("wrap", function(i) {
            var s, o;
            if ("diff" !== i.language) {
                var l = e.exec(i.language);
                if (!l) return;
                s = l[1], o = a.languages[s];
            }
            if (i.type in r) {
                var u, c = i.content.replace(n, "").replace(/&lt;/g, "<").replace(/&amp;/g, "&"), d = c.replace(/(^|[\r\n])./g, "$1");
                u = o ? a.highlight(d, o, s) : a.util.encode(d);
                var p, g = new a.Token("prefix", r[i.type], [ /\w+/.exec(i.type)[0] ]), f = a.Token.stringify(g, i.language), h = [];
                for (t.lastIndex = 0; p = t.exec(u); ) h.push(f + p[0]);
                /(?:^|[\r\n]).$/.test(c) && h.push(f), i.content = h.join(""), o && i.classes.push("language-" + s);
            }
        });
    }
}();