#!/usr/bin/env node
'use strict'
// 定义脚手架的文件路径
process.env.NODE_PATH = __dirname + '/../node_modules/'

const program = require('commander')

// 定义当前版本
program
	.version(require('../package').version)

program
	.command('init')
	.description('Generate a new project')
	.alias('i')
	.action(() => {
		require('../command/init')()
	})

program.parse(process.argv)

if (!program.args.length) {
	program.help()
}