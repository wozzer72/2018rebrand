/*
 * mocha test script against the BJSS tech challenge "Order" model
 */
//var assert = require('assert');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var bjssProduct = require('../../assets/js/bjss/product');
var bjssOrder = require('../../assets/js/bjss/order');

/* Note - Orders rely on Products; the testing of Products should be done prior to Orders */

var ourProducts = new bjssProduct.Products();
ourProducts.initialise();   
firstProduct = ourProducts.products[0];
secondProduct = ourProducts.products[2];

describe ('Order Items', function() {
  describe('Good Order Item', function() {
    var goodOrderItem = new bjssOrder.OrderItem(firstProduct, 7);

    it('should be peas', function() {
      assert.equal(goodOrderItem.product.name, 'peas');
    });
    it('should be 7 of them', function() {
      assert.equal(goodOrderItem.quantity, 7);
    });
  });
  
  describe('Bad Order Item', function() {
    var goodOrderItem = new bjssOrder.OrderItem(ourProducts.products[0], 7);

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
        var badOrderItem = new bjssOrder.OrderItem(ourProducts.products[0], 0);
      }).to.throw('Unknown quantity');
    });
    it('should fail if quantity is less than zone', function() {
      expect(function () {
        var badOrderItem = new bjssOrder.OrderItem(ourProducts.products[0], -1);
      }).to.throw('Unknown quantity');
    });
    it('should fail if quantity is not a whole number', function() {
      expect(function () {
        var badOrderItem = new bjssOrder.OrderItem(ourProducts.products[0], 1.1);
      }).to.throw('Unknown quantity');
    });
    it('should fail if product is not a "BJSS" Product', function() {
      expect(function () {
        var badOrderItem = new bjssOrder.OrderItem(1, 1);
      }).to.throw('Undefined product');
    });
    // end of describe('Bad Order Item'
  });
}); // end of describe ('Order Items'


// chai testing using expect
describe ('Order', function() {
  describe('Good Order', function() {
    var goodOrder = new bjssOrder.Order();

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

    console.log("Exported order: " + goodOrder.export());
  }); // end describe('Good Order'

  describe('Bad Order', function() {
    var goodOrder = new bjssOrder.Order();
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