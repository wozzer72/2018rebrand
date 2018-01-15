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
    <tr>
        <th colspan="3">Total</th>
        <th>{{>total}}</th>
    </tr>
    <tr>
        <td colspan="3">Total ({{>currency}})</td>
        <td>{{>convertedTotal}}</td>
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

// initialise the 'app'
import Extra from './bjss/ext';
$().ready(function() {
    // initial state is both views are hidden
    $("#order").hide();
    $("#checkout").hide();

    // fetching the list of currencies to be display
    var bjssExt = new Extra();

    // until dynamic view is working; default initial order items
    myOrder.add(productCatalogue.products[3], 2);
    myOrder.add(productCatalogue.products[2], 1);

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
                currencyDropDown.append('<option>' + thisCurrency + '</option>');
            });
            //alert(currencyList);
        }).catch(function(exception) {
            console.log(exception);
        });
    */
    // now convert a value to EUR
    /*
    var convertPromise = bjssExt.convertToCurrency(10, 'EUR');
    if (convertPromise != null) {
        convertPromise.then(function(data) {
            console.log("£10 is EUR" + data);
        }).catch(function(exception) {
            console.log(exception);
        });
    }
    */
});

// attach a callback to the checkout button
$("#checkoutBtn").click(function() {
    // on selecting checkout, hide the order view, but show the checkout view
    $("#order").hide();

    // add the order total for checkout
    var mySimpleOrder = myOrder.export();
    mySimpleOrder.total = myOrder.total;
    mySimpleOrder.currency = 'GBP';
    mySimpleOrder.convertedTotal = myOrder.total;
    var checkoutHtml = checkoutTmpl.render(mySimpleOrder);
    $("#checkoutTbl").html(checkoutHtml);
    $("#checkout").show();
})

// attach a callback to the "edit order" button
$("#editOrderBtn").click(function() {
    // on selecting "edit order", hide the checkout view, but show the order view
    //  note - no need to reraw the order view because cannot change the order
    //         on checkout
    $("#checkout").hide();
    $("#order").show();
})