// import  express, { urlencoded } from 'express';
const express = require('express');
const urlencoded = require('express');
const { default: axios } = require('axios');
require('dotenv').config();

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

try{
    app.listen(PORT, () => {
        console.log(`dev surver running at: http://localhost:${PORT}/`);
    })
}catch{
    if(e instanceof Error){
        console.error(e.message);
    }
}
