const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const userctr = require("../controller/userctr");
const device = require("../controller/device");
const controller = require('../controller/device');
const controller1 = require('../controller1/device');

router.use(bodyParser.json());

router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200);
    else next();
});

router.use(bodyParser.json());


////////////////////登录验证////////////////
router.post('/mm', userctr.vfc);
////////////////////用户添加////////////////
router.post('/useradd', userctr.useradd);
///////////////////用户页面初始化表格/////////
router.get('/users', userctr.user);
//////////////////用户查询////////////////////
router.get('/users/:userName', userctr.userFound);
/////////////////用户删除////////////////////
router.delete('/userdel/:userName', userctr.userDel);
/////////////////用户修改///////////////////
router.put('/userup', userctr.userupdate);


////////////////设备添加//////////////////
router.post('/proadd', device.proadd);
////////////////设备页面初始化表格//////////////////
router.get('/pros', device.pro);
////////////////设备查询//////////////////
router.get('/pros/:proId', device.proFound);
////////////////设备删除//////////////////
router.delete('/prodel/:proId', device.proDel);
////////////////设备修改//////////////////
router.put('/proup', device.proupdate);


///////////////设备的开关等///////////////////
router.put('/led/:id/:status', controller.report);
router.put('/led', controller.update);
router.get('/led', controller.getLED);

router.put('/fan/:id/:status', controller.fan);
router.put('/fan', controller.updatefan);
router.get('/fan', controller.getFAN);

router.put('/ws/:id/:covalue', controller.ws);
router.get('/ws/:id', controller.getws);
router.put('/ws/:id');

router.put('/ac/:id/:status', controller.ac);
router.put('/ac', controller.updateac);
router.get('/ac', controller.getAC);

router.put('/smoke/:id/:smokestate', device.sendsmokestate);//1001
// router.put('/co/:id/:covalue', device.sendcovalue);//1000
router.put('/cw/:id/:lastcw', device.sendlastcw);//1002
router.put('/light1/:id/:light1', device.sendlight1);//1004
router.put('/light2/:id/:light2', device.sendlight2);//1005
router.put('/light3/:id/:light3', device.sendlight3);//1006
router.put('/fan/:id/:status', controller1.fan);
router.put('/fan', controller1.updatefan);
router.get('/fan', controller1.getFAN);

module.exports = router;