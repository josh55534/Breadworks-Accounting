const jwt = require('jsonwebtoken')
const config = require('config')


function authUser ( req, res, next){
	const token = req.header('x-auth-token')

	if(!token){
		return res.status(401).json({ errors: 'Token not found.' })
	}

	try {
		const verified = jwt.verify(token, config.get('jwtpass'))

		req.user = verified.user

		next();

	} catch (error) {
		res.status(401).json({ errors: 'token not valid'})
	}
}

function authRole(role){
	return (req, res, next) => {
		if (req.user.role !== role){
			res.status(401)
			return res.send('Not allowed need admin role')
		}
		next()
	}
}

module.exports = {
	authUser,
	authRole
}