#! /usr/bin/env node

const fs = require('fs');
const generateSchema = require('json-to-graphql');
const got = require('got');
const inquirer = require('inquirer');
const Meow = require('meow');
const Conf = require('conf');
const chalk = require('chalk');
const urlRegex = require('url-regex');

const pkg = require('./package.json')

const config = new Conf();
const prompt = inquirer.prompt;
const client = new Meow(chalk`
	{gray $} {green schema} {dim [flags]}

	{yellow -h --help}  			# Display this message
	{yellow -v --version}  		# Output the version [${pkg.version}]

	{yellow -s --source} {dim <path/url>}  	# Local JSON / API URl
	{yellow -o --out} {dim <out>}  		# Output file
	{yellow -t --token} {dim <token>}  		# Access toke if api requires auth

	{red {bold Warning!}}
	{bold Do not use {yellow --file} and {yellow --url} at the same time!}
`, {
	alias: {
		h: 'help',
		v: 'version',
		t: 'token',
		o: 'out',
		s: 'source'
	}
});


const generator = async (subcmd, flags) => {
	let params = {};
	const answers = await prompt([{
		name: 'source',
		message: 'JSON Source (api/url)',
		default: config.get('last-source'),
		when: a => {
			return !flags.source
		},
		validate: input => {
			return input.length > 0;
		},
		filter: input => {
			config.set('last-source', input.toLowerCase());
			return input.toLowerCase();
		},
	}, {
		name: 'out',
		message: 'Output file:',
		default: config.get('last-output') || 'schema.js',
		validate: input => {
			let fileRegex = /^[\w,\s-]+\.[A-Za-z]{1,6}$/g;
			return fileRegex.test(input);
		},
		filter: input => {
			config.set('last-output', input.toLowerCase());
			return input.toLowerCase();
		},
		when: a => {
			return !flags.out
		}
	}]);

	if (flags.url && flags.file) {
		process.exit();
	}

	if (answers.source || flags.source) {
		params.source = answers.source || flags.source;
		params.isURL = urlRegex({exact: true}).test(params.source);

		if ( params.isURL ) {
			console.log();
			console.log();
			console.log(chalk`{dim AUTH OPTIONS}`);
			let answ = await prompt([{
				name: 'has_token',
				message: 'Requires an access token?',
				type: 'confirm',
				default: config.get('has-token') || false,
				validate: (i) => {
					config.set('has-token', i);
				},
				when: a => {
					return !flags.token;
				}
			}, {
				name: 'token',
				default: config.get('last-token'),
				message: 'Access Token',
				validate: (i) => {
					return (i.length > 0);
				},
				filter: input => {
					config.set('last-token', input);
					return input;
				},
				when: (a) => {
					return a.has_token;
				}
			}]);

			if (answ.has_token || flags.token) {
				params.token = flags.token || answ.token
				config.set('last_token', params.token);
				config.set('has-token', answ.has_token || flags.token.length > 0);
			}
		}
	}

	if (answers.out || flags.out) {
		params.out = answers.out || flags.out;
		config.set('last-output', params.out);
	}

	try {
		let data;
		if (params.isURL) {
			let response = await got(params.source, {token: params.token});
			json = response.body;
		} else {
			json = fs.readFileSync(params.source, 'utf8');
		}

		data = json;
		const newSchema = generateSchema( data );

		fs.writeFile(params.out, data, error => {
			if (error) {
				throw new Error(error);			
			}

			console.log(`Schema generated successfully! [${params.out}]`);			
		})

	} catch(e) {
		throw new Error(e);
	} 
}

	
	

generator(client.input, client.flags);