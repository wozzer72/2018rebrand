(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("BJSS", [], factory);
	else if(typeof exports === 'object')
		exports["BJSS"] = factory();
	else
		root["BJSS"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bjss_product__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bjss_product___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bjss_product__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bjss_order__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bjss_order___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__bjss_order__);
/* WOZiTech - BJSS Challenge */

// VueJS/Angular are not readily available in my corporate website; opting to use JSview (with JSOberservale/JSTemplates)
//  to handle the dynamic aspects of the web page.

// Opting also to present Order and Checkout on the same page (SPA) to improve the user experience.

// Referencing a localised model of the problem domain:
// * Order - an Order has zero of more OrderItems
// * OrderItem - an OrderItem references a ProductItem
// * ProductItem - has name & unit price
// * Product - collection of all ProductItems




// initialise the Product Catalogue
var productCatalogue = new __WEBPACK_IMPORTED_MODULE_0__bjss_product__["Products"]();
productCatalogue.initialise();
//console.log(productCatalogue);

// initialise a new Order
var myOrder = new __WEBPACK_IMPORTED_MODULE_1__bjss_order__["Order"]();
myOrder.add(productCatalogue.products[3], 2);
myOrder.add(productCatalogue.products[2], 1);

//console.log("Order items: " + myOrder.lineItems);

var orderTmpl = `{{for orderItems}}
<tr>
    <td>{{>product.name}}</td>
    <td>{{>quantity}}</td>
    <td width="20%"><a class="button small icon fa-remove">Remove</a></td>
<tr>
{{/for}}`;
var tmpl = $.templates(orderTmpl);
// jsRender is not able to follow class objects, so need
//  to export to a simpler object format it can
var mySimpleOrder = myOrder.export();
var orderHtml = tmpl.render(mySimpleOrder);
$("#orderItems").html(orderHtml);

// introducing a format helper for the prices
// TODO: update the template to use this helper
var formatCurrency = function(currency, value) {
    var formattedCurrency = '';
    switch (currency) {
        //TODO - add other currencies
        default:
            formattedCurrency = "£" + value.toFixed(2);
            break;
    }
    return formattedCurrency;
}

// display checkout
var checkoutTemplate = `<thead>
<tr>
    <th>Product</th>
    <th>Quantity</th>
    <th>Unit Price</th>
    <th>Subtotal (GBP)</th>
</tr>
</thead>
<tfoot>
    <th colspan="3">Total</th>
    <th>{{>total}}</th>
</tfoot>
<tbody>
    {{for orderItems}}
    <tr>
        <td>{{>product.name}}</td>
        <td>{{>quantity}}</td>
        <td>{{>product.unitPrice}}</td>
        <td>{{>subTotal}}</td>
    <tr>
    {{/for}}
</tbody>`;
var checkoutTmpl = $.templates(checkoutTemplate);
// add the order total for checkout
mySimpleOrder.total = myOrder.total;
var checkoutHtml = checkoutTmpl.render(mySimpleOrder);
$("#checkoutTbl").html(checkoutHtml);



/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
 * BJSS Tech challenge - Products and Product
 */

 class Product {
     constructor(name, unitPrice) {
         // initialise product here
         this.unitPrice = unitPrice;

         if (typeof name === "string") {
            this._name = name;
         } else {
            throw "Name must be a string";
         }
     }

     /* properties */
     get unitPrice() {
         return this._unitPrice;
     }
     set unitPrice(price) {
        if (typeof price === "number") {
            this._unitPrice = price;
        } else {
            throw "Price must be a decimal number";
        }
     }
     get name() {
         return this._name;
     }
     // on reflection. cannot change name
     set name(name) {
        throw "Name cannot be changed";
     }

     /* methods */
 }

 class Products {
     constructor() {
        this._products = [];
     }

     /* properties */
     // cannot change the set of products in a catalogue; just get the list of products
     get products() {
         return this._products;
     }

     /* methods */
     // for this challenge, assume an initial set of products (as per the brief)
     initialise() {
        this._products.push(
            new Product('peas', 0.95)
        );
        this._products.push(
            new Product('eggs', 2.10)
        );
        this._products.push(
            new Product('milk', 1.30)
        );
        this._products.push(
            new Product('beans', 0.73)
        );

        return true;
     }
 }

 module.exports.Product = Product;
 module.exports.Products = Products;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
 * BJSS Tech challenge - Order and OrderItem
 */

// an OrderItem is immutable
class OrderItem {
    constructor(product, quantity) {
        if (product !== undefined &&
            product !== null &&
            typeof product === "object") {
            this._product = product;
        } else {
            throw "Undefined product";
        }

        // not only should quantity be defined and whole number, but it must be 1 or more
        if (quantity !== undefined &&
            quantity !== null &&
            typeof quantity  === "number" &&
            Number.isInteger(quantity) &&
            quantity > 0) {
            this._quantity = quantity;
        } else {
            throw "Unknown quantity";
        }
    }

     /* properties */
     get quantity() {
         return this._quantity;
     }
     set quantity(quantity) {
         try {} finally {
             throw "Quantity cannot be changed";
         }
     }
     get product() {
         return this._product;
     }
     set product(product) {
        try {} finally {
            throw "Product cannot be changed";
        }
    }
    // calculates the sub total for this line item by multipling
    //  the product price by quantity
    get subTotal() {
        return this._product.unitPrice * this._quantity;
    }

     /* methods */
}

class Order {
    constructor() {
        // initialise the Order - having no order items
        this._lineItems = [];
    }

    /* properties */
    get lineItems() {
        return this._lineItems;
    }
    set lineItems(items) {
        throw "Cannot set lineitems";
    }
    // the generated property returns the total of all line items
    get total() {
        var thisTotal = 0;
        this._lineItems.forEach(function(thisLineItem) {
            thisTotal += thisLineItem.subTotal;
        });
        return thisTotal;
    }

    /* methods */
    add(product, quantity) {
        // note - validation is done within OrderItem
        this._lineItems.push(new OrderItem(product, quantity));
    }
    remove(orderItemIndex) {
        if (orderItemIndex !== undefined &&
            orderItemIndex !== null &&
            Number.isInteger(orderItemIndex) &&
            orderItemIndex > -1 &&
            orderItemIndex < this._lineItems.length) {

            // todo - remove given index from array
            this._lineItems.splice(orderItemIndex,1);
        } else {
            throw "Unexpected index";
        }
    }

    // this method iterates through the Order and exports to a pure object format
    //  that can be used by jsRender
    /*
    orderItems : [
        {
            product: {
                name: "Doughnuts"
            },
            quantity: 2
        },
        {
            product: {
                name: "Potatoes"
            },
            quantity: 5
        }
    ]
    */
    export() {
        var exportType = {
            orderItems : []
        };

        // simply iterate over order items
        this._lineItems.forEach(function(thisLineItem) {
            exportType.orderItems.push({
                product: {
                    name: thisLineItem.product.name,
                    unitPrice: thisLineItem.product.unitPrice
                },
                quantity: thisLineItem.quantity,
                subTotal: thisLineItem.subTotal
            });
        });

        return exportType;
    }
}

module.exports.Order = Order;
module.exports.OrderItem = OrderItem;

/***/ })
/******/ ]);
});