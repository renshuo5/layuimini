/*AjaxUtil*/
/*工具类，类似java静态工具类*/

/**
 * url：请求路径（不可为空）

 params：请求参数（不可为空）

 ft：回调方法（不可为空,返回code要为200）

 fairFt: 失败回调方法，可为空

 method：请求方法（可以为空）默认为post

 headers：请求头（true：设置请求头“authorization”和“refresh_token”，false：就设置请求头“authorization”，为空就不设置）（可以为空）

 noAuthorityFt：无权限响应 （可以为空）


 */
layui.define(function (exports) {
    // do something
    var $ = layui.jquery;

    var ajaxUtil = {};

    /**
     * restful风格提交方法参数 设置 post,get,put,delete
     * @param url
     * @param params
     * @param ft 成功回调方法
     * @param fairFt 失败回调方法，可为空,undefined
     * @param headers 请求头 true/false/undefined
     */
    ajaxUtil.post = function(url, params, ft, fairFt,headers){
        ajaxUtil.sendAjax(url, params, ft, fairFt,"POST",headers,undefined);
    };

    ajaxUtil.get = function(url, params, ft, fairFt,headers){
        ajaxUtil.sendAjax(url, params, ft, fairFt,"GET",headers,undefined);
    };

    ajaxUtil.put = function(url, params, ft, fairFt,headers){
        ajaxUtil.sendAjax(url, params, ft, fairFt,"PUT",headers,undefined);
    };
    ajaxUtil.delete = function(url, params, ft, fairFt,headers){
        ajaxUtil.sendAjax(url, params, ft, fairFt,"DELETE",headers,undefined);
    };

    /*ajax请求*/
    ajaxUtil.sendAjax = function (url, params, ft, fairFt,method, headers, noAuthorityFt) {
        var roleSaveLoading = layer.msg('数据提交中，请稍候', {icon: 16, time: false});
        $.ajax({
            url: url,
            cache: false,
            async: true ,
            data: params,
            type: method == undefined ? "POST" : method,
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            beforeSend: function (request) {
                if (headers == undefined) {

                } else if (headers) {
                    request.setRequestHeader("authorization", "Bearer " + ajaxUtil.getData("token"));
                    request.setRequestHeader("refresh_token", "Bearer " + ajaxUtil.getData("refresh_token"));
                } else {
                    request.setRequestHeader("authorization", "Bearer " + ajaxUtil.getData("token"));
                }

            },
            success: function (res) {
                layer.close(roleSaveLoading);
                if (typeof ft == "function") {
                    if (res.code == 401001) { //凭证过期重新登录
                        layer.msg("凭证过期请重新登录")
                        top.window.location.href = "/index/login"
                    } else if (res.code == 401002) {  //根据后端提示刷新token
                        /*记录要重复刷新的参数*/
                        var reUrl = url;
                        var reParams = params;
                        var reFt = ft;
                        var reMethod = method;
                        var reHeaders = headers;
                        var reNoAuthorityFt = noAuthorityFt;
                        /*刷新token  然后存入缓存*/
                        ajaxUtil.sendAjax("/sys/user/token", null, function (res) {
                            if (res.code == 0) {
                                ajaxUtil.setData("token", res.data);
                                /*刷新成功后继续重复请求*/
                                ajaxUtil.sendAjax(reUrl, reParams, reFt, reMethod, reHeaders, reNoAuthorityFt);
                            } else {
                                layer.msg("凭证过期请重新登录");
                                top.window.location.href = "/index/login"
                            }
                        }, "GET", true)
                    } else if (res.code == 200) {
                        if (ft != null && ft != undefined) {
                            ft(res);
                        }

                    } else if (res.code == 401008) {//无权限响应
                        if (ft != null && ft != undefined) {
                            noAuthorityFt(res);
                        }

                    } else {
                        layer.msg(res.msg);
                        if (fairFt != null && fairFt != undefined && typeof fairFt == "function") {
                            fairFt(res);
                        }
                    }

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                layer.close(roleSaveLoading);
                if (XMLHttpRequest.status == 404) {
                    top.window.location.href = "/index/404.html";
                } else {
                    layer.msg("服务器好像除了点问题！请稍后试试");
                }
            }
        });
    };
    /*表单数据封装成 json String*/
    ajaxUtil.formJson = function (frm) {  //frm：form表单的id
        var o = {};
        var a = $("#" + frm).serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return JSON.stringify(o);
    };
    /*存入本地缓存*/
    ajaxUtil.setData = function (key, value) {
        layui.data('LocalData', {
            key: key,
            value: value
        })
    };
    /*从本地缓存拿数据*/
    ajaxUtil.getData = function (key) {
        var localData = layui.data('LocalData');
        return localData[key];
    };


    ajaxUtil.formattime = function (val) {
        var date = new Date(val);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month > 9 ? month : ('0' + month);
        var day = date.getDate();
        day = day > 9 ? day : ('0' + day);
        var hh = date.getHours();
        hh = hh > 9 ? hh : ('0' + hh);
        var mm = date.getMinutes();
        mm = mm > 9 ? mm : ('0' + mm);
        var ss = date.getSeconds();
        ss = ss > 9 ? ss : ('0' + ss);
        var time = year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss;
        return time;
    };


    // 输出 demo 模块
    exports('ajaxUtil', ajaxUtil);
});

