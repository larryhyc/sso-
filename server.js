const express = require('express');
const redis = require('redis');
const crypto = require('crypto');
const cors = require('cors');
const app = express();

// 中间件
app.use(express.json());
app.use(cors());

const rediscli = redis.createClient({
    url: 'redis://127.0.0.1:6379',
    password: 'hyc32612310666'
})
rediscli.on('error', (err) => {
    console.log('redis error', err);
})

rediscli.on('connect', () => {
    console.log('连接数据库成功');
})
rediscli.connect();



/**
 * @description  加盐加密
 * @param {str} str
 */
function sha256 (str) {
    const hash = crypto.createHash('sha256');
    hash.update(str + 'larryhyc');
    return hash.digest('hex');
}


/**
 * @description 注册接口
 * @param {str} username
 * @param {str} password
 */
async function sainup (username, password) {
    if (!username || !password) {
        return ({ success: false, msg: '用户名或密码不能为空' });
    }
    try {
        let dbuser = await rediscli.hExists(`users:${sha256(username)}`, 'username');
        if (dbuser) {
            return ({ success: false, msg: '该用户已存在' });
        } else {
            await rediscli.hSet(`users:${sha256(username)}`, 'username', username);
            await rediscli.hSet(`users:${sha256(username)}`, 'password', sha256(password));
            await rediscli.save();
            return ({ success: true, msg: '注册成功' });
        }
    } catch (err) {
        console.log(err);
    }

};

/**
 * @discription 登录接口
 * @param {str} username
 * @param {str} password
 */
async function login (username,password) {
    if (!username || !password) {
        return ({ success: false, msg: '用户名或密码为空' });
    }
    try {
        let dbuser = await rediscli.hExists(`users:${sha256(username)}`, 'username');
        let dbpass = await rediscli.hGet(`users:${sha256(username)}`, 'password');
        // console.log(dbpass)
        // console.log(password)
        if (!dbuser) {
            return ({success: false,msg:'该用户不存在'})
        }
        
        if (dbpass === sha256(password)) {
            return ({ success: true, msg: '登录成功' });
        } else {
            return ({ success: false, msg: '登录失败，用户名或密码错误' });
        }
    } catch (err) {
        console.log(err);
    }
}


app.post('/sainup', async (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    console.log(username, password);
    let data = await sainup(username, password);
    res.send(data);
});

app.post('/login', async (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    // console.log(username, password);
    let data = await login(username, password);
    res.send(data);
})



app.listen(3001, () => {
    console.log('服务器启动成功，运行在http://127.0.0.1:3001');
})