import { Simctl } from 'node-simctl';
import { execSync } from 'child_process';
import ora from 'ora';
import inquirer from 'inquirer';

export interface IDeviceInfo {
  /** 系统版本 */
  sdk: string;
  /** 设备名称 */
  name: string;
  /** 设备状态 */
  state: 'Shutdown' | string;
  /** 设备id */
  udid: string;
  /** 系统平台 */
  platform: 'iOS' | string;
  isAvailable: boolean;
  dataPathSize: number;
}

const simctl = new Simctl();

export async function getDeviceList() {
  const devices: Record<string, IDeviceInfo[]> = await simctl.getDevices();
  return devices;
}

export async function start() {
  const devices = await getDeviceList();
  // const promptDataTree = Object.entries(devices).map(([k, v]) => {
  //   return {
  //     value: k,
  //     open: false,
  //     children: (v as any[]).map((item: any) => {
  //       return {
  //         name: item.name,
  //         value: {
  //           name: item.name,
  //           udid: item.udid,
  //         },
  //       };
  //     }),
  //   };
  // });
  const list = Object.keys(devices)
    .filter((k) => !!devices[k].length)
    .reduce<IDeviceInfo[]>((pre, cur) => {
      return [...pre, ...devices[cur]];
    }, [])
    .map((item) => {
      return {
        name: item.name,
        value: {
          name: item.name,
          udid: item.udid,
        },
      };
    });

  return inquirer.prompt([
    {
      type: 'list',
      name: 'device',
      message: 'Select the device:',
      // tree: promptDataTree,
      choices: list,
    },
  ]);
}

export function openDevice({ udid, name }) {
  let status = '';
  let spinner;
  try {
    spinner = ora().start(`Prepare opening device: ${name}`);
    status = execSync(`xcrun simctl bootstatus ${udid}`, {
      timeout: 1000,
    }).toString();
  } catch (error) {
    // 如果模拟器未启动，会一直等待，然后超时 kill，抛出一个 ETIMEDOUT 异常
    if (error.code !== 'ETIMEDOUT') {
      spinner.error(`${name},启动失败！`);
      throw error;
    }
  }
  // 检查是否启动
  if (status.indexOf('Device already booted') < 0) {
    console.log('\n 正在启动模拟器……');
    execSync(`xcrun simctl boot ${udid}`);
    execSync('open -a Simulator');

    spinner.succeed(`${name},启动成功！`);
  } else {
    spinner.info(`${name},已经在运行中！`);
  }
}
