var axios = require("axios");
const config = require("./config.json");
function postHeartbeat({ cookie, time, enable, timeout = 30000 }) {
  var config = {
    method: "get",
    url: "https://lygame.qidian.com/home/log/heartbeat?gameId=201509&platformId=1",
    headers: {
      Host: "lygame.qidian.com",
      Connection: "keep-alive",
      Accept: "application/json, text/plain, */*",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 11; Mi 10 Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046247 Mobile Safari/537.36 QDJSSDK/1.0  QDReaderAndroid/7.9.266/860/1000262",
      Origin: "https://qdgame.qidian.com",
      "X-Requested-With": "com.qidian.QDReader",
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      Referer: "https://qdgame.qidian.com/",
      "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      Cookie: cookie,
    },
  };

  return new Promise((resolve) => {
      axios(config).then((response) => {
        console.log(JSON.stringify(response.data));
        resolve(response.data.msg);
      });
  });
}

async function batch(val){
  let successTime = 1;
  while(successTime<=val.time){
    let resMsg = await postHeartbeat(val);
    await sleep(val.timeout)
    if(resMsg == 'success'){
      console.log(`第${successTime}次成功`)
      successTime++
    }else {
      console.log(`第${successTime}次成功,等待重试`)
    }
  }
  successTime = 0;  //  重置
}
async function sleep(time) { 
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function main() {
  for (let [index, val] of Object.entries(config.user)) {
    console.log(`一共${config.user.length}个任务，目前运行第${Number(index) + 1}个`);
    console.log('配置为：',JSON.stringify(val));
    if(val.enable){
      await batch(val)
    } else {
      console.log('跳过当前任务')
    }
  }
  console.log(`一共${config.user.length}个任务，已全部完成`);
}
main();
