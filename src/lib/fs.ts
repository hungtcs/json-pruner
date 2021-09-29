import path from 'path';
import { promises as fs, constants } from 'fs';

export async function readJSONFile<T = any>(filePath: string): Promise<T> {
  try {
    await fs.access(filePath, constants.R_OK & constants.W_OK);
  } catch(err) {
    throw new Error(`file is not accessible`);
  }
  try {
    const json = await fs.readFile(path.resolve(filePath), { encoding: 'utf-8' });
    return JSON.parse(json) as T;
  } catch (err) {
    throw new Error(`json parsing failed`);
  }
}

export function readStdin<T = any>() {
  return new Promise<T>((resolve, reject) => {
    const socket = process.openStdin();
    let json = '';
    socket.on('data', chunk => json += chunk);
    socket.on('end', () => {
      try {
        resolve(JSON.parse(json));
      } catch (err) {
        reject(err);
      }
    });
    socket.on('error', (err) => reject(err));
  });
}
