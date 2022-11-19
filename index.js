import { Simctl } from 'node-simctl';
import { execSync } from 'child_process';

const simctl = new Simctl();

const devices = await simctl.getDevices();
console.log('devices: ', devices);

const targetDeviceName = 'iPhone 14 Pro';

let deviceId = null;

Object.entries(devices).map(([key, value]) => {
  if (key === '16.1') {
    value.forEach((element) => {
      if (element.name === targetDeviceName) {
        deviceId = element.udid;
      }
    });
  }
});

console.log('deviceId: ', deviceId);
let status = '';
try {
  status = execSync(`xcrun simctl bootstatus ${deviceId}`, { timeout: 1000 });
} catch (error) {
  // 如果模拟器未启动，会一直等待，然后超时 kill，抛出一个 ETIMEDOUT 异常
  if (error.code !== 'ETIMEDOUT') {
    throw error;
  }
}
// 检查是否启动
if (status.indexOf('Device already booted') < 0) {
  console.log('正在启动模拟器……');
  execSync(`xcrun simctl boot ${deviceId}`);
  execSync('open -a Simulator');
}
