import Express from 'express';
// import chatgptMsg from './chatgpt.js'
import { Configuration, OpenAIApi } from 'openai'
const app = Express()


app.set('x-powered-by', false)
app.use(Express.json())
// 配置中间件
app.use(Express.urlencoded({ extended: false }))



app.get('/', async (req, res) => {
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <mete content="text/html; charset=utf-8" http-equiv="Content-Type"></mete>
        <title>api</title>
    </head>
    <body>
        <p id="ipinfo"></p>
        <script>
            (function () {
                fetch('https://forge.speedtest.cn/api/location/info')
                    .then(res => res.json())
                    .then(res => {
                        var ipinfo = "你的ip: " + res.ip + ' ' + res.province + res.city +res.distinct + ' ' + res.net_str
                        console.log(ipinfo)
                        var ipinfoNode = document.getElementById("ipinfo")
                        ipinfoNode.innerHTML = ipinfo
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })();
        </script>
    </body>
    </html>`
    res.send(html)
})

/**
 *   {
 *      "q": "question",
 *     "opts":{
 *        "parentMessageId": res.id (可为空)
 *   }
 *}
 * 
 * 
 */

//  app.post('/chatgpt', async (req, res) => {
//     const { q, opts = {} } = req.body
//     // console.log(q);
//     const chatgtp = await chatgptMsg(q, opts)
//     res.send(chatgtp)
// })


app.post('/chatgpt', async (req, res) => {
    const configuration = new Configuration({
      apiKey: req.query.key
    });
    const openai = new OpenAIApi(configuration);
    console.log(req.body)
    try {
        const chatgpt = await openai.createCompletion(
            req.body,
            {
                timeout: 0
            }
        )
        res.send(chatgpt)
    } catch (e) {
        console.error(e)
        res.send({
            choices: [{
                text: '你好，当前网络繁忙，请稍后再尝试.'
            }]
        })
    }
})


const port = process.env.PORT || 3035;
app.listen(port, () => {
    console.log('Start service success! listening port: http://127.0.0.1:' + port);
})
