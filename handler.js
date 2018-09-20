const rp = require('request-promise')
const _config = require('./config')

module.exports.sessionToken = async (event, context) => {
	let token = '', email='', password='', userMap = null
	let post = event.body !== undefined ? JSON.parse(event.body) : null
	if(post !== null){
		token = post['token']
		email = post['email']
		userMap = new Map(_config.users)
		password = userMap.get(email)

	} else {
		console.log("There isnt a body")
		return {
		    statusCode: 500,
		    body: JSON.stringify({"message": "No JSON body posted"}),
  		};
	}

	console.log('Auth token', token)
	const auth_token = 'bearer:' + token

	let options = {
	  method: 'POST',
	  uri: _config.login,
	  body: {
	  	"username_or_email": email,
	  	"password": password,
	  	"subdomain": _config.subdomain
	  },
	  headers: {
	  	'Authorization': auth_token,
	  	'Content-Type': 'application/json',
	  	'Custom-Allowed-Origin-Header-1': _config.sites
	  },
	  json: true
	}

	let data = {}

	const response = await rp(options, (err, res, body) => {
		if(err) return {
		    statusCode: 500,
		    body: JSON.stringify(err),
  		};
  		data = body
  		console.log("Data", data)
	})

  return {
    statusCode: 200,
    headers: {
       "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data)
  };
};
