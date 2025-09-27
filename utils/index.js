const fs = require('fs');
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
const getWeather = (params) => {
    return new Promise((resolve, reject) => {

        const appid = params.wea_app_id;
        const appsecret = params.wea_app_secret;
        const cityid = params.wea_city_id;
        // http://v1.yiketianqi.com/free/day?appid=${appid}&appsecret=${appsecret}&unescape=1&cityid=${cityid}
        axios.get(`http://v1.yiketianqi.com/api?unescape=1&version=v61&appid=${appid}&appsecret=${appsecret}&cityid=${cityid}`)
            .then(res => {
                const { data } = res;
                resolve({
                    wea: data.wea,
                    low: data.tem2,
                    high: data.tem1
                })
            })
            .catch(err => {
                reject(err);
            })
    })
}


// 3. 获取恋爱天数
const getLoveDays = () => {
    const startDate = new Date('2023-02-12');
    const currentUTCTime = new Date().toISOString();
    const beijingTime = new Date(new Date(currentUTCTime).getTime() + (8 * 60 * 60 * 1000)); // 将UTC时间转换为北京时间

    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const daysDiff = Math.floor((beijingTime - startDate) / oneDayMilliseconds);

    return daysDiff.toString();
}


// 4. 获取生理期信息
const readJSONFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('读取 JSON 文件时出错:', err);
        return null;
    }
}

const getValueByMonth = () => {
    const currentMonth = new Date().getMonth() + 1; // 0 ~ 11 ==> 1 ~ 12
    const currentDay = new Date().getDate();

    const monthsList = ['NULL', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    const jsonData = readJSONFile('utils/record.json');

    // console.log(currentMonth);
    // console.log(currentDay);

    // console.log(jsonData[monthsList[currentMonth]]);
    // exit()
    

    if (jsonData[monthsList[currentMonth]] == "NULL") {
        const value = jsonData[monthsList[currentMonth - 1]];
        if (currentDay <= value) {
            return `${currentMonth - 1}.${value}，预计于 ${value - currentDay} 天后到来！`;
        } else {
            return `${currentMonth - 1}.${value}，较上月已推迟 ${currentDay - value + 2} 天！`;
        }
    } else {
        const value = jsonData[monthsList[currentMonth]];
        const diff = currentDay - value + 1;
        
        // console.log(currentMonth);
        // console.log(monthsList[currentMonth]);
        // console.log(jsonData[monthsList[currentMonth]]);
        // console.log(value);
        // console.log(diff);
        // exit();

        const pre = `${currentMonth}.${value}, 第 ${diff} 天咯，`;
        const post = diff <= 7 ? '禁止喝小甜水 / 吃冰淇淋！' : '哦呦, 想喝啥喝吧喝吧...';

        return `${pre}${post}`;
    }
}


module.exports = {
    getDate,
    getWeather,
    getLoveDays,
    getValueByMonth
}
