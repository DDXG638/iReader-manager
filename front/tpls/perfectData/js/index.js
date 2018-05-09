(function () {
    'use strict';

    // 更换路径
    if (isBirthday && isLabel) {
        $(".img-status").attr('src', "//file.ihuayue.cn/group2/M00/06/D6/ChtgeFnIoWGActymAACt-Kfl-Cc815.png");
    }

    if (isBirthday && isLabel && isAutograph) {
        $(".img-status").attr('src', "//file.ihuayue.cn/group2/M00/06/D6/ChtgeFnIoPOARqW3AACtxNY3vJI512.png");
    }

    /*当客户端返回到这个页面时刷新页面，以及时显示按钮状态信息*/
    var isReload = false;
    AppJsBridge.pageActive(function () {
        if (isReload) {
            isReload = false;
            window.location.reload();
        }
    });

    // 完善生日
    $(".js-birth").on("tap", function () {
        if (isBirthday) {
            return;
        }

        if (isLogin && !isBirthday) {
            isReload = true;
            window.AppJsBridge.goWriteBirthday();
        }
        else {
            window.AppJsBridge.login(function () {
                window.location.reload();
            });
        }
  });

    //完善标签
    $(".js-labelling").on("tap", function () {
        if (isLabel) {
            return;
        }

        if (isLogin && !isLabel) {
            isReload = true;
            window.AppJsBridge.goWriteTag();
        } else {
            window.AppJsBridge.login(function () {
                window.location.reload();
            });
        }
    });

    // 完善个性签名
    $(".js-autograph").on("tap", function () {
        if (isAutograph) {
            return;
        }
        if (isLogin && !isAutograph) {
            isReload = true;
            window.AppJsBridge.goWriteSign();
        }
        else {
            window.AppJsBridge.login(function () {
                window.location.reload();
            });
        }
    });

    // 领取玫瑰
    $(".js-label-getting").on("tap", function () {
        if (!isBirthday) {
            AppJsBridge.showToast("请先完成前面的步骤");
            return;
        }

        GlobalUtils.ajax({
            url: "/apiJobs/finishJob",
            type: "POST",
            dataType: "json",
            data: {
                u: GlobalUtils.getCookie("u") || "",
                s: GlobalUtils.getCookie("s") || "",
                jobId: 4
            },
            success: function (res) {
                if (res.status == 0) {
                    AppJsBridge.showToast("奖励一朵玫瑰!");
                    setTimeout(function () {
                        window.location.reload();
                    }, 800);
                } else {
                    AppJsBridge.showToast("领取失败或者重复完成任务！");
                }
            },
            error: function (err) {
                AppJsBridge.showToast('领取失败或者重复完成任务！');
            }
        });
    });

    // 领取金券
    $(".js-autograph-getting").on("tap", function () {
        if (!isBirthday || !isLabel) {
            AppJsBridge.showToast("请先完成前面的步骤");
            return;
        }

        GlobalUtils.ajax({
            url: "/apiJobs/finishJob",
            type: "POST",
            dataType: "json",
            data: {
                u: GlobalUtils.getCookie("u") || "",
                s: GlobalUtils.getCookie("s") || "",
                jobId: 5
            },
            success: function (res) {
                if (res.status == 0) {
                    AppJsBridge.showToast("奖励100金券!");
                    setTimeout(function () {
                        window.location.reload();
                    }, 800);
                }
                else {
                    AppJsBridge.showToast("领取失败或者重复完成任务！");
                }
            },
            error: function (err) {
                AppJsBridge.showToast("领取失败或者重复完成任务!");
            }
        });
    });
})();