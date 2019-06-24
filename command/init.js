'use strict'
const exec = require('child_process').exec;
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');

module.exports = () => {
	co(function* () {
		// 处理用户输入
		const projectName = yield prompt('Project name（项目名称）: ');
		const addAntdIcon = yield prompt('Add Antd Icon Aseets?（是否添加antd图标） (Y/n)');
		const isAddAntdIcon = addAntdIcon !== 'n';

		validateProjectName(projectName);

		let commands = [];

		// 初始化带 ng-zorro 组件库的 Angular 项目
		commands = commands.concat(getCreateProjectCmd(projectName, isAddAntdIcon));
		// 生成主要模块
		commands = commands.concat(getCreateModuleCmds());


		console.log(commands.join(' && '));
		executeCmd(commands.join(' && '), 'init project success');
	});

	function validateProjectName(projectName) {
		if (!projectName.trim()) {
			reportError('Project name can not be empty!');
			process.exit();
		}
	}

	function executeCmd(cmd, completedNotify = '') {
		reportInfo('因下载node-sass速度缓慢问题，请稍后...');
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				reportError(error);
				process.exit();
			}
			reportSuccess(completedNotify);
			process.exit();
		});
	}

	function getCreateProjectCmd(projectName, isAddAntdIcon) {
		const cmds = [];
		// 初始化 Angular 项目
		cmds.push(getInitAngularCmd(projectName));
		// 切换到新建的项目路径下
		cmds.push(`cd ${projectName}`);
		// 添加 ng-zorro 组件库
		cmds.push(getAddNgZorroCmd());
		// 判断是否需要增加 antd 图标库
		if (isAddAntdIcon) {
			cmds.push(getAddIconCmd());
		}
		return cmds;
	}

	function getCreateModuleCmds() {
		const cmds = [];
		// 生成 components 模块
		cmds.push(getAddSchematicCmd('module', 'components'));
		// 生成 routes 模块
		cmds.push(`ng g module routes --routing`);
		// 生成 routes/shared 模块
		cmds.push(getAddSchematicCmd('module', 'routes/shared'));
		// 生成 layouts 模块
		cmds.push(getAddSchematicCmd('module', 'layouts'));
		return cmds;
	}

	function getInitAngularCmd(projectName) {
		return `ng n ${projectName} --style=less --routing=true`;
	}

	function getAddNgZorroCmd() {
		return `ng add ng-zorro-antd --theme --locale=zh_CN --dynamicIcon=false`;
	}

	function getAddIconCmd() {
		return `ng g ng-zorro-antd:fix-icon`;
	}

	function getAddSchematicCmd(type, name) {
		return `ng g ${type} ${name}`;
	}

	function reportError(err) {
		console.log(chalk.red(`\n${err}`));
	}

	function reportSuccess(msg) {
		console.log(chalk.green(`\n√ ${msg}`));
	}

	function reportInfo(info) {
		console.log(chalk.white(`\n${info}`));
	}
}