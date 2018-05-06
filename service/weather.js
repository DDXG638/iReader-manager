'use strict';

const UID = "U3BCA4A555"; // 测试用 用户ID，请更换成您自己的用户ID
const KEY = "snzuhjymkwk0iotf"; // 测试用 key，请更换成您自己的 Key
const WeatherApi = require('./weatherUtil');
const optimist = require('optimist');

const api = new WeatherApi(UID, KEY);

module.exports = {
    getNowWeather: async (location) => {
        // console.log('jin');
        let argv = optimist.default('l', location).argv;

        /*api.getWeatherNow(argv.l).then(function(data) {
            console.log(JSON.stringify(data, null, 4));
            return {
                code: 0,
                data: data,
                msg: '获取天气信息成功！'
            };
        }).catch(function(err) {
            console.log(err.error.status);
            return {
                code: 1004,
                data: err,
                msg: '获取天气信息失败！'
            };
        });*/
        let res = await api.getWeatherNow(argv.l);
        if (res.status_code) {
            return {
                code: res.status_code,
                msg: res.status,
                data: res
            };
        } else {
            return {
                code: 0,
                msg: '',
                data: res
            };
        }
    },
    getThreeWeather: async(location, days) => {
        let argv = optimist.default({'l': location,'d': days}).argv;
        let res = await api.getWeatherThree(argv.l, argv.d);
        if (res.status_code) {
            return {
                code: res.status_code,
                msg: res.status,
                data: res
            };
        } else {
            return {
                code: 0,
                msg: '',
                data: res
            };
        }
    }
};


