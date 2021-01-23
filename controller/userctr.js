const express = require('express');
const user = express();

var mysql = require('mysql');
var deasync = require('deasync')
const PASSWORD = [];

module.exports = {
    vfc(req, res) {
        const userName = req.body.userName;
        const password = req.body.password;
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            database: 'aliwork'
        })
        connection.connect();
        connection.query('select * from user where username = ? and password= ? ', [userName, password], function (err, result) {
            if (err) {
                res.send({ succ: false });
                throw err;
            } else if (result.length > 0) {
                res.send({ succ: true });
            }
        });
    },



    useradd(req, resp) {
        let userName = req.body.userName
        let password = req.body.password
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            database: 'aliwork'
        })
        connection.connect();
        var addU = 'INSERT INTO user values (?,?)';
        connection.query(addU, [userName, password], function (err, result) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                resp.send({ succ: false });
                return;
            }
            resp.send({ succ: true });
            // console.log('--------------------------INSERT----------------------------');  
            console.log("添加成功");
            // console.log('-----------------------------------------------------------------\n\n');
            resp.end();
            return;
        });
        connection.end();
    },

    user(req, resp) {
        var aa = [];
        var bb = [];
        var deasync = require('deasync');
        function select() {
            var sync1 = true;
            bb.splice(0, bb.length);
            db.query("SELECT * FROM user", function (err, data) {
                if (err) console.log(err)
                for (let aa of data) {
                    // console.log(aa);
                    bb.push({
                        'userName': aa.username,
                        'password': aa.password
                    });
                    sync1 = false;
                };
            });
            while (sync1) { deasync.sleep(400); }
            return bb;
        }
        //mysql操作
        //1.创建数据库链接
        let db = mysql.createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database: "aliwork"
        });
        //2.打开数据库   
        db.connect();
        //3.数据库操作
        bb = select();
        let inf = [];
        for (let aa of bb) {
            inf.push({
                'userName': aa.userName,
                'password': aa.password
            });
        }
        console.log(inf);
        resp.send(inf);
        // connect.end();
        resp.end();
        db.end();
    },

    userFound(req, resp) {
        var aa = [];
        var bb = [];
        var querystring = require('querystring');
        var deasync = require('deasync');
        var result = querystring.parse(req.params.userName, '&');
        let userName = result.userName;
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            database: 'aliwork'
        })
        connection.connect();
        function select() {
            var sync1 = true;
            bb.splice(0, bb.length);
            connection.query("SELECT * FROM user WHERE username=?", [userName], function (err, data) {

                for (let aa of data) {
                    bb.push({
                        'userName': aa.username,
                        'password': aa.password
                    });
                    sync1 = false;
                }
            });
            while (sync1) { deasync.sleep(400); }

            return bb;
        }
        bb = select();
        let inf = [];
        for (let aa of bb) {
            inf.push({
                'userName': aa.userName,
                'password': aa.password
            });
        }
        resp.send(inf);
        resp.end;
        connection.end();
    },

    userDel(req, resp) {
        var querystring = require('querystring');
        var result = querystring.parse(req.params.userName, '&');
        let userName = result.userName;
        let password = result.password;
        let db = mysql.createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database: "aliwork"
        })
        db.connect()
        console.log("数据库连接成功")
        db.query("delete from user where username =? OR password = ? ", [userName, password], function (err, data) {

            console.log("删除成功")

        })
        resp.send({ succ: true });
        db.end()
    },

    userupdate(req, resp) {
        let userName = req.body.userName
        let password = req.body.password

        let db = mysql.createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database: "aliwork"
        })
        db.connect()
        console.log("数据库连接成功")
        db.query("update user set password = ? where username = ? ", [password, userName], function (err, data) {
            console.log(err)
            console.log(data)
            resp.send({ value: data, succ: true });
            console.log("修改成功")
        })
        db.end()
    },

}