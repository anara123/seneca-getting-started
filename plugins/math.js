module.exports = function math( options ) {

    this.add( 'role:math,cmd:sum', function sum( msg, respond ) {
        console.log(msg.left + ' + ' + msg.right);
        respond( null, { answer: msg.left + msg.right } )
    });

    this.add( 'role:math,cmd:product', function product( msg, respond ) {
        console.log(msg.left + ' * ' + msg.right);
        respond( null, { answer: msg.left * msg.right } )
    });

    this.add( 'role:math,cmd:power', function power( msg, respond) {
        console.log(msg.obj.left + ' ^ ' + msg.obj.right);
        var i, result = 1;
        for (i = 0; i < msg.obj.right; i++) {
            result = result * msg.obj.left;
        }
        respond( null, { answer: result } );
    });

    this.wrap( 'role:math', function( msg, respond ) {
        msg.left  = Number(msg.left).valueOf()
        msg.right = Number(msg.right).valueOf()
        this.prior( msg, respond )
    })

}
