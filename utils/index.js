const axios = require('axios');

// 1. 获取时间
const formatWeek = (week) => {
    switch (week) {
        case 1:
            return '星期一'; break;
        case 2:
            return '星期二'; break;
        case 3:
            return '星期三'; break;
        case 4:
            return '星期四'; break;
        case 5:
            return '星期五'; break;
        case 6:
            return '星期六'; break;
        case 0:
            return '星期日'; break;
        default:
            break;
    }
}

const getDate = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();

    const week = new Date().getDay();
    return `${year}年${month}月${day}日  ${formatWeek(week)}`;
}


// 2. 获取天气
const getWeather = () => {
    return new Promise((resolve, reject) => {

        const appId = 'xxxxxxxx';
        const appSecret = 'xxxxxxxx';
        const cityID = '101220501'; // 马鞍山

        axios.get(`http://v1.yiketianqi.com/free/day?appid=${appId}&appsecret=${appSecret}&unescape=1&cityid=${cityID}`)
            .then(res => {
                const { data } = res;
                resolve({
                    wea: data.wea,
                    low: data.tem_night,
                    high: data.tem_day
                })
            })
            .catch(err => {
                reject(err);
            })
    })
}


// 3. 获取土味情话
const getLoveWords = () => {
    return new Promise((resolve, reject) => {

        const apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

        axios.get(`https://apis.tianapi.com/saylove/index?key=${apiKey}`)
            .then(res => {
                const { data: { result } } = res;
                resolve(result.content)
            })
            .catch(err => {
                reject(err);
            })
    })
}


// 4. 获取恋爱天数
const getLoveDays = () => {
    const startDate = new Date('2023-02-12');
    const currentUTCTime = new Date().toISOString();
    const beijingTime = new Date(new Date(currentUTCTime).getTime() + (8 * 60 * 60 * 1000));

    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor((beijingTime - startDate) / oneDayMilliseconds);
    return daysDiff.toString();
}


module.exports = {
    getDate,
    getWeather,
    getLoveWords,
    getLoveDays
}
