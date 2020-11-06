var t = require("7.js"), s = function(t) {
    return t >= "a" && t <= "z" || t >= "A" && t <= "Z";
};

function i(s) {
    var i = Object.assign(Object.create(null), t.userAgentStyles);
    for (var h in s) i[h] = (i[h] ? i[h] + ";" : "") + s[h];
    this.styles = i;
}

function h(t, s) {
    this.data = t, this.floor = 0, this.i = 0, this.list = [], this.res = s, this.state = this.Space;
}

i.prototype.getStyle = function(t) {
    this.styles = new h(t, this.styles).parse();
}, i.prototype.match = function(t, s) {
    var i, h = (i = this.styles[t]) ? i + ";" : "";
    if (s.class) for (var e, a = s.class.split(" "), o = 0; e = a[o]; o++) (i = this.styles["." + e]) && (h += i + ";");
    return (i = this.styles["#" + s.id]) && (h += i + ";"), h;
}, module.exports = i, h.prototype.parse = function() {
    for (var t; t = this.data[this.i]; this.i++) this.state(t);
    return this.res;
}, h.prototype.section = function() {
    return this.data.substring(this.start, this.i);
}, h.prototype.Space = function(i) {
    "." == i || "#" == i || s(i) ? (this.start = this.i, this.state = this.Name) : "/" == i && "*" == this.data[this.i + 1] ? this.Comment() : t.blankChar[i] || ";" == i || (this.state = this.Ignore);
}, h.prototype.Comment = function() {
    this.i = this.data.indexOf("*/", this.i) + 1, this.i || (this.i = this.data.length), 
    this.state = this.Space;
}, h.prototype.Ignore = function(t) {
    "{" == t ? this.floor++ : "}" != t || --this.floor || (this.state = this.Space);
}, h.prototype.Name = function(i) {
    t.blankChar[i] ? (this.list.push(this.section()), this.state = this.NameSpace) : "{" == i ? (this.list.push(this.section()), 
    this.Content()) : "," == i ? (this.list.push(this.section()), this.Comma()) : !s(i) && (i < "0" || i > "9") && "-" != i && "_" != i && (this.state = this.Ignore);
}, h.prototype.NameSpace = function(s) {
    "{" == s ? this.Content() : "," == s ? this.Comma() : t.blankChar[s] || (this.state = this.Ignore);
}, h.prototype.Comma = function() {
    for (;t.blankChar[this.data[++this.i]]; ) ;
    "{" == this.data[this.i] ? this.Content() : (this.start = this.i--, this.state = this.Name);
}, h.prototype.Content = function() {
    this.start = ++this.i, -1 == (this.i = this.data.indexOf("}", this.i)) && (this.i = this.data.length);
    for (var t, s = this.section(), i = 0; t = this.list[i++]; ) this.res[t] ? this.res[t] += ";" + s : this.res[t] = s;
    this.list = [], this.state = this.Space;
};