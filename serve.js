const express = require('express');
const app = express();
const logger = require("morgan");
const router = require('./route/router')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(router);
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded()); // 增加其他路由处理 
app.use(logger('dev'));


app.listen(8080, function () {
    console.log('服务器在8080端口启动!');
});