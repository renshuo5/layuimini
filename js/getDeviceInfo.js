function getPhoneBrand() {
    var phoneInfo = {
        "phoneType": "",
        "brand": "",
        "model": "",
        "platform": "",
        "platformVersion": "",
        "uuid": "",
        "os": "",
        "appName": "",
        "appVersion": "",
        "language": "",
        "onLine": "",
        "screen": {
            "width": 0,
            "height": 0,
            "colorDepth": 0
        }
    };

    var ua = navigator.userAgent;
    var os = getOs();
    var browser = getBrowser();

    phoneInfo.phoneType = checkPhoneType();
    phoneInfo.brand = checkPhoneBrand();
    phoneInfo.model = checkPhoneModel();
    phoneInfo.platform = checkPlatform();
    phoneInfo.platformVersion = checkPlatformVersion();
    phoneInfo.uuid = generateUUID();
    phoneInfo.os = os.type;
    phoneInfo.appName = browser.name;
    phoneInfo.appVersion = browser.version;
    phoneInfo.language = navigator.language;
    phoneInfo.onLine = navigator.onLine;
    phoneInfo.screen.width = window.screen.width;
    phoneInfo.screen.height = window.screen.height;
    phoneInfo.screen.colorDepth = window.screen.colorDepth;

    console.log(phoneInfo);
}

function checkPlatformVersion() {
    var userAgent = navigator.userAgent;
    var platformVersion = 'Unknown';

    // 检查Android设备
    if (/Android/i.test(userAgent)) {
        var match = userAgent.match(/Android (\d+\.\d+)/);
        if (match && match.length > 1) {
            platformVersion = match[1];
        }
    }

    // 检查iOS设备
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        var match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
        if (match && match.length > 1) {
            var major = match[1];
            var minor = match[2];
            var patch = match[3] || '0';
            platformVersion = major + '.' + minor + '.' + patch;
        }
    }

    return platformVersion;
}


function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}


//获取设备系统
function getSystemVersion() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    if (isAndroid) {
        var version = (u.match(/(Android)\s*(\d+)\.(\d+)\.(\d+)/)) || (u.match(/(Android)\s*(\d+)\.(\d+)/));
        if (version) {
            version = version.slice(1);
            version = version.join('.');
        } else {
            version = '0.0';
        }
        console.log('Android版本：' + version);
    }
    if (isiOS) {
        var version = (u.match(/(iPhone\sOS)\s*(\d+)\_(\d+)\_?(\d+)?/)) || (u.match(/(iPhone\sOS)\s*(\d+)\_(\d+)/));
        if (version) {
            version = version.slice(1);
            version = version.join('.');
        } else {
            version = '0.0';
        }
        console.log('iOS版本：' + version);
    }
}

// 检查不同的浏览器
function getBrowser() {
    var userAgent = navigator.userAgent;
    var browserName = "Unknown";
    var browserVersion = "Unknown";

    // 检查不同的浏览器
    if (/Trident|MSIE/i.test(userAgent)) {
        browserName = "Internet Explorer";
        var matches = /MSIE (\d+\.\d+);/.exec(userAgent);
        if (matches) {
            browserVersion = matches[1];
        }
    } else if (/Edge/i.test(userAgent)) {
        browserName = "Microsoft Edge";
        var matches = /Edge\/(\d+\.\d+)/.exec(userAgent);
        if (matches) {
            browserVersion = matches[1];
        }
    } else if (/Firefox/i.test(userAgent)) {
        browserName = "Mozilla Firefox";
        var matches = /Firefox\/(\d+\.\d+)/.exec(userAgent);
        if (matches) {
            browserVersion = matches[1];
        }
    } else if (/OPR|Opera/i.test(userAgent)) {
        browserName = "Opera";
        var matches = /Opera\/(\d+\.\d+)/.exec(userAgent);
        if (matches) {
            browserVersion = matches[1];
        }
    } else if (/Chrome|CriOS/i.test(userAgent)) {
        browserName = "Google Chrome";
        var matches = /Chrom\/(\d+\.\d+)/.exec(userAgent);
        if (matches) {
            browserVersion = matches[1];
        }
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
        browserName = "Apple Safari";
        var matches = /Version\/(\d+\.\d+)/.exec(userAgent);
        if (matches) {
            browserVersion = matches[1];
        }
    }

    return {
        name: browserName,
        version: browserVersion
    };
}