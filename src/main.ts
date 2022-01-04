import md5 = require('md5');

const https = require('https');
const url = require('url');
const {URLSearchParams} = url;
import {appId, appSecret} from './private';
import {ClientRequest} from 'http';

const salt = Math.random();
// 52000 	 成功
//  52001 	 请求超时 	 请重试
//  52002 	 系统错误 	 请重试
//  52003 	 未授权用户 	 请检查appid是否正确或者服务是否开通
//  54000 	 必填参数为空 	 请检查是否少传参数
//  54001 	 签名错误 	 请检查您的签名生成方法
//  54003 	 访问频率受限 	 请降低您的调用频率，或进行身份认证后切换为高级版/尊享版
//  54004 	 账户余额不足 	 请前往管理控制台为账户充值
//  54005 	 长query请求频繁 	 请降低长query的发送频率，3s后再试
//  58000 	 客户端IP非法 	 检查个人资料里填写的IP地址是否正确，可前往开发者信息-基本信息修改
//  58001 	 译文语言方向不支持 	 检查译文语言是否在语言列表里
//  58002 	 服务当前已关闭 	 请前往管理控制台开启服务
//  90107 	 认证未通过或未生效 	 请前往我的认证查看认证进度
type ErrorMap = {
  [k: string]: string
}
const errorMap: ErrorMap = {
  '52001': '请求超时',
  '52002': '系统错误',
  '52003': '未授权用户',
  '54000': '必填参数为空',
  '54001': '签名错误',
  '54003': '访问频率受限',
  '54004': '账户余额不足',
  '54005': '长query请求频繁',
  '58000': '客户端IP非法',
  '58001': '译文语言方向不支持',
  '58002': '服务当前已关闭',
  '90107': '认证未通过或未生效',
  'unknown': '服务器繁忙'
};

const translate = (word: string) => {
  // 接口地址：http://fanyi-api.fanyi.baidu.com/api/trans/vip/translate?q=apple&from=en&to=zh&appid=2015063000000001&salt=1435660288&sign=f89f9594663708c1605f3d736d01d2d4
  // sign: appid+q+salt+密钥的MD5值
  let from = 'en', to = 'zh';
  if (!(/[[a-zA-Z]/.test(word[0]))) {
    from = 'zh';
    to = 'en';
  }
  const sign = md5(appId + word + salt + appSecret);
  const searchParams = new URLSearchParams({
    q: word,
    from,
    to,
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

  const request = https.request(options, (response: ClientRequest) => {
    let chunks: Buffer[] = [];
    response.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      type BaiduResult = {
        error_code?: string,
        error_msg?: string,
        from: string,
        to: string,
        trans_result: { src: string, dst: string }[]
      }
      const data: BaiduResult = JSON.parse(string);
      if (data.error_code) {
        if (data.error_code in errorMap) {
          console.log(errorMap[data.error_code] || errorMap.unknown);
        } else {
          console.log(errorMap.unknown);
        }
        process.exit();
      }
      console.log(data.trans_result[0].dst);
    });
  });

  request.on('error', (e: Error) => {
    console.log(e.constructor);
    console.error(e);
  });
  request.end();
};


export {
  translate
};