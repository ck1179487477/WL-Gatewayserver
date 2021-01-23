const iot = require('alibabacloud-iot-device-sdk');
const fan = iot.device({
    productKey: 'a1Fm3loARNS', //将<productKey>修改为实际产品的ProductKey
    deviceName: 'fan1', //将<deviceName>修改为实际设备的DeviceName
    deviceSecret: 'b5029629874f841022aaffdd741d320e', //将<deviceSecret>修改为实际设备的DeviceSecret
})
//监听connect事件
fan.on('connect', () => {
    fan.subscribe('/a1Fm3loARNS/fan1/user/get');
    // console.log('connect successfully!');
    fan.publish('/a1Fm3loARNS/fan1/user/update', 'hello world!');
})

//监听message事件

fan.on('message', (topic, payload) => {
    // console.log(topic, payload.toString());
});

// 上报设备属性
fan.postProps({
    PowerSwitch: 0,
    WindSpeed: 0
}, (res) => {
    console.log(res);
})


var powerSwitch = 0;
var windSpeed = 0;
fan.onProps((cmd) => {
    // console.log('>>>onProps',cmd);
    for (var key in cmd.params) {
        if (key == 'PowerSwitch') {
            console.log('风扇的状态:', key);
            powerSwitch = Number(cmd.params.PowerSwitch);
            ff.fan_status = powerSwitch;
            if(powerSwitch==1){
                console.log('风扇从云端开启');
            }else if (powerSwitch == 0) {
                console.log('风扇从云端关闭');
            }
        }
        if (key == 'WindSpeed') {
            console.log('风速:', key);
            windSpeed = Number(cmd.params.WindSpeed);
            ff.fan_status = windSpeed;
            if (windSpeed == 1) {
                console.log('低风');
            } else if (windSpeed == 2) {
                console.log('高风');
            }
        }
    }
    fan.postProps({ 'PowerSwitch': powerSwitch, 'WindSpeed': windSpeed });
});
var ff = {
    fan_status : String,
    fan : fan
}
module.exports = ff;