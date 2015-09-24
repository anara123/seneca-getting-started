var seneca = require('seneca')();

var client = seneca.client(8080);

var test1 = {left: 4, right: 2};

client.act(
    { role: 'math', cmd: 'sum', left: 4, right: 2},
    function (err, result) {
        if (err) {
            return console.log(err);
        }
        console.log(result);
    });


client.act(
    { role: 'math', cmd: 'power', obj: test1},
    function (err, result) {
        if (err) {
            return console.log(err);
        }
        console.log(result);
    });
