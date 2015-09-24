require('@risingstack/trace');

var seneca = require('seneca')()
    .use('../plugins/shop.js')
    .listen(9001)
    .client(9002);
