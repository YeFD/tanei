module.exports = {
    swap: function(r, n, t) {
        var a = r[n];
        r[n] = r[t], r[t] = a;
    },
    isSort: function(r) {
        for (var n = 1; n < r.length; n++) if (r[n] < r[n - 1]) return !1;
        return !0;
    },
    crateArray: function(r) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10, t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1, a = n - t;
        return Array.apply(null, {
            length: r
        }).map(function() {
            return a += t;
        });
    },
    crateRandomArray: function(r) {
        var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 100, t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
        return Array.apply(null, {
            length: r
        }).map(function() {
            return t + Math.floor((n - t) * Math.random());
        });
    }
};