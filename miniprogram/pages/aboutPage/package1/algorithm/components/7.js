// require("@babel/runtime/helpers/Arrayincludes.js");

var e = wx.canIUse("editor"), a = require("5.js");

function t(e) {
    for (var a = Object.create(null), t = e.split(","), s = t.length; s--; ) a[t[s]] = !0;
    return a;
}

module.exports = {
    errorImg: "https://cdn.blog.makergyt.com/mini/assets/err-placeholder.png",
    filter: function(e, a) {
        "pre" == e.name && a.bubble(), "iframe" == e.name && (a.bubble(), e.attrs.allowfullscreen = null != e.attrs.allowfullscreen);
    },
    highlight: function(e, t) {
        var s = e.match(/<code.*?language-([a-z-]+).*?>([\s\S]+)<\/code.*?>/m);
        if (!s) return e;
        var l = s[1];
        switch (e = s[2].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"), 
        t["data-content"] = e, l) {
          case "js":
          case "jsx":
          case "javascript":
            e = a.highlight(e, a.languages.javascript, "javascript");
            break;

          case "html":
          case "html-editor":
          case "wxml":
          case "vue":
            e = a.highlight(e, a.languages.html, "html");
            break;

          case "css":
          case "less":
          case "sass":
          case "wxss":
            e = a.highlight(e, a.languages.css, "css");
            break;

          case "json":
            e = a.highlight(e, a.languages.json, "json");
            break;

          case "md":
          case "md-editor":
          case "markdown":
            e = a.highlight(e, a.languages.markdown, "markdown");
            break;

          case "c":
          case "cpp":
            e = a.highlight(e, a.languages.clike, "clike");
            break;

          case "java":
            e = a.highlight(e, a.languages.java, "java");
            break;

          case "php":
            e = a.highlight(e, a.languages.php, "php");
            break;

          case "diff":
            e = a.highlight(e, a.languages.diff, "diff");
            break;

          case "sh":
          case "bash":
            e = a.highlight(e, a.languages.bash, "bash");
            break;

          case "py":
          case "py3":
          case "python":
            e = a.highlight(e, a.languages.python, "python");
        }
        return l.includes("editor") || (e = '<span style="display: block; background: url(\'https://cdn.blog.makergyt.com/mini/assets/code-mac.png\'); height: 12.25px; width: 42.875px; background-size: 100%; background-repeat: no-repeat;margin:5px"></span><span style="position:absolute;top:3px;right:8px;font-size:.6rem;color:#808080;font-weight:bold">'.concat(l, "</span><div style='overflow:auto;max-width:100%;padding-bottom:1em'>").concat(e, "</div>")), 
        e;
    },
    onText: null,
    entities: {
        quot: '"',
        apos: "'",
        semi: ";",
        nbsp: " ",
        ndash: "–",
        mdash: "—",
        middot: "·",
        lsquo: "‘",
        rsquo: "’",
        ldquo: "“",
        rdquo: "”",
        bull: "•",
        hellip: "…"
    },
    blankChar: t(" , ,\t,\r,\n,\f"),
    boolAttrs: t("autoplay,autostart,controls,ignore,loop,muted"),
    blockTags: t("address,article,aside,body,caption,center,cite,footer,header,html,nav,section" + (e ? "" : ",pre")),
    ignoreTags: t("area,base,canvas,frame,input,link,map,meta,param,script,source,style,svg,textarea,title,track,wbr" + (e ? ",rp" : "")),
    richOnlyTags: t("a,colgroup,fieldset,legend,table" + (e ? ",bdi,bdo,rt,ruby" : "")),
    selfClosingTags: t("area,base,br,col,circle,ellipse,embed,frame,hr,img,input,line,link,meta,param,path,polygon,rect,source,track,use,wbr"),
    trustTags: t("a,abbr,ad,audio,b,blockquote,br,code,col,colgroup,dd,del,dl,dt,div,em,fieldset,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,q,source,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,title,ul,video,iframe" + (e ? ",bdi,bdo,caption,pre,rt,ruby" : "")),
    userAgentStyles: {
        address: "font-style:italic",
        big: "display:inline;font-size:1.2em",
        blockquote: "background-color:#f6f6f6;border-left:3px solid #dbdbdb;color:#6c6c6c;padding:5px 0 5px 10px",
        caption: "display:table-caption;text-align:center",
        center: "text-align:center",
        cite: "font-style:italic",
        dd: "margin-left:40px",
        mark: "background-color:yellow",
        pre: "font-family:monospace;white-space:pre;overflow:scroll",
        s: "text-decoration:line-through",
        small: "display:inline;font-size:0.8em",
        u: "text-decoration:underline"
    }
};