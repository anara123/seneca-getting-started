require('@risingstack/trace');
var seneca = require('seneca')()
    .add('role:shop,info:purchase', function purchase(msg, respond) {
        console.log('purchase', msg.purchase);
        respond();
    })
    .listen(9002);
