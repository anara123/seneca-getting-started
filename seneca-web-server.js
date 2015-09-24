require('@risingstack/trace');
var seneca = require('seneca')()
    .use('user')
    .use('./plugins/auth-jwt.js')
    .use('./plugins/api.js')
    .client( { port: 9001, pin: 'role:shop' } )
    .client(8080);

var app = require('express')()
    .use( require('body-parser').json() )
    .use( seneca.export('web') )
    .listen(3000);



var u = seneca.pin({role:'user',cmd:'*'})
u.register({nick:'u1',name:'nu1',email:'u1@example.com',password:'u1',active:true})
u.register({nick:'u2',name:'nu2',email:'u2@example.com',password:'u2',active:true})


//seneca.act('role:web, cmd:routes', function (err, routes) {
//    if (err) console.log(err);
//
//    console.log(routes);
//})
