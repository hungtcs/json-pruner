#!/usr/bin/env node
import path from 'path';
import { prune } from './json-pruner';
import { promises as fs, constants } from 'fs';
import { Argument, Option, program } from 'commander';

program.showHelpAfterError();

program
  .command('prune')
  .description('修建')
  .usage('<input-file> --json-path <json-paths...>')
  .addOption(new Option('-p --json-path <jsonpath...>', '路径'))
  .addArgument(new Argument('<input-file>', 'input file path'))
  .action(async (inputFilePath, options) => {

    const filePath = path.resolve(inputFilePath);
    const jsonPaths = options.jsonPath ?? [];
    await pruneJSONFile(filePath, jsonPaths);


  });

program.parseAsync(process.argv)
  .catch(err => {
    if (err instanceof Error) {
      process.stderr.write(err.message);
    } else if (typeof(err) === 'string') {
      process.stderr.write(err);
    } else {
      console.error(err);
    }
    process.exit(1);
  });

async function pruneJSONFile(filePath: string, jsonPaths: Array<string>) {
  try {
    await fs.access(filePath, constants.R_OK & constants.W_OK);
    const json = await fs.readFile(path.resolve(filePath), { encoding: 'utf-8' });
    const object = JSON.parse(json);

    const result = jsonPaths.reduce(
      (obj, jsonPath) => prune(obj, jsonPath),
      object,
    );
    const resultJSON = JSON.stringify(result, null, 2);
    process.stdout.write(resultJSON);
  } catch(err) {
    throw err;
  }
}
