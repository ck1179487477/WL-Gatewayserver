const express = require('express');
const user = express();

var mysql = require('mysql');
var deasync = require('deasync')
const PASSWORD = [];
var myco;

const device = require('../controller/mydeivce');

module.exports = {

    ///////////////////////////////设备的增删查改///////////////////////////////////
    proadd(req, resp) {
        let id = req.body.id
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
        var addP = 'INSERT INTO product values (?,?,?)';
        connection.query(addP, [id, userName, password], function (err, result) {
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
    pro(req, resp) {
        var aa = [];
        var bb = [];
        var deasync = require('deasync');
        function select() {
            var sync1 = true;
            bb.splice(0, bb.length);
            db.query("SELECT * FROM product", function (err, data) {
                if (err) console.log(err)
                for (let aa of data) {
                    // console.log(aa);
                    bb.push({
                        'id': aa.id,
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
                'id': aa.id,
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

    proFound(req, resp) {
        var aa = [];
        var bb = [];
        var querystring = require('querystring');
        var deasync = require('deasync');
        var result = querystring.parse(req.params.proId, '&');
        let id = result.id;
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
            connection.query("SELECT * FROM product WHERE id=?", [id], function (err, data) {

                for (let aa of data) {
                    bb.push({
                        'id': aa.id,
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
                'id': aa.id,
                'userName': aa.userName,
                'password': aa.password
            });
        }
        resp.send(inf);
        resp.end;
        connection.end();
    },

    proDel(req, resp) {
        var querystring = require('querystring');
        var result = querystring.parse(req.params.proId, '&');
        let id = result.id;
        let db = mysql.createConnection({
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database: "aliwork"
        })
        db.connect()
        console.log("数据库连接成功")
        db.query("delete from product where id =? ", [id], function (err, data) {

            console.log("删除成功")

        })
        resp.send({ succ: true });
        db.end()
    },

    proupdate(req, resp) {
        let id = req.body.id
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
        db.query("update product set password = ? where id = ? ", [password, id], function (err, data) {
            console.log(err)
            console.log(data)
            resp.send({ value: data, succ: true });
            console.log("修改成功")
        })
        db.end()
    },


    /////////////////////////各种设备的控制//////////////////////////////
    report(req, resp) {
        //获取PT上报的id和状态
        const id = req.params['id'];
        const status = req.params['status'];
        //打印id和状态
        console.log("id:" + id);
        console.log("status:" + status);

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            database: 'aliwork'
        })
        connection.connect();
        console.log("连接fan成功")
        connection.query('insert into light(id,status) values(?,?)', [id, status], function (err, result) {
            if (err) {
                throw err;
            } else {
                var data = {
                    code: '200',
                    code_decoration: '添加成功'
                }
            }
        });
        connection.end();
        //上报设备属性
        device.device.postProps({
            LightStatus: Number(status)
        }, (res) => {
            //console.log(res);
        })
        //创建应答对象
        const obj = {
            id: id,
            success: true,//是否成功
            status: device.getLightStatus()//将云服务器的设备状态放入status字段里
        };
        //发送给pt
        resp.write(JSON.stringify(obj));
        resp.end();
    },
    getLED(req, resp) {
        status = device.getLightStatus();
        console.log(status);
        resp.end(JSON.stringify(status));
    },
    update(req, resp) {
        const result = {
            succ: true,
            msg: '',
            data: {

            }
        };
        result.data = { status: req.body.status };
        device.setLightStatus(req.body.status);

        resp.end(JSON.stringify(result));
    },


    fan(req, resp) {
        //获取PT上报的id和状态
        const id = req.params['id'];
        var status = req.params['status'];
        //打印id和状态
        console.log("id:" + id);
        console.log("status:" + status);
        //上报设备属性

        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            database: 'aliwork'
        })
        connection.connect();
        console.log("连接fan成功")
        connection.query('insert into fan(id,status) values(?,?)', [id, status], function (err, result) {
            if (err) {
                throw err;
            } else {
                var data = {
                    code: '200',
                    code_decoration: '添加成功'
                }
            }
        });
        connection.end();

        device.fan.postProps({
            PowerSwitch: Number(status),
            WindSpeed: Number(status),
        }, (res) => {
            console.log(res);
        })
        //创建应答对象
        const obj = {
            id: id,
            success: true,
            status: device.getfan_status()
        };
        //发送给PT
        // console.log(obj)
        resp.write(JSON.stringify(obj));
        resp.end();
    },
    getFAN(req, resp) {
        status = device.getfan_status();
        console.log(status);
        resp.end(JSON.stringify(status));
    },
    updatefan(req, resp) {
        const result = {
            succ: true,
            msg: '',
            data: {

            }
        };
        result.data = { status: req.body.status };
        device.setFanStatus(req.body.status);

        resp.end(JSON.stringify(result));
    },


    ws(req, resp) {
        console.log("插入");
        const id = req.params['id'];
        const co = req.params['covalue'];
        myco = co;
        // Humidity = Number(humd);
        // const value = req.params['value'];
        //mysql记录
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            database: 'aliwork'
        })
        connection.connect();
        console.log("连接成功")
        connection.query('insert into co(id,co,time) values(?,?,?)', [id, co, Date.now()], function (err, result) {
            if (err) {
                throw err;
            } else {
                var data = {
                    code: '200',
                    code_decoration: '添加成功'
                }
                // res.send({value:data, succ: true });
                console.log('----------------------');
                console.log(result);
                console.log('----------------------');
                console.log(data);
            }
        });
        connection.end();
        // 获取PT上报的id和状态 

        // 上报设备属性
        // device.device1.postProps({
        //     CurrentTemperature: Number(temp),
        //     CurrentHumidity: Number(humd)
        // }, (res) => {
        //     console.log(res);
        // });

        // 打印id和状态 
        console.log("id:" + id);
        console.log("co:" + co);

        device.co.postProps(
            {
                CO: Number(co)
            }, (res) => {
                console.log(res);
            }
        )
        const obj1 = {
            success: true,//是否成功
            status: device.getcovalue()
        };
        resp.write(JSON.stringify(obj1));
        resp.end();

    },
    getws(req, resp) {
        console.log("取数据");
        const id = req.params['id'];
        // mysql记录
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            database: 'aliwork'
        })
        connection.connect();
        connection.query('select * from co where id = ? order by time desc limit 10', [id], function (err, result) {
            if (err) {
                throw err;
            } else {
                var data = {
                    code: '200',
                    code_decoration: '查询成功'
                }
                // req.send({value:data, succ: true });
                console.log('----------------------');
                console.log(result);
                console.log('----------------------');
                console.log(data);
            }
            const res = {
                id: id,
                data: result
            };
            resp.send(JSON.stringify(res));
        });
        connection.end();


    },


    ac(req, resp) {
        const id = req.params['id'];
        var status = req.params['status'];
        //打印id和状态
        console.log("id:" + id);
        console.log("status:" + status);
        console.log(Number(Temperature));
        // console.log(Number(status));
        // if (Number(Temperature).valueOf() > -5 && Number(Temperature).valueOf() < 40) {
        //     // status = 1;
        //     // device.acStatus=1;
        //     device.setAcStatus(1);
        // } else {
        //     // status = 0;
        //     // device.acStatus=0;
        //     device.setAcStatus(0);
        // }
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            database: 'aliwork'
        })
        connection.connect();
        console.log("连接fan成功")
        connection.query('insert into ac(id,status) values(?,?)', [id, status], function (err, result) {
            if (err) {
                console.log(err)
            } else {
                var data = {
                    code: '200',
                    code_decoration: '添加成功'
                }
            }
        });
        connection.end();


        device.ac.postProps({
            PowerSwitch: Number(status),
        }, (res) => {
            console.log(res);
        });
        const obj = {
            id: id,
            success: true,
            status: device.getAcStatus()
            // status: device.acStatus
        };
        //发送给PT
        // console.log(obj)
        resp.write(JSON.stringify(obj));
        resp.end();
    },
    getAC(req, resp) {
        status = device.getAcStatus();
        console.log(status);
        resp.end(JSON.stringify(status));
    },
    updateac(req, resp) {
        const result = {
            succ: true,
            msg: '',
            data: {

            }
        };
        result.data = { status: req.body.status };
        device.setAcStatus(req.body.status);
        console.log("-----------")
        console.log(result)
        console.log("-----------")
        resp.end(JSON.stringify(result));
        console.log("end")
    },

    sendsmokestate(req, resp) {
        var smokestate = req.params['smokestate'];
        // console.log('smokestate = '+smokestate);
        device.smoke.postProps(
            {
                SmokeState: Number(smokestate)
            }, (res) => {
                console.log(res);
            }
        )
        const obj = {
            success: true,//是否成功
            status: device.getSmokestate()
        };
        resp.write(JSON.stringify(obj));
        resp.end();
    },

    sendcovalue(req, resp) {
        var covalue = req.params['covalue'];
        // console.log('covalue = '+covalue);
        device.co.postProps(
            {
                CO: Number(covalue)
            }, (res) => {
                console.log(res);
            }
        )
        const obj1 = {
            success: true,//是否成功
            status: device.getcovalue()
        };
        resp.write(JSON.stringify(obj1));
        resp.end();
    },

    sendlastcw(req, resp) {
        var lastcw = req.params['lastcw'];
        console.log('lastcw = ' + lastcw);
        device.cw.postProps(
            {
                AnimalTemperature: Number(lastcw)
            }, (res) => {
                console.log(res);
            }
        )
        const obj2 = {
            success: true,//是否成功
            status: device.getlastcw()
        };
        resp.write(JSON.stringify(obj2));
        resp.end();
    },

    sendlight1(req, resp) {
        var light1 = req.params['light1'];
        device.light1.postProps(
            {
                LightStatus: Number(light1)
            }, (res) => {
                console.log(res);
            }
        )
        const obj3 = {
            success: true,//是否成功
            status: device.getlight1()
        };
        resp.send(JSON.stringify(obj3));
        resp.end();
    },

    sendlight2(req, resp) {
        console.log("eee");
        var light2 = req.params['light2'];
        console.log('light2 = ' + light2);
        device.light2.postProps(
            {
                LightStatus: Number(light2)
            }, (res) => {
                console.log(res);
            }
        )
        const obj4 = {
            success: true,//是否成功
            status: device.getlight2()
        };
        resp.write(JSON.stringify(obj4));
        resp.end();
    },

    sendlight3(req, resp) {
        console.log("eee");
        var light3 = req.params['light3'];
        console.log('light3 = ' + light3);
        device.light3.postProps(
            {
                LightStatus: Number(light3)
            }, (res) => {
                console.log(res);
            }
        )
        const obj5 = {
            success: true,//是否成功
            status: device.getlight3()
        };
        resp.write(JSON.stringify(obj5));
        resp.end();
    },
}