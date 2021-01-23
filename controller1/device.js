const express = require('express');
const user = express();
const device = require('../controller1/mydeivce');

module.exports = {
    fan(req, resp) {
        //获取PT上报的id和状态
        const id = req.params['id'];
        var status = req.params['status'];
        //打印id和状态
        console.log("id:" + id);
        console.log("status:" + status);
        //上报设备属性
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
            status: Number.parseInt(device.fan_status)
        };
        //发送给PT
        // console.log(obj)
        resp.send(JSON.stringify(obj));
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

}