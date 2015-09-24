


module.exports = function(options) {

    this.add('role:shop,get:product', function getProduct(msg, respond) {
       this.make$( 'product' ).load$(msg.id, respond);
    });

    this.add('role:shop,add:product', function addProduct(msg, respond) {
       this.make$( 'product').data$(msg.product).save$(respond);
    });

    this.add('role:shop,cmd:purchase', function purchase(msg, respond) {
        this.make$('product').load$(msg.id, function(err, product) {
            if (err) return respond(err);

            this
                .make('purchase')
                .data$({
                    when:       Date.now(),
                    product:    product.id,
                    name:       product.name,
                    price:      product.price
                })
                .save$(function(err, purchase) {

                    this.act('role:shop,info:purchase', { purchase: purchase});
                    respond(null, purchase);
                });
        })
    })
}
