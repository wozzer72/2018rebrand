/* WOZiTech - BJSS Challenge */

// VueJS/Angular are not readily available in my corporate website; opting to use JSview (with JSOberservale/JSTemplates)
//  to handle the dynamic aspects of the web page.

// Opting also to present Order and Checkout on the same page (SPA) to improve the user experience.

// Referencing a localised model of the problem domain:
// * Order - an Order has zero of more OrderItems
// * OrderItem - an OrderItem references a ProductItem
// * ProductItem - has name & unit price
// * Product - collection of all ProductItems

import {Products, Product} from './bjss/product';
import {Order, OrderItem} from './bjss/order';
import Extra from './bjss/ext';

// fetching the list of currencies to be display
var bjssExt = new Extra();

// initialise the Product Catalogue
var productCatalogue = new Products();
productCatalogue.initialise();
//console.log(productCatalogue);

// initialise a new Order - note, only ever one active order
var myOrder = new Order();

var orderTmpl = `{{for orderItems}}
<tr>
    <td>{{>product.name}}</td>
    <td>{{>quantity}}</td>
    <td width="20%"><a class="button small icon fa-remove">Remove</a></td>
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
var bjssExt = new Extra();

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
    myOrder.add(productCatalogue.products[3], 2);
    myOrder.add(productCatalogue.products[2], 1);

    // initialise the product list view
    populateProductList();

    //console.log("Order items: " + myOrder.lineItems);

    // on loading the 'app', display the order page only

    // jsRender is not able to follow class objects, so need
    //  to export to a simpler object format it can
    var mySimpleOrder = myOrder.export();
    var orderHtml = tmpl.render(mySimpleOrder);
    $("#orderItems").html(orderHtml);
    $("#order").show();
    
    /*
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
    */
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