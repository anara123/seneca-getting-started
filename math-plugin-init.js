'use strict';

var fs = require('fs');
var seneca = require('seneca')();


function math(options) {
    console.log('Math: ', options);


    var log;

    this.add({ role: 'math', cmd: 'sum' }, sum);
    this.add({ role: 'math', cmd: 'mult'}, mult);

    this.add({ init: 'math'}, init);

    function init(msg, respond) {
        // log to a custom file
        fs.open( options.logfile, 'a', function( err, fd ) {

            // cannot open for writing, so fail
            // this error is fatal to Seneca
            if( err ) return respond( err );

            log = makeLog(fd);
            respond();
        })
    }

    function sum(msg, respond) {
        var output = { answer : msg.left + msg.right };
        console.log('Sum: ' + output.answer);
        respond(null, output);
    }

    function mult(msg, respond) {
        var output = { answer : msg.left * msg.right };
        console.log('Mult: ' + output.answer);
        respond(null, output);
    }

    function makeLog(fd) {
        return function( entry ) {
            fs.write( fd, new Date().toISOString()+' '+entry, null, 'utf8', function(err) {
                if( err ) return console.log( err )

                // ensure log entry is flushed
                fs.fsync( fd, function(err) {
                    if( err ) return console.log( err )
                })
            })
        }
    }
}

function first_simple_plugin(options) {
    console.log('First plugin: ', options);
}

function last_simple_plugin(options) {
    console.log('Last plugin: ', options);
}



seneca
    .use(first_simple_plugin, { first: 'HELLO'})
    .use(math, { logfile: './math.log'})
    .use(last_simple_plugin, { last: 'GOODBYE'})
    .act({role: 'math', cmd: 'sum', left: 3, right: 5})
