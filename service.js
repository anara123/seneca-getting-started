'use strict';

var seneca = require('seneca')();
seneca.use(minimal_plugin, {foo: 'koo'} );

function minimal_plugin(options) {
    console.log(options);
}

seneca.add({role:'math', cmd:'sum', privilege: 'add_numbers'}, onSum);
seneca.add({role:'math', cmd:'sum', privilege: 'sub_numbers'}, onSum);

function onSum( msg, respond ) {
    var sum = msg.obj.left + msg.obj.right
    respond( null, { answer: sum } )
}


var test1 = { left: 1, right: 4};
var test2 = { left: 2, right: 4};
var test3 = { left: 3, right: 4};
var test4 = { left: 4, right: 4};

seneca
    .act(
        {role:'math', cmd:'sum', privilege: 'add_numbers', obj: test1},
        console.log
    )
    .act(
        {role:'math', cmd:'sum', privilege: 'sub_numbers', obj: test2},
        console.log
    )
