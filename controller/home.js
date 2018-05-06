

const HomeService = require("../service/home");

module.exports = {
    // 设置路由
    index: async (ctx, next) => {
        await ctx.render("home/index", {title: "欢迎您ddxg！"});
        // ctx.response.body = `<h1>index page</h1>`;
    },

    // 获取get请求连接中的参数
    main: async (ctx, next) => {
        // console.log(ctx.request.query);
        // console.log(ctx.request.querystring);
        ctx.response.body = `<h1>main page</h1>`;
    },

    homeParams: async (ctx, next) => {
        // console.log(ctx.params);
        ctx.response.body = `<h1>home page-id:${ctx.params.id}-name:${ctx.params.name}</h1>`;
    },

    user: async (ctx, next) => {
        await ctx.render("home/login", {
            btnName: "快快登陆"
        });
        /*ctx.response.body =
            `
              <form action="/user/register" method="post">
                <input name="name" type="text" placeholder="请输入用户名：ikcamp"/> 
                <br/>
                <input name="password" type="text" placeholder="请输入密码：123456"/>
                <br/> 
                <button>GoGoGo</button>
              </form>
            `;*/
    },

    // post提交获取数据
    register: async (ctx, next) => {
        let {name, password} = ctx.request.body;
        let res = await HomeService.register(name, password);
        if (res.status == "-1") {
            await ctx.render("home/login", res.data);
        } else {
            await ctx.render("home/success", res.data);
        }
        // ctx.response.body = data;
    },

    errorPage: async (ctx, next) => {
        ctx.response.body = `<h1>404 page</h1>`;
    },
};