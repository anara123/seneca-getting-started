'use strict';
var jwt    = require('jsonwebtoken');

module.exports = function (options) {

    options = this.util.deepextend({
        secret: 'ilovescotchyscotch'
    }, options);

    this.add('role:auth, cmd:register', function(msg, respond) {
        if (!msg.name || !msg.password || !msg.email){
            respond(new Error('user is not complete. wrong input data'), null);
        }
        var user = {
            name: msg.name,
            password: msg.password,
            email: msg.email,
            active: true
        }
        this.act('role:user, cmd:register', user, function (err, result) {
            if (err) {
                console.error(err.message);
                return respond(err.message, null);
            }

            if (!result.ok) {
                return respond({ message: result.why });
            }

            respond(null, result.user);
        })
    });

    this.add('role:auth,cmd:authenticate', function(msg, respond) {

        console.log('Authenticating user. name=[%s] password=[%s]', msg.name, msg.password)
        // find user
        this.act('role:user, cmd:login', {email: msg.email, password: msg.password}, function(err, result) {

            if (result.ok) {
                var user = result.user;
                console.log('=======user=======', user);

                // if user is found and password is right
                // create a token
                console.log(options.secret);
                var token = jwt.sign(user, options.secret, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                console.log(token);
                return respond(null, {
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
            else {
                return respond(null, {
                    success: false,
                    why: result.why
                });
            }
        })
    });

    this.add('role:auth, cmd:validate_token', function (msg, respond) {

        // check header or url parameters or post parameters for token
        var token = msg.headers['authorization'];

        console.log('CHECKING FOR AUTH TOKEN !!.', token);

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, options.secret, function(err, decoded) {
                if (err) {
                    return respond(null, { success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    return respond(null, { success: true, decoded: decoded });
                }
            });

        } else {

            // if there is no token
            // return an error
            return respond(null, {
                status: 403,
                success: false,
                message: 'No token provided.'
            });

        }
    });

    this.add('init:auth-jwt', function (msg, respond) {

        this.act('role:web', { use: {
            prefix: '/auth',
            pin: 'role:auth, cmd:*',
            map: {
                authenticate: { POST: true },
                register: { POST: true }
            }
        }});

        respond();
    })

    return { name: 'auth-jwt'};

    function validateJWT(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        console.log(token);

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, options.secret, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    }
}




