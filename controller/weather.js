const WeatherService = require('../service/weather');

module.exports = {
    getNowWeather: async(ctx, next) => {
        let {location} = ctx.request.body;
        // console.log(location);
        let res = await WeatherService.getNowWeather(location);
        ctx.send(res);
    },
    getThreeWeather: async(ctx, next) => {
        let {location, days} = ctx.request.body;
        let res = await WeatherService.getThreeWeather(location, days);
        ctx.send(res);
        // console.log(location);
    }
};
