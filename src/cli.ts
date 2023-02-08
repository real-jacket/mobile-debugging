#!/usr/bin/env tsx
import { cac } from 'cac';
import { getDeviceList, start, openDevice } from './index';

const cli = cac();

cli
  .command('list', 'list all devices, l for alias')
  .alias('l')
  .action(async () => {
    const list = await getDeviceList();
    const deviceArray: string[] = [];
    Object.values(list).map((item: any) => {
      deviceArray.push(...item.map((i) => i.name));
    });

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
