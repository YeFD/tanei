module.exports = {
    newAb2Str: function(e) {
        var r = new Uint8Array(e), n = String.fromCharCode.apply(null, r);
        return decodeURIComponent(escape(n));
    }
};