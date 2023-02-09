#!/usr/bin/env tsx
import { cac } from 'cac';
import { getDeviceList, start, openDevice } from './index';

const cli = cac();

cli
  .command('list', 'list all devices, l for alias')
  .alias('l')
  .action(async () => {
    const deviceList = await getDeviceList();
    // 储存设备对映的 sdk
    const deviceSdkMap: Record<string, string[]> = {};

    const deviceArray = Object.keys(deviceList)
      .filter((k) => !!deviceList[k].length)
      .reduce<string[]>((pre, cur) => {
        const l: string[] = [];
        deviceList[cur].forEach((item) => {
          if (!deviceSdkMap[item.name]) {
            deviceSdkMap[item.name] = [item.sdk];
            l.push(item.name);
          } else {
            deviceSdkMap[item.name].push(item.sdk);
          }
        });

        return [...pre, ...l];
      }, [])
      .map((name) => `${name} - ${deviceSdkMap[name].join('/')}`);

    deviceArray.forEach((name) => console.log(name));
  });

cli
  .command('start', 'select one to open, s for alias')
  .alias('s')
  .action(async () => {
    const { device } = await start();
    openDevice(device);
  });

cli.help();

cli.parse();
