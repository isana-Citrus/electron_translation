require('dotenv').config();//ユーザー情報保存用
const apiurl = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp'; // 基底URL (https://xxx.jpまでを入力)
const key = process.env.key; // API key
const secret = process.env.secret; // API secret
const name = process.env.name; // ログインID

axios = require("axios");

async function post(url, param) {
    var params = new URLSearchParams();// パラメータ入れるよう
    if (param) {
        for (let key in param) {
            //console.log('key:' + key + ' value:' + param[key]);
            params.append(key, param[key]);
        }
    }
    const res = await axios.post(url, params);
    console.log("post result url:", url, " status:", res.status);
    return res;
};
//アクセストークンを取得する部分
async function get_access_token() {
    const param = {
        grant_type: 'client_credentials',
        client_id: key, // API Key
        client_secret: secret, // API secret
        urlAccessToken: apiurl + '/oauth2/token.php' // アクセストークン取得URI
    }
    const result = await post(apiurl + '/oauth2/token.php', param);
    return result.data.access_token;
};
//翻訳文と翻訳モードを受け取ったら翻訳結果を返してくれるやつ
//引数:mode 元サイトではAPI値と書かれている部分
//- generalNT_ja_en
//- generalNT_en_ja
//-
async function trans_api(text, mode) {
    const token = await get_access_token();
    const params = {
        access_token: token,
        key: key,
        api_name: "mt",
        api_param: mode,
        name: name, // ログインID
        type: 'json', // レスポンスタイプ
        text: text,
    }
    const result = await post(apiurl + '/api/', params);
    //console.log(result);
    return result.data.resultset.result.text
}
//(async () => { console.log(await trans_api("hello", "generalNT_en_ja")); })();
exports.en2ja = async (text) => {
    const result = await trans_api(text, "generalNT_en_ja");
    return result
}