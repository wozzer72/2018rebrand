/*
 * mocha test script against the BJSS tech challenge "Product" model.
 * 
 * Note - this is still using ES5 format
 */
//var assert = require('assert');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var bjssProduct = require('../../assets/js/bjss/product');

describe ('Product', function() {
  describe('Good Product', function() {
    // create a product
    var goodProduct = new bjssProduct.Product('bread', 1.23);

    it('should be bread', function() {
      assert.equal(goodProduct.name, 'bread');
    });
    it('should cost 1.23', function() {
      assert.equal(goodProduct.unitPrice, 1.23);
    });

    it('should now cost 1.73', function() {
      goodProduct.unitPrice = 1.73;
      assert.equal(goodProduct.unitPrice, 1.73);
    });
  });

  describe ('Bad Product', function() {
    var badProduct = new bjssProduct.Product('bread', 1.23);
    
    it('unitPrice should be a number', function() {
      expect(function () {
        badProduct.unitPrice='1.23';
      }).to.throw('Price must be a decimal number');
    });
    it('should not be able to change name', function() {
      expect(function () {
        badProduct.name=1.23;
      }).to.throw('Name cannot be changed');
    });
    it('should fail on construction', function() {
      expect(function () {
        var createBadProduct=new bjssProduct.Product("badProduct", "1.23");
      }).to.throw('Price must be a decimal number');
      expect(function () {
        var createBadProduct=new bjssProduct.Product(1.23, 1.23);
      }).to.throw('Name must be a string');
    });
  
  });
});

describe('Products', function() {
  // create an instance of the Product catalogue
  var ourProducts = new bjssProduct.Products();

  describe('Catalogue', function() {
    it('should be empty once instaniated', function() {
      assert.lengthOf(ourProducts.products, 0);
    });

    // now initialise the catalogue
    it('should be able to initialise catalogue', function() {
      assert.equal(ourProducts.initialise(), true);
    });

    it('should now be four products', function() {
      assert.lengthOf(ourProducts.products, 4);
    });

    it('should have second product being eggs', function() {
      assert.equal(ourProducts.products[1].name, 'eggs');
    });
  });
});
