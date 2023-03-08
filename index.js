// import  express, { urlencoded } from 'express';
const express = require('express');
const urlencoded = require('express');
const { default: axios } = require('axios');
require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const random = require('lodash/random'); // lodashのrandom関数を使用

const APIKEY = process.env.APIKEY;
const app = express();
const PORT = process.env.PORT || 3000;

const { Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
    apiKey: APIKEY,
})
const openai = new OpenAIApi(configuration);

//画像のurlを返す
async function RequestImage(words){
    let response = await openai.createImage({
        prompt: words,
        n: 1,
        // size: "1024x1024",
        size: "256x256",
        response_format: "b64_json"
    })
    let image_url = response.data.data[0].b64_json;
    return image_url
}

// wordlistを生成
async function GenerateWordList(){
    const wordlist_path = __dirname + '/src/wordlist.txt';
    const selectedLines = [];

    const stream = fs.createReadStream(wordlist_path, { encoding: 'utf-8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    rl.on('line', (line) => {
        selectedLines.push(line);
    });
    
    // Promiseを返す
    return new Promise((resolve, reject) => {
        rl.on('close', () => {
            const numLines = selectedLines.length;
            const numSelectedLines = Math.min(numLines, 9);

            const selectedIndices = new Set();
            while (selectedIndices.size < numSelectedLines) {
                const randomIndex = random(numLines - 1);
                selectedIndices.add(randomIndex);
            }

            const selectedArr = [];
            selectedIndices.forEach((index) => {
                selectedArr.push(selectedLines[index]);
            });

            // 結果を解決(resolve)する
            resolve(selectedArr);
        });

        // エラーが発生した場合はrejectする
        rl.on('error', (err) => {
            reject(err);
        });
    });
}

app.use(express.json());
app.use(express.static(__dirname + '/src'));
app.use(urlencoded({ extended: true }));

app.get('/', async (_req, res) => {
    return res.status(200).sendFile(__dirname + '/src/index.html');
});

app.post('/', async (req, res) => {
    console.log("受け取った");
    console.log(req.body['word']);
    words = req.body['word'];
    let url = await RequestImage(words); 
    console.log("url取得完了");
    res.send(url);
})

app.get('/wordlist', async (req, res) => {
    await GenerateWordList().then((selectedArr) => {
        res.send(selectedArr);
    }).catch((err) => {
        console.error(err);
    });
})

try{
    app.listen(PORT, () => {
        console.log(`dev surver running at: http://localhost:${PORT}/`);
    })
}catch{
    if(e instanceof Error){
        console.error(e.message);
    }
}
