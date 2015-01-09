// is.js 0.0.1
// Author Aras Atasaygin

;(function() {

    // Baseline
    /* -------------------------------------------------------------------------- */

    var root = this;

    // define 'is' object and current version
    var is = {};
    is.not = {};
    is.all = {};
    is.VERSION = '0.0.1';

    // TODO: Add AMD and CommonJS support
    // 'is' object set global to the browser window
    root.is = is;

    // cache some methods to call later on
    var toString = Object.prototype.toString;
    var arraySlice = Array.prototype.slice;

    // helper function which reverses the sense of predicate result
    function not(func) {
        return function() {
            return !func.apply(null, arraySlice.call(arguments));
        };
    }

    // helper function which call predicate function per parameter
    function all(func) {
        return function() {
            var parameters = arraySlice.call(arguments);
            var length = parameters.length;
            var results = [];
            for (var i = 0; i < length; i++) {
                results.push(func.call(null, parameters[i]));
            }
            for (i = 0; i < results.length; i++) {
                if(results[i] === false) return false;
            }
            return true;
        };
    }

    // Type checks
    /* -------------------------------------------------------------------------- */

    // is a given value Arguments?
    is.arguments = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Arguments]' || (typeof value === 'object' && 'callee' in value);
    };

    // is a given value Array?
    is.array = Array.isArray || function(value) {    // check native isArray first
        return toString.call(value) === '[object Array]';
    };

    // is a given value Boolean?
    is.boolean = function(value) {
        return value === true || value === false;
    };

    // is a given value Date Object?
    is.date = function(value) {
        return toString.call(value) === '[object Date]';
    };

    // is a given value Error object?
    is.error = function(value) {    // TODO: check error types
        return toString.call(value) === '[object Error]';
    };

    // is a given value function?
    is.function = function(value) {    // fallback check is for IE
        return toString.call(value) === '[object Function]' || typeof value == 'function';
    };

    // is a given value NaN?
    is.nan = isNaN || function(value) {    // NaN is number :) Also it is the only value which does not equal itself
        return is.number(value) && value !== value;
    };

    // is a given value null?
    is.null = function(value) {
        return value === null || toString.call(value) === '[object Null]';
    };

    // is a given value number?
    is.number = function(value) {
        return toString.call(value) === '[object Number]';
    };

    // is a given value object?
    is.object = function(value) {
        return toString.call(value) === '[object Object]';
    };

    // is a given value RegExp?
    is.regexp = function(value) {
        return toString.call(value) === '[object RegExp]';
    };

    // are given values same type?
    is.sameType = function(value1, value2) {
        if(is.nan(value1) || is.nan(value2)) {    // prevent NaN, Number same type check
            return is.nan(value1) === is.nan(value2);
        }
        return toString.call(value1) === toString.call(value2);
    };

    // is a given value String?
    is.string = function(value) {
        return toString.call(value) === '[object String]';
    };

    // is a given value undefined?
    is.undefined = function(value) {
        return value === void 0;
    };

    // Presence checks
    /* -------------------------------------------------------------------------- */

    // is a given value empty? Objects, arrays, strings
    is.empty = function(value) {
        if(is.null(value)) {
            return false;
        } else if(is.object(value)) {
            for(var prop in value) {
                if(value.hasOwnProperty(prop))
                    return false;
            }
            return true;
        } else if(is.array(value) || is.arguments(value)) {
            return value.length === 0;
        } else {    // string case
            return value === '';
        }
    };

    // is a given value existy?
    is.existy = function(value) {    // check null and undefined with loose =!
        return value != null;
    };

    // is a given value truthy?
    is.truthy = function(value) {
        return is.existy(value) && value !== false;
    };

    // is a given value falsy?
    is.falsy = not(is.truthy);

    // is a given value space?
    // horizantal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
    is.space =  function(value) {
        if(is.string(value)) {        
            var characterCode = value.charCodeAt(0);
            return (characterCode >  8 && characterCode < 14) || characterCode === 32;
        }
    };

    // Arithmetic checks
    /* -------------------------------------------------------------------------- */
    
    // are given values equal? supports numbers, strings, regexps, booleans
    // TODO: Add object and array support
    is.equal = function(value1, value2) {
        // check 0 and -0 equity with Infinity and -Infinity
        if(is.all.number(value1, value2)) return value1 === value2 && 1 / value1 === 1 / value2;
        // check regexps as strings too
        if(is.all.string(value1, value2) || is.all.regexp(value1, value2)) return '' + value1 === '' + value2;
        if(is.all.boolean(value1, value2)) return value1 === value2;
        return false;
    };

    // is a given number even?
    is.even = function(numb) {
        return is.number(numb) && numb % 2 === 0;
    };

    // is a given number odd?
    is.odd = not(is.even);

    // is a given number positive?
    is.positive = function(numb) {
        return is.number(numb) && numb > 0;
    };

    // is a given number negative?
    is.negative = not(is.positive);

    // is a given number above minimum parameter?
    is.above = function(numb, min) {
        return is.all.number(numb, min) && numb > min;
    };

    // is a given number equal or higher than a minimum parameter?
    is.least = not(is.above);

    // is a given number within minimum and maximum parameters?
    is.within = function(numb, min, max) {
        return is.all.number(numb, min) && numb > min && numb < max;
    };

    // is a given number decimal?
    is.decimal = function(numb) {
        return is.number(numb) && numb % 1 === 0;
    };

    // is a given number finite?
    is.finite = isFinite || function(numb) {
        return numb !== Infinity && numb !== -Infinity && is.not.nan(numb);
    };

    // is a given number infinite?
    is.infinite = not(is.finite);

    // Regexp checks
    /* -------------------------------------------------------------------------- */
    // Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
    // Scott Gonzalez: Email address validation

    // eppPhone match extensible provisioning protocol format
    // nanpPhone match north american number plan format
    // date match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month, and two or four digits for the year
    // time match hours, minutes, and seconds, 24-hour clock
    var regexps = {
        url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
        creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
        alphaNumeric: /^[A-Za-z0-9]+$/,
        time: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
        dateString: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}$/,
        usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/,
        caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]?[0-9][A-Z][0-9]$/,
        ukPostCode: /^[A-Z]{1,2}[0-9R][0-9A-Z]?[0-9][ABD-HJLNP-UW-Z]{2}$/,
        nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
        eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
        socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-(?!00)[0-9]{2}-(?!0000)[0-9]{4}$/,
        affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/
    };

    // regexp check method generator
    for(var regexp in regexps) {
        if(regexps.hasOwnProperty(regexp)) {
            (function() {
                var r = regexp;
                    is[r] = function(value) {
                        return regexps[r].test(value);
                    };
            })();
        }
    }

    // String checks
    /* -------------------------------------------------------------------------- */
    
    // is a given string inculde parameter substring?
    is.include = String.prototype.includes || function(str, substr) {
        return str.indexOf(substr) > -1;
    };

    // is a given string all uppercase?
    is.upperCase = function(str) {
        return is.string(str) && str === str.toUpperCase();
    };

    // is a given string all lowercase?
    is.lowerCase = function(str) {
        return is.string(str) && str === str.toLowerCase();
    };

    // is string start with a given startWith parameter?
    is.startWith = function(str, startWith) {
        return is.string(str) && str.indexOf(startWith) === 0;
    };

    // is string end with a given endWith parameter?
    is.endWith = function(str, endWith) {
        return is.string(str) && str.indexOf(endWith) === str.length -  endWith.length;
    };

    // is a given string string or sentence capitalized?
    is.capitalized = function(str) {
        if(is.not.string(str)) return false;
        var words = str.split(' ');
        var capitalized = [];
        for(var i = 0; i < words.length; i++) {
            capitalized.push(words[i][0] === words[i][0].toUpperCase());
        }
        return is.all.truthy.apply(null, capitalized);
    };

    // Time checks
    /* -------------------------------------------------------------------------- */

    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    
    // is a given date indicate today?
    is.today = function(obj) {
        var now = new Date();
        var todayString = now.toDateString();
        return is.date(obj) && obj.toDateString() === todayString;
    };

    // is a given date indicate yesterday?
    is.yesterday = function(obj) {
        var now = new Date();
        var yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
        return is.date(obj) && obj.toDateString() === yesterdayString;
    };

    // is a given date indicate tomorrow?
    is.tomorrow = function(obj) {
        var now = new Date();
        var tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
        return is.date(obj) && obj.toDateString() === tomorrowString;
    };

    // is a given date past?
    is.past = function(obj) {
        var now = new Date();
        return is.date(obj) && obj.getTime() < now.getTime();
    };

    // is a given date future?
    is.future = not(is.past);

    // is a given dates day equal given dayString parameter?
    is.day = function(obj, dayString) {
        var now = new Date();
        return is.date(obj) && dayString.toLowerCase() === days[now.getDay()];
    };

    // is a given dates month equal given monthString parameter?
    is.month = function(obj, monthString) {
        var now = new Date();
        return is.date(obj) && monthString.toLowerCase() === months[now.getMonth()];
    };

    // is a given dates year equal given year parameter?
    is.year = function(obj, year) {
        var now = new Date();
        return is.date(obj) && is.number(year) && year === now.getFullYear();
    };

    // is a given date weekend?
    // 6: Saturday, 0: Sunday
    is.weekend = function(obj) {
        return is.date(obj) && (obj.getDay() === 6 || obj.getDay() === 0);
    };

    // is a given date weekday?
    is.weekday = not(is.weekend);

    // is date within given range?
    is.inDateRange = function(obj, startObj, endObj) {
        if(is.not.date(obj) || is.not.date(startObj) || is.not.date(endObj)) return false;
        var givenDate = obj.getTime();
        var start = startObj.getTime();
        var end = endObj.getTime();
        return givenDate > start && givenDate < end;
    };

    // is a given date in last week range?
    is.inLastWeek = function(obj) {
        return is.inDateRange(obj, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
    };

    // is a given date in last month range?
    is.inLastMonth = function(obj) {
        return is.inDateRange(obj, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date());
    };

    // is a given date in last year range?
    is.inLastYear = function(obj) {
        return is.inDateRange(obj, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
    };

    // is a given date in next week range?
    is.inNextWeek = function(obj) {
        return is.inDateRange(obj, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
    };

    // is a given date in next month range?
    is.inNextMonth = function(obj) {
        return is.inDateRange(obj, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
    };

    // is a given date in next year range?
    is.inNextYear = function(obj) {
        return is.inDateRange(obj, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    };

    // is a given date in the parameter quarter?
    is.quarterOfYear = function(obj, quarterNumber) {
        return is.date(obj) && is.number(quarterNumber) && quarterNumber === Math.floor((obj.getMonth() + 3) / 3);
    };

    // is a given date in daylight saving time?
    is.dayLightSavingTime = function(obj) {        
        var january = new Date(obj.getFullYear(), 0, 1);
        var july = new Date(obj.getFullYear(), 6, 1);
        var stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
        return obj.getTimezoneOffset() < stdTimezoneOffset;
    };

    // Environment checks
    /* -------------------------------------------------------------------------- */

    var userAgent = 'navigator' in window && navigator.userAgent.toLowerCase() || '';
    var vendor = 'navigator' in window && navigator.vendor.toLowerCase() || '';
    var appVersion = 'navigator' in window && navigator.appVersion.toLowerCase() || '';

    // is current browser chrome?
    is.chrome = function() {
        return /chrome|chromium/i.test(userAgent) && /google inc/.test(vendor);
    };

    // is current browser firefox?
    is.firefox = function() {
        return /firefox/i.test(userAgent);
    };

    // is current browser internet explorer?
    // parameter is optional
    is.ie = function(version) {
        if(!version) return /msie/i.test(userAgent);
        return new RegExp('msie ' + version).test(userAgent);
    };

    // is current browser opera?
    is.opera = function() {
        return /opr/i.test(userAgent);
    };

    // is current browser safari?
    is.safari = function() {
        return /safari/i.test(userAgent) && /apple computer/i.test(vendor);
    };

    // is current device ios?
    is.ios = function() {
        return is.iphone() || is.pad() || is.ipod();
    };

    // is current device iphone?
    is.iphone = function() {
        return /iphone/i.test(userAgent);
    };

    // is current device ipad?
    is.ipad = function() {
        return /ipad/i.test(userAgent);
    };

    // is current device ipod?
    is.ipod = function() {
        return /ipod/i.test(userAgent);
    };

    // is current device android?
    is.android = function() {
        return /android/i.test(userAgent);
    };

    // is current device android tablet?
    is.androidPhone = function() {
        return /android/i.test(userAgent) && /mobile/i.test(userAgent);
    };

    // is current device android tablet?
    is.androidTablet = function() {
        return /android/i.test(userAgent) && !/mobile/i.test(userAgent);
    };

    // is current device mobile?
    is.mobile = function() {
        return is.iphone() || is.ipod() || is.androidPhone();
    };

    // is current device tablet?
    is.tablet = function() {
        return is.ipad() || is.androidTablet();
    };

    // is current device desktop?
    is.desktop = function() {
        return is.not.mobile() && is.not.tablet();
    };

    // is current operating system linux?
    is.linux = function() {
        return /linux/i.test(appVersion);
    };

    // is current operating system mac?
    is.mac = function() {
        return /mac/i.test(appVersion);
    };

    // is current operating system windows?
    is.windows = function() {
        return /win/i.test(appVersion);
    };

    // is current state online?
    is.online = function() {
        return navigator.online;
    };

    // is current state offline?
    is.offline = not(is.online);

    // Array checks
    // ------------

    // Object checks
    // -------------

    // DOM checks
    // ----------

    // Syntax checks
    // ----------

    // ES6 checks
    // ----------

    // 'not' and 'all' interfaces
    // --------------------------
    is.not.number = not(is.number);
    is.all.number = all(is.number);
    is.not.string = not(is.string);
    is.all.string = all(is.string);
    is.not.regexp = not(is.regexp);
    is.all.regexp = all(is.regexp);
    is.not.boolean = not(is.boolean);
    is.all.boolean = all(is.boolean);
    is.not.nan = not(is.nan);
    is.all.nan = all(is.nan);
    is.not.truthy = not(is.truthy);
    is.all.truthy = all(is.truthy);
    is.not.date = not(is.date);
    is.all.date = all(is.date);
    is.not.mobile = not(is.mobile);
    is.not.tablet = not(is.tablet);

}.call(this));
