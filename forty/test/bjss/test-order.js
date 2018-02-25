/*
 * mocha test script against the BJSS tech challenge "Order" model
 * 
 * 20180116 Warren Ayling - refactoring as ES6 and using babel to transpile to ES5 for use in Mocha
 *                          Note, could have used webpack/babel to transpile this Mocha test file,
 *                          but mocha using "babel-register" module, can simply require from the
 *                          mocha command line within package.json.
 *                          Don't forget the .babelrc and the preset.
 */
import chai from 'chai';
let assert = chai.assert;
let expect = chai.expect;

import {Products, Product} from '../../assets/js/bjss/product';
import {Order, OrderItem} from '../../assets/js/bjss/order';

/* Note - Orders rely on Products; the testing of Products should be done prior to Orders */

let ourProducts = new Products();
ourProducts.initialise();   
let firstProduct = ourProducts.products[0];
let secondProduct = ourProducts.products[2];

describe ('Order Items', function() {
  describe('Good Order Item', function() {
    let goodOrderItem = new OrderItem(firstProduct, 7);

    it('should be peas', function() {
      assert.equal(goodOrderItem.product.name, 'peas');
    });
    it('should be 7 of them', function() {
      assert.equal(goodOrderItem.quantity, 7);
    });
    it('should be 0.95 unit price', function() {
      assert.equal(goodOrderItem.product.unitPrice, 0.95);
    });
    it('should have subtotal of 7*0.95=6.65', function() {
      assert.equal(goodOrderItem.subTotal.toFixed(2), 6.65);
    });
  });
  
  describe('Bad Order Item', function() {
    let goodOrderItem = new OrderItem(ourProducts.products[0], 7);

    it('should fail on change of product', function() {
      expect(function () {
        goodOrderItem.product = ourProducts.products[0];
      }).to.throw('Product cannot be changed');
    });
    it('should fail on change of quantity', function() {
      expect(function () {
        goodOrderItem.quantity = 10;
      }).to.throw('Quantity cannot be changed');
    });

    it('should fail if quantity is zero', function() {
      expect(function () {
        let badOrderItem = new OrderItem(ourProducts.products[0], 0);
      }).to.throw('Unknown quantity');
    });
    it('should fail if quantity is less than zone', function() {
      expect(function () {
        let badOrderItem = new OrderItem(ourProducts.products[0], -1);
      }).to.throw('Unknown quantity');
    });
    it('should fail if quantity is not a whole number', function() {
      expect(function () {
        let badOrderItem = new OrderItem(ourProducts.products[0], 1.1);
      }).to.throw('Unknown quantity');
    });
    it('should fail if product is not a "BJSS" Product', function() {
      expect(function () {
        let badOrderItem = new OrderItem(1, 1);
      }).to.throw('Undefined product');
    });
    // end of describe('Bad Order Item'
  });
}); // end of describe ('Order Items'


// chai testing using expect
describe ('Order', function() {
  describe('Good Order', function() {
    let goodOrder = new Order();

    it('should start with no order items', function() {
      expect(goodOrder.lineItems).to.have.lengthOf(0);
    });

    it('should add line item', function() {
      expect(function () {
        goodOrder.add(firstProduct, 3);
      }).to.not.throw();
    })
    it('should now have one order items', function() {
      expect(goodOrder.lineItems).to.have.lengthOf(1);
    });

    it('should add another line item', function() {
      expect(function () {
        goodOrder.add(secondProduct, 1);
      }).to.not.throw();
    })
    it('should now have two order items', function() {
      expect(goodOrder.lineItems).to.have.lengthOf(2);
    });
  
    it('should delete second line item', function() {
      expect(function () {
        goodOrder.remove(1);
      }).to.not.throw();
    })
    it('should now have one order item', function() {
      expect(goodOrder.lineItems).to.have.lengthOf(1);
    });
    it('should now have one order item that being peas', function() {
      expect(goodOrder.lineItems[0].product.name).to.equal('peas');
    });

    it('should have order total of 3*peas @ 0.95 each = 2.85', function() {
      expect(goodOrder.total.toFixed(2)).to.equal('2.85');
    });
    
  }); // end describe('Good Order'

  describe('Bad Order', function() {
    let goodOrder = new Order();
    goodOrder.add(secondProduct, 1);

    it('should fail when deleting item out of bounds', function() {
      expect(goodOrder.lineItems).to.have.lengthOf(1);
      expect(function () {
        goodOrder.remove(3);
      }).to.throw('Unexpected index');
    });
    it('should fail when deleting item of negative index', function() {
      expect(goodOrder.lineItems).to.have.lengthOf(1);
      expect(function () {
        goodOrder.remove(-1);
      }).to.throw('Unexpected index');
    });
  
  }); // end describe('Good Order'


});