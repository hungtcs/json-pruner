#!/usr/bin/env node
import path from 'path';
import { prune, pick } from './lib/json-pruner';
import { promises as fs } from 'fs';
import { readJSONFile, readStdin } from './lib/fs';
import { PickOptions, PruneOptions } from './lib/interfaces';
import { Argument, Command, InvalidOptionArgumentError, Option } from 'commander';

const program = new Command().showHelpAfterError();

program
  .command('prune')
  .description('pruning json through json-path')
  .addOption(new Option('-f --file <file>', 'input file path'))
  .addOption(
    new Option('-p --pretty [pretty]', 'formatted output')
      .default(true)
      .argParser(value => value !== 'false')
  )
  .addOption(
    new Option('-w --write [write]', 'overwrite file, effective when --file provided, dangerous and irreversible')
      .default(false)
      .argParser(value => value === 'true')
  )
  .addOption(new Option('-o --output <output>', 'output path'))
  .addOption(
    new Option('-i --indent-size <indentSize>', 'indent size of the output file, effective when pretty is true')
      .default(2)
      .argParser(value => {
        const result = Number.parseInt(value);
        if (Number.isNaN(result)) {
          throw new InvalidOptionArgumentError('argument must be integer');
        }
        return result;
      })
  )
  .addArgument(new Argument('<json-paths...>', 'json path expressions'))
  .action(async (jsonPaths: Array<string>, options: PruneOptions) => {
    const object = await (options.file ? readJSONFile(path.resolve(options.file)) : readStdin());
    const result = jsonPaths.reduce((obj, jsonPath) => prune(obj, jsonPath), object);
    const json = JSON.stringify(result, null, options.pretty ? options.indentSize : 0);
    if (options.file && options.write) {
      await fs.writeFile(path.resolve(options.file), json, { encoding: 'utf-8' });
    } else if (options.output) {
      await fs.writeFile(path.resolve(options.output), json, { encoding: 'utf-8' });
    } else {
      process.stdout.write(json);
      process.stdout.write('\n');
    }
  });

program
  .command('pick')
  .description('pick value through json-path')
  .addOption(new Option('-f --file <file>', 'input file path'))
  .addArgument(new Argument('<json-paths...>', 'json path expressions'))
  .action(async (jsonPaths: Array<string>, options: PickOptions) => {
    const object = await (options.file ? readJSONFile(path.resolve(options.file)) : readStdin());
    const results = jsonPaths.reduce<any>(
      (_results, jsonPath) => (_results.push(...pick(object, jsonPath)), _results),
      [],
    );
    results.forEach((b: any) => {
      process.stdout.write(JSON.stringify(b));
      process.stdout.write(`\n`);
    });
  })

program
  .name('json-pruner')
  .description('json pruning tool based on json-path')
  .usage('[command] [options]')
  .parseAsync(process.argv)
  .catch(err => {
    if (err instanceof Error) {
      process.stderr.write(`ERROR: ${ err.message }\n`);
    } else if (typeof(err) === 'string') {
      process.stderr.write(`ERROR: ${ err }\n`);
    } else {
      console.error(err);
    }
    process.exit(1);
  });
