#! usr/bin/env node

const json = require('./package.json');
const chalk = require('chalk');

function warning(pkg, required = 8)
{
	if ( pkg.version == '3.0.0' && process.version.split('.')[0][1] < required) {
		console.log();
		console.log(chalk`{yellow {bold WARNING!}} ${pkg.name} v${pkg.version} requires node v${required}`);
		console.log();
		return false;
	}

	return true;
}


warning(json, 8)
