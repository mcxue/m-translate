#!/usr/bin/env node
import * as commander from 'commander';
import {translate} from './src/main';

const program = new commander.Command();

program.version('1.0.1')
  .name('fy')
  .usage('<word>')
  .argument('<word>')
  .action((word) => {
    translate(word);
  });

program.parse(process.argv);