layui.use(['layer', 'jquery', 'ajaxUtil','premUtil'], function () {
    var $ = layui.jquery,
        form = layui.form,
        ajaxUtil = layui.ajaxUtil,
        premUtil = layui.premUtil,
        layer = layui.layer;
    layer.ready(function () {
        // 如果会话性存储 数据为空，返回登录界面
        if (layui.data('LocalData') === {}) {
            location.href = '/login.html'; //登录主页
        } else {
            // 如果会话性存储data键为空
            if (layui.data('LocalData') != null) {
                // 如果会话性存储data键第一个键token为空
                if (ajaxUtil.getData("token") === '' || ajaxUtil.getData("token") ===undefined) {
                    // 返回到登录界面
                    location.href = '/login.html'; //登录主页
                }
            }
            // 返回登录界面
            else {
                location.href = '/login.html'; //登录主页
            }
        }
        ajaxUtil.setData("lastTime", new Date().getTime());

        //按钮权限
        premUtil.renderPerm();

    });


    var lastTime = new Date().getTime();
    var currentTime = new Date().getTime();
    var timeOut = 30 * 60 * 1000; //设置超时时间： 30分

    window.onload = function () {
        window.document.onmousedown = function () {
            // localStorage.setItem("lastTime", new Date().getTime());
            ajaxUtil.setData("lastTime", new Date().getTime());
        }
    };

    function checkTimeout() {
        currentTime = new Date().getTime(); //更新当前时间
        lastTime = ajaxUtil.getData("lastTime");
        if (currentTime - lastTime > timeOut) { //判断是否超时
            layui.data('LocalData', null); // 删除 test 表
            layer.alert('长时间不操作，已退出登录', {
                icon: 0,
                shadeClose: true,
                title: '提示'
            }, function(){
                location.href = '/login.html'; //登录页面
            });

        }
    }

    /* 定时器 间隔30秒检测是否长时间未操作页面 */
    window.setInterval(checkTimeout, 10 * 1000);

});


