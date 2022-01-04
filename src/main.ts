import md5 = require('md5');

const https = require('https');
const url = require('url');
const {URLSearchParams} = url;
import {appId, appSecret} from './private';

const salt = Math.random();

const translate = (word) => {
  // 接口地址：http://fanyi-api.fanyi.baidu.com/api/trans/vip/translate?q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4
  // sign: appid+q+salt+密钥的MD5值
  const sign = md5(appId + word + salt + appSecret);
  const searchParams = new URLSearchParams({
    q: word,
    from: 'en',
    to: 'zh',
    appid: appId,
    salt,
    sign
  }).toString();
  const options = {
    hostname: 'fanyi-api.baidu.com',
    port: 443,
    path: `/api/trans/vip/translate?${searchParams}`,
    method: 'GET'
  };

  const request = https.request(options, (response) => {
    let chunks = [];
    response.on('data', (chunk) => {
      chunks += chunk;
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      console.log(string);
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
};


export {
  translate
};