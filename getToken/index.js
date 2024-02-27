const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const getToken = (params) => {
    return new Promise((resolve, reject) => {
        const tokenFile = path.join(__dirname, 'token.json');
        fs.readFile(tokenFile, 'utf-8', function (err, data) {
            if (err) {
                reject(err);
            } else {
                if (data) {
                    const token = JSON.parse(data);
                    if (token.expires_in > moment().unix()) {
                        resolve(token.access_token);
                        return;
                    }
                }
            }

            const appid = params.appid;
            const secret = params.secret;

            axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
                .then(res => {
                    if (res.data && res.data.errcode) {
                        reject(data);
                        return;
                    }
                    resolve(res.data.access_token);
                    const t = res.data;
                    t.expires_in = t.expires_in + moment().unix() - 1200;
                    fs.writeFile(tokenFile, JSON.stringify(t), function (err) {
                        if (err) {
                            reject(err);
                        }
                    })
                })
        })
    })
};

module.exports = {
    getToken
}