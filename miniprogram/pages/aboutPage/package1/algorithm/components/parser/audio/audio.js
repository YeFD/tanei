Component({
    data: {
        time: "00:00"
    },
    properties: {
        author: String,
        autoplay: Boolean,
        controls: Boolean,
        loop: Boolean,
        name: String,
        poster: String,
        src: {
            type: String,
            observer: function(t) {
                this.setSrc(t);
            }
        }
    },
    created: function() {
        var t = this;
        this._ctx = wx.createInnerAudioContext(), this._ctx.onError(function(e) {
            t.setData({
                error: !0
            }), t.triggerEvent("error", e);
        }), this._ctx.onTimeUpdate(function() {
            var e = t._ctx.currentTime, i = parseInt(e / 60), a = Math.ceil(e % 60), s = {};
            s.time = (i > 9 ? i : "0" + i) + ":" + (a > 9 ? a : "0" + a), t.lastTime || (s.value = e / t._ctx.duration * 100), 
            t.setData(s);
        }), this._ctx.onEnded(function() {
            t.setData({
                playing: !1
            });
        });
    },
    detached: function() {
        this._ctx.destroy();
    },
    pageLifetimes: {
        show: function() {
            this.data.playing && this._ctx.paused && this._ctx.play();
        }
    },
    methods: {
        setSrc: function(t) {
            this._ctx.autoplay = this.data.autoplay, this._ctx.loop = this.data.loop, this._ctx.src = t;
        },
        play: function() {
            this._ctx.play(), this.setData({
                playing: !0
            }), this.triggerEvent("play");
        },
        pause: function() {
            this._ctx.pause(), this.setData({
                playing: !1
            }), this.triggerEvent("pause");
        },
        seek: function(t) {
            this._ctx.seek(t);
        },
        _seeking: function(t) {
            if (!(t.timeStamp - this.lastTime < 200)) {
                var e = Math.round(t.detail.value / 100 * this._ctx.duration), i = parseInt(e / 60), a = e % 60;
                this.setData({
                    time: (i > 9 ? i : "0" + i) + ":" + (a > 9 ? a : "0" + a)
                }), this.lastTime = t.timeStamp;
            }
        },
        _seeked: function(t) {
            this.seek(t.detail.value / 100 * this._ctx.duration), this.lastTime = void 0;
        }
    }
});