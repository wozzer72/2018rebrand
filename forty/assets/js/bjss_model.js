/******/ (function(modules) { // webpackBootstrap
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bjss_order__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bjss_ext__ = __webpack_require__(3);
/* WOZiTech - BJSS Challenge */

// VueJS/Angular are not readily available in my corporate website; opting to use JSview (with JSOberservale/JSTemplates)
//  to handle the dynamic aspects of the web page.

// Opting also to present Order and Checkout on the same page (SPA) to improve the user experience.

// Referencing a localised model of the problem domain:
// * Order - an Order has zero of more OrderItems
// * OrderItem - an OrderItem references a ProductItem
// * ProductItem - has name & unit price
// * Product - collection of all ProductItems





// fetching the list of currencies to be display
var bjssExt = new __WEBPACK_IMPORTED_MODULE_2__bjss_ext__["a" /* default */]();

// initialise the Product Catalogue
var productCatalogue = new __WEBPACK_IMPORTED_MODULE_0__bjss_product__["a" /* Products */]();
productCatalogue.initialise();
//console.log(productCatalogue);

// initialise a new Order - note, only ever one active order
var myOrder = new __WEBPACK_IMPORTED_MODULE_1__bjss_order__["a" /* Order */]();

var orderTmpl = `{{for orderItems}}
<tr>
    <td>{{>product.name}}</td>
    <td>{{>quantity}}</td>
    <td width="20%"><a data-index="{{:#index}}" class="button small icon fa-remove">Remove</a></td>
<tr>
{{/for}}`;
var tmpl = $.templates(orderTmpl);

// introducing a format helper for the prices
// TODO: update the template to use this helper
var formatCurrency = function(currency, value) {
    var formattedCurrency = '';
    switch (currency) {
        //TODO - add other currencies
        case 'EUR':
            formattedCurrency = '&euro;' + value.toFixed(2);
            break;
        case 'USD':
            formattedCurrency = '$' + value.toFixed(2);
            break;
        case 'GBP':
            formattedCurrency = '£' + value.toFixed(2);
            break;
        default:
            formattedCurrency = value.toFixed(0);
            break;
    }
    return formattedCurrency;
}

// display checkoutimport Extra from './bjss/ext';
// fetching the list of currencies to be display
var bjssExt = new __WEBPACK_IMPORTED_MODULE_2__bjss_ext__["a" /* default */]();

var checkoutTemplate = `<thead>
<tr>
    <th>Product</th>
    <th>Quantity</th>
    <th>Unit Price</th>
    <th>Subtotal (GBP)</th>
</tr>
</thead>
<tfoot>
    <tr>
        <th colspan="3">Total</th>
        <th>{{>total}}</th>
    </tr>
    <tr>
        <td colspan="3">Total ({{>currency}})</td>
        <td>{{:convertedTotal}}</td>
    </tr>
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

var populateProductList = function() {
    var productListDropDown = $("#productlist");
    productListDropDown.empty();

    // build the product list drop down by simply iterating
    //  through known products in the product catalogue
    // NOTE - "index" (the loop counter) is used to introduce
    //        a unique "product ID"
    productCatalogue.products.forEach(function(thisProduct, index) {
        productListDropDown.append('<option value="' +
                                index + 
                                '">' + thisProduct.name + ' (&pound;' +
                                thisProduct.unitPrice.toFixed(2) +
                                ')</option>');

    });
};

// initialise the 'app'
$().ready(function() {
    // initial state is both views are hidden
    $("#order").hide();
    $("#checkout").hide();


    // until dynamic view is working; default initial order items
    //myOrder.add(productCatalogue.products[3], 2);
    //myOrder.add(productCatalogue.products[2], 1);

    // initialise the product list view
    populateProductList();

    //console.log("Order items: " + myOrder.lineItems);

    // on loading the 'app', display the order page only
    refreshOrder()

    var currencyPromise = bjssExt.currencyList();
    currencyPromise.then(function (currencies) {
            var currencyList = Object.keys(currencies);
            var currencyDropDown = $("#currencylist");
            currencyDropDown.empty();

            currencyList.forEach(function(thisCurrency) {
                console.log("This currency: " + thisCurrency);
                currencyDropDown.append(
                    $('<option>', {
                        value: thisCurrency,
                        text: thisCurrency
                    }, '</option>')
                );
                //currencyDropDown.ap:pend('<option>' + thisCurrency + '</option>');
            });
            //alert(currencyList);
        }).catch(function(exception) {
            console.log(exception);
        });
});

// helper function that redraws the checkout
function refreshCheckout(currency='GBP',convertedTotal=null) {
    // Could use a custom view method, or template helper function
    //  to format the currency, or, given we have the simplified
    //  representation, the total and convertedTotal can be
    //  formatted here

    // first, get the simplified representation of the Order
    var mySimpleOrder = myOrder.export();
    mySimpleOrder.total = formatCurrency('GBP', myOrder.total);

    // add additional currency detail to the simplified rep
    //  ready for the view.
    mySimpleOrder.currency = currency;
    if (convertedTotal) {
        mySimpleOrder.convertedTotal = formatCurrency(currency, convertedTotal);
    } else {
        mySimpleOrder.convertedTotal = formatCurrency('GBP', myOrder.total);;
    }
    
    // now draw view
    var checkoutHtml = checkoutTmpl.render(mySimpleOrder);
    $("#checkoutTbl").html(checkoutHtml);
    $("#checkout").show();    
}

// attach a callback to the checkout button
$("#checkoutBtn").click(function() {
    // on selecting checkout, hide the order view, but show the checkout view
    $("#order").hide();
    refreshCheckout();
});

// attach a callback to the "edit order" button
$("#editOrderBtn").click(function() {
    // on selecting "edit order", hide the checkout view, but show the order view
    //  note - no need to reraw the order view because cannot change the order
    //         on checkout
    $("#checkout").hide();
    $("#order").show();
});

/* it is appreciated that redrawing the whole view (both order and checkout)
   could be expensive, but given the complexity of the view and the size of
   the data, the simplicity of redrawing rather than refreshing wins over
   for this exercise.
*/

// attach a callback from currencylistwhen the currency is changed, to recalculate
// the converted currency and redraw the checkout view{{:#index}}
$("#currencylist").change(function (event) {
    var newCurrency = $("#currencylist").val();
    if (newCurrency && newCurrency.length == 3) {

        var convertPromise = bjssExt.convertToCurrency(myOrder.total, newCurrency);
        if (convertPromise != null) {
            convertPromise.then(function(convertedTotal) {
                console.log(myOrder.total + " in GBP is " + convertedTotal.toFixed(2) + " in " + newCurrency);

                // redraw the checkout view
                refreshCheckout(newCurrency, convertedTotal)

            }).catch(function(exception) {
                console.log(exception);
            });
        }
    }
});

// helper function that redraws the order
function refreshOrder() {
    // first, get the simplified representation of the Order
    var mySimpleOrder = myOrder.export();
    var orderHtml = tmpl.render(mySimpleOrder);
    $("#orderItems").html(orderHtml);
    $("#order").show();

    // attach callbacks to remove link
    $("a[data-index]").click(function (event) {
        var thisLinkIndex =  Number($(this).attr('data-index'));
        if (thisLinkIndex > -1) {

            // remove the order line item
            try {
                myOrder.remove(thisLinkIndex);

                // redraw the order view
                refreshOrder();
            } catch (exception) {
                console.log(exception);
            }
        } else {
            console.log("Unexpected line order index: " + thisLinkIndex);
        }
    });
}


// add callback for add line item
$("#addLineItemBtn").click(function() {
    var selectedProduct = $("#productlist").val();
    var quantity = Number($("#quanity").val());

    // TODO: improve error handling
    if (selectedProduct && selectedProduct > -1 &&
        quantity && quantity > 0) {

        try {
            // update the order
            var newProduct = productCatalogue.products[selectedProduct];
            myOrder.add(newProduct, quantity);

            // redraw the order
            refreshOrder();
        } catch (exception) {
            console.log(exception);
        }
    }
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
/* unused harmony export Product */


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
/* harmony export (immutable) */ __webpack_exports__["a"] = Products;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Order; });
/* unused harmony export OrderItem */
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
        // Note - we know that order items are in GBP (hence subtotal is two decimal places)
        this._lineItems.forEach(function(thisLineItem) {
            exportType.orderItems.push({
                product: {
                    name: thisLineItem.product.name,
                    unitPrice: thisLineItem.product.unitPrice
                },
                quantity: thisLineItem.quantity,
                subTotal: Math.round(thisLineItem.subTotal * 100) / 100
            });
        });

        return exportType;
    }
}



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*
 * ext.js - encapsulates the fetching of currencies and currency conversion
 * 
 * Relies on jquery (ajax).
 * Relies upon ES6 Promises (will not work in Internet Explorer unless using bluebird.js).
 * 
 * Example urls: http://apilayer.net/api/list?access_key=41607a8f5f4f41bab7fd6a19893bb4fd
 */

 class Extra {
    constructor() {
        this._jsonRatesUrl = 'http://jsonrates.com/';
        this._accessKey = '41607a8f5f4f41bab7fd6a19893bb4fd';
    }

    /* properties */

    /* methods */

    // returns list of currencies, as fetched from from jsonRates
    //  => using Promise
    currencyList() {
        var thisExt = this;
        return new Promise(function(resolve, reject) {
            // a simple GET to retrieve JSON
            $.ajax({
                url: 'http://apilayer.net/api/list?access_key=' + thisExt._accessKey,
                type: "get",
                contentType: false,
                dataType: "json",
                processData: false,
                cache: false,
                success: function(data) {
                    resolve(data.currencies);
                },
                error: function (jqXHR, exception) {
                    reject(exception);
                }
            });
        });
    }

    // returns the converted value from GBP to the given currency
    // => using Promise
    // Note - when providing "source" parameter to API request,
    //  got the response "- Your current Subscription Plan does not support Source Currency Switching."
    // Instead, using a rough calculation based on the USD as default currency by:
    //  1. Get three currencies (USD - default, plus the source currency of GBP and the target currency, e.g. EUR)
    //  2. Convert the GBP value to USD value, using "USDGBP"
    //  3. Then convert from USD to the target currency using "USB[target currency]"
    // Or more simply, divide the Target Rate by the GBP rate, and multiple the value.
    convertToCurrency(value, currency) {
        var thisExt = this;

        // TODO: improve error handling here
        if (currency.length != 3 ||
            value < 0) {
            console.log("Unexpected parameters");
            return null;

        } else {
            return new Promise(function(resolve, reject) {
                // a simple GET to retrieve JSON
                var fetchCurrencies = 'USD,GBP,' + currency;
                var fetchUrl = 'http://apilayer.net/api/live?access_key=' + thisExt._accessKey + '&currencies=' + escape(fetchCurrencies);
                //console.log("Fetching: " + fetchUrl);
                $.ajax({
                    url: fetchUrl,
                    type: "get",
                    contentType: false,
                    dataType: "json",
                    processData: false,
                    cache: false,
                    success: function(data) {
                        // TODO: Improve error handling here too
                        if (data.quotes) {
                            var fromGBPtoUSDrate = Number(data.quotes['USDGBP']);
                            var fromUSDtoTargetRate = Number(data.quotes['USD'+currency]);
                            var targetExchangeRate = fromUSDtoTargetRate / fromGBPtoUSDrate;

                            resolve(value*targetExchangeRate);                            
                        } else {
                            reject("Missing quotes");
                        }
                    },
                    error: function (jqXHR, exception) {
                        reject(exception);
                    }
                });
            });
        }
    }
 }
/* harmony export (immutable) */ __webpack_exports__["a"] = Extra;
;


 

/***/ })
/******/ ]);