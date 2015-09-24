'use strict';
require('@risingstack/trace');
var seneca = require('seneca')();

seneca
    .use('../plugins/math.js')
    .listen(8080);

