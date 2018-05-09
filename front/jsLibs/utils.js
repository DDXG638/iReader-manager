(function () {
    window.GlobalUtils = {
        getParamFromUrl: function (key) {
            var search = location.search.substr(1),
                match = search.match(new RegExp('[?&]?' + key + '=([^=&]+)'));

            return match && match.length > 1 ? match[1] : '';
        },

        preloadImgs: function (imgs) {
            if (imgs && this.isArray(imgs)) {
                imgs.forEach(function (img) {
                    var imgDom = new Image();
                    imgDom.src = img;
                });
            }
        },

        ajax: function (options) {
            options.data = options.data || {};
            options.data.u = this.getCookie('u');
            options.data.s = this.getCookie('s');
            options.data.userKey = this.getCookie('userKey');
            options.data.channel = this.getCookie('channel');

            window.AppJsBridge.encryptData(options.data, function (sign) {
                var succFn = options.success;
                var errorFn = options.error;

                options.success = function (res) {
                    if (res.status == 0) {
                        succFn(res);
                    } else {
                        errorFn(res);
                    }
                };
                options.error = function (res) {
                    errorFn(res);
                };
                options.data.sign = sign;

                $.ajax(options);
            });
        },

        isMobile: function (mobile) {
            return /^1(3[0-9]|47|5[0-9]|7[013678]|8[0-9])\d{8}$/.test(mobile);
        },

        addCookie: function (key, value, domain, expireMilliseconds) {
            var date, str;
            str = key + '=' + value;
            date = new Date();
            date.setTime(date.getTime() + expireMilliseconds);
            return document.cookie = str + ';Domain=' + domain + ';expires=' + date.toUTCString() + ";Path=/";
        },

        getCookie: function(key) {
            var array, c, cookies, i, len, value;
            key = this.trim(key);
            cookies = document.cookie.split(';');
            value = null;
            for (i = 0, len = cookies.length; i < len; i++) {
                c = cookies[i];
                array = c.split('=');
                if (this.trim(array[0]) === key) {
                    value = this.trim(array[1]);
                    break;
                }
            }
            return value;
        },

        removeCookie: function (key, domain) {
            var value;
            if (key) {
                value = this.getCookie(key);
                if (value) {
                    this.addCookie(key, value, domain, -1);
                    return true;
                }
            }
            return false;
        },

        trim: function(str) {
            var result = str;
            if (str) {
                result = ('' + str).replace(/(^\s*)|(\s*$)/, '');
            }
            return result;
        },

        trimAll: function (str) {
            var result = str;
            if (str) {
                result = ('' + str).replace(/\s/g, '');
            }
            return result;
        },

        isType: function (obj, type) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        },

        isArray: function (obj) {
            return this.isType(obj, 'Array');
        }
    };
})();