(function () {
    'use strict';

    // 定义静态页面的数据
    var content = {
        "social": ['鲸鱼社交功能', '<p>1.鲸鱼社交功能是一个独特的功能，它让用户之间的互动成为可能。</p>' +
        '<p>2.你可以通过浏览书友的心情，发现自己感兴趣的人，跟ta进行私聊，或者你发条心情，等着别人来勾搭你。</p>' +
        '<p>3.你也可以完善自己的个人标签、编辑自己的个性签名，我们会为你推荐跟你最匹配的人。</p>' +
        '<p>4.要知道，你不是一个人在阅读。</p>'],
        "rose": ['如何发起聊天？', '<p>1.最最最简单的是，进入附近的书友版块，看看鲸鱼的书友们都发了什么心情，如果发现了感兴趣的人，不要犹豫点击一下右下角的私聊按钮吧，私聊之前可以顺手赞一下ta的心情哦~</p>' +
        '<p>2.当然啦，你也可以发一条心情，这样才能被别人发现，会有人来勾搭你哒~</p>'],
        "getRose": ['玫瑰是什么？', '<p>1.玫瑰是鲸鱼社交世界里面的勾搭货币，男孩纸找到自己想撩的女孩纸，然后将玫瑰送给女孩纸，就可以开始无限畅聊啦~</p>' +
        '<p>2.当然，女孩纸也可以不甘示弱，主动出击，看看自己是否能获得小哥哥们的玫瑰呢？</p>' +
        '<p>3.女孩纸们可以用收到的玫瑰来兑换女频小说的付费章节，男孩纸们希望你们不要计较，谁让你们都是男孩纸呢~</p>']
    };

    $(".js-toSocial").on("click", function () {
        window.location.hash = "#social";
    });

    $(".js-rose").on("click", function () {
        window.location.hash = "#rose";
    });

    $(".js-getRose").on("click", function () {
        window.location.hash = "#getRose";
    });

    window.addEventListener("hashchange", function () {
        var hash = window.location.hash;

        switch (hash) {
            case "#social":
            case "#rose":
            case "#getRose":
                $(".wrapper").hide();
                $(".wrapper-content .title").html(content[hash.substr(1)][0]);
                $(".wrapper-content .text").html(content[hash.substr(1)][1]);
                $(".wrapper-content").show();
                break;
            default:
                $(".wrapper-content").hide();
                $(".wrapper").show();
        }
    });
})();