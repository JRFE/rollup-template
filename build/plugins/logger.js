/**
 * @author flyerjay
 * @desc 日志着色
 */

const chalk = require('chalk');
const format = require('util').format

const prefix = '__';
const sep = '.';

exports.log = (...args) => {
  const msg = format.apply(format, args);
  console.log(prefix, msg, chalk.gray(sep));
}

exports.error = (...args) => {
  const msg = format.apply(format, args);
  console.log(prefix, chalk.red(msg), chalk.gray(sep));
}

exports.success = (...args) => {
  const msg = format.apply(format, args);
  console.log(prefix, chalk.green(msg), chalk.gray(sep));
}