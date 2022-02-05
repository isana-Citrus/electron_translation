require('dotenv').config();
const url = 'https://mt-auto-minhon-mlt.ucri.jgn-x.jp'; // 基底URL (https://xxx.jpまでを入力)
const key = process.env.key; // API key
const secret = process.env.secret; // API secret
const name = process.env.name; // ログインID

const api_name = 'mt'; // API名 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"mt")
const api_param = 'generalNT_en_ja'; // API値 (https://xxx.jp/api/mt/generalNT_ja_en/ の場合は、"generalNT_ja_en")

let access_token;

const request = require('request');

const call_api = function (en2jpn_text) {

    let params = {
        access_token: access_token,
        key: key, // API Key
        api_name: api_name,
        api_param: api_param,
        name: name, // ログインID
        type: 'json', // レスポンスタイプ
        text: en2jpn_text
    };

    request.post(url + '/api/', {
        form: params,
    }, function (err, res) {
        if (err) {
            console.log("error:", err);
            return "error";
        }

        if (res) {
            let result = JSON.parse(res.body).resultset.result.text;
            console.log("response.body:", result);
            return result;
        }
    });
};

exports.en2jpn = function (text) {
    request.post(url + '/oauth2/token.php', {
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
        },
        form: {
            grant_type: 'client_credentials',
            client_id: key, // API Key
            client_secret: secret, // API secret
            urlAccessToken: url + '/oauth2/token.php' // アクセストークン取得URI
        }
    }, function (err, res) {

        if (err) {
            console.log("error:", err);
            return;
        }

        if (res) {
            try {
                access_token = JSON.parse(res.body).access_token; // アクセストークン

            } catch (e) {
                console.log(e);
                return;
            }

            if (!access_token) {
                console.log("error:", JSON.parse(res.body).error);
                console.log("discription:", JSON.parse(res.body).error_description);
                return;
            }

            const result = call_api(text);
            return result;

        }
    });
}
//en2jpn("hello");