import * as commander from 'commander';
import {translate} from './src/main';

const program = new commander.Command();

program.version('0.0.1')
  .name('fy')
  .usage('<English>')
  .argument('<English>')
  .action((word) => {
    translate(word);
  });

program.parse(process.argv);