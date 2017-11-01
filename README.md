# graphql-schema-generator
Generate GraphQL Schema from JSON source

## Usage
```sh
	Generate GraphQL Schema from JSON source

	$ schema [flags]

	-h --help                     # Display this message
	-v --version                  # Output the version [0.1.1]

	-s --source <path/url>        # Local JSON / API URl
	-o --out <out>                # Output file
	-t --token <token>            # Access toke if api requires auth

	Warning!
	Do not use --file and --url at the same time!
```


## Installation
```sh
	$ npm install --global json-to-graphql-cli
```

or via [yarn](https://github.com/yarnpkg/yarn)

```sh
	$ yarn global add json-to-graphql-cli
```


### Sample source
Example taken from [json-to-graphql](https://github.com/aweary/json-to-graphql) module.

```json
	{
	"name": "brandon",
	"id": 1,
	"favorite_color": "teal",
	"job": {
		"type": "web developer",
		"years": 1
	},
	"dogs": ["minnie", "navi"]
	}
```
```js
	const {
		GraphQLBoolean,
		GraphQLString,
		GraphQLInt,
		GraphQLFloat,
		GraphQLObjectType,
		GraphQLSchema,
		GraphQLID,
		GraphQLNonNull
	} = require('graphql')


	const JobType = new GraphQLObjectType({
		name: 'job',
		fields: {
			type: {
				description: 'enter your description',
				type: new GraphQLNonNull(GraphQLString),
				// TODO: Implement resolver for type
				resolve: () => null,
			},
			years: {
				description: 'enter your description',
				type: new GraphQLNonNull(GraphQLInt),
				// TODO: Implement resolver for years
				resolve: () => null,
			}
		},
	});


	module.exports = new GraphQLSchema({
		query: new GraphQLObjectType({
			name: 'RootQueryType',
			fields: () => ({
				name: {
					description: 'enter your description',
					type: new GraphQLNonNull(GraphQLString),
					// TODO: Implement resolver for name
					resolve: () => null,
				},
				id: {
					description: 'enter your description',
					type: new GraphQLNonNull(GraphQLID),
					// TODO: Implement resolver for id
					resolve: () => null,
				},
				favorite_color: {
					description: 'enter your description',
					type: new GraphQLNonNull(GraphQLString),
					// TODO: Implement resolver for favorite_color
					resolve: () => null,
				},
				job: {
					description: 'enter your description',
					type: new GraphQLNonNull(JobType),
					// TODO: Implement resolver for job
					resolve: () => null,
				},
				dogs: {
					description: 'enter your description',
					type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
					// TODO: Implement resolver for dogs
					resolve: () => null,
				}
			})
		})
	})
```

For API and more infos check out [json-to-graphql](https://github.com/aweary/json-to-graphql)

## Related
- [json-to-graphql](https://github.com/aweary/json-to-graphql)

# License
[MIT](LICENSE.md) &copy; [Federico Vitale](https://github.com/rawnly)