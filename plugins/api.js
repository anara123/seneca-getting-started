'use strict';

var jwt    = require('jsonwebtoken');
var auth   = require('./auth-jwt');

module.exports = function api( options ){

    var valid_ops = {sum: 'sum', mult: 'mult'};
    var secret = 'ilovescotchyscotch';

    this.add(
        {role: 'api', path: 'calculate'},
        function (msg, respond) {

            this.act( 'role:math',
                {
                    cmd: valid_ops[msg.operation],
                    left: msg.left,
                    right: msg.right
                }, respond);

        });

    this.add('role:api,path:purchase', function (msg, respond) {
        var data = {
          id: msg.id
        };
        console.log('API | PURCHASE | msg: ', data);

        this.act('role:shop,cmd:purchase', data, respond);
    });

    this.add('role:api,path:product', function (msg, respond) {
        var product = {
            name: msg.name,
            price: msg.price
        };
        console.log('API | POST PRODUCT | product: ', product);

        this.act('role:shop,add:product', { product: product }, respond);
    });

    this.add('role:api,get:product', function (msg, respond) {
        console.log('API | GET PRODUCT | id: ', msg.id);

        this.act('role:shop,get:product', { id: msg.id }, respond);
    });

    this.add(
        { init: 'api' },
        function (msg, respond) {

            this.act('role:web', { use: {
                prefix: '/api',
                pin: 'role:api,path:*',
                //starware: validateJWT,
                premap: validateJWT,
                map: {
                    calculate:  { GET: true, suffix: '/:operation'},
                    product:    { POST: true },
                    purchase:   { POST: true }
                }
            }});

            //this.act('role:web', { use: {
            //    prefix: '/api',
            //    pin: 'role:api,get:*',
            //    map: {
            //        product:    { GET: true }
            //    }
            //}});

            respond();
        }
    );



    function validateJWT(req, res, next) {

        var msg = {
            headers: req.headers
        };

        this.act('role:auth, cmd:validate_token', msg, function (err, result) {

            if (err) {
                return console.log(err);
            }

            if (!result.success && result.status) {
                console.log('111');
               return res.status(result.status).json({ message: result.message} );
            }
            else if (!result.success) {
                console.log('222');
               return res.json({ message: result.message} );
            }

            console.log('333');
            req.decoded = result.decoded;
            next();
        });

    }
}
