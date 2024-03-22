layui.define(function (exports) {
    // do something
    var $ = layui.jquery;

    /*
     * url: '', //指定请求地址
     param: {}, //参数
     value: 'id', //key的值
     text: 'name', //text展示的值
     defaultValue: '', //默认选中的值
     data: function (data) { //对返回的结果进行处理
     return data;
     },
     success: function(){
     }
     * */

    var select = {};

    select.render = function (option) {

        var defaultSetting = {
            url: '',
            param: {},
            value: 'id',
            text: 'name',
            data: function (data) {
                return data;
            }
        };

        $.extend(defaultSetting, option);

        var optionStr = '';

        $.post(defaultSetting.url, defaultSetting.param, function (res) {

            var data = defaultSetting.data(res.data);

            optionStr=optionStr+'<option value="0" >请选择</option>';
            for (var i = 0; i < data.length; i++) {
                optionStr = optionStr + ' <option value="' + data[i][defaultSetting.value] + '" selected>' + data[i][defaultSetting.text] + '</option>';
            }
            var selectJq = $(option.id);
            selectJq.append(optionStr);
            if (defaultSetting.defaultValue) {
                selectJq.val(option.defaultValue);
            }
            if (defaultSetting.success) {
                option.success();
            }
        });

    };
    // 输出 demo 模块
    exports('select', select);
});