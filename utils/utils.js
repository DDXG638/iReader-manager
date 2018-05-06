function leading0(num) {
    return num < 10 ? '0' + num : num;
}

var MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'];

var WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

Date.prototype.format = function (format) {

    var date = this.getDate();     // 1-31
    var week = this.getDay();      // 0-6
    var month = this.getMonth();    // 0-11
    var year = this.getFullYear(); // yyyy
    var hour = this.getHours();    // 0-23
    var minute = this.getMinutes();  // 0-59
    var second = this.getSeconds();  // 0-59
    var millisecond = this.getMilliseconds(); // 0-999

    // PHP 格式的替换
    var formatPattern = /[djDlwmnFMYyaAgGhHis]/g;
    var formatReplace = {
        // Date
        d: leading0(date),
        j: date,
        // Week
        D: WEEK[week],
        l: WEEK[week].substr(0, 3),
        w: week,
        // Month
        m: leading0(month + 1),
        n: month + 1,
        'F': MONTH[month],
        M: MONTH[month].substr(0, 3),
        // Year
        Y: year,
        y: (year + '').substr(2, 4),
        // Hour
        a: (hour / 12) >= 1 ? 'pm' : 'am',
        A: ((hour / 12) >= 1 ? 'pm' : 'am').toUpperCase(),
        g: hour % 12,
        G: leading0(hour % 12),
        h: hour,
        H: leading0(hour),
        // Minute
        i: leading0(minute),
        // Second
        s: leading0(second)
    };

    return format.replace(formatPattern, function ($0, $1) {
        return formatReplace[$0];
    });
};

module.exports = {
    formatTime: function (format, date) {
        date = date instanceof Date ? date : (date ? new Date(~~date * 1000) : new Date());

        if (!(date instanceof Date)) {
            throw new TypeError('parse date error');
        }
        return date.format(format);
    }
};
