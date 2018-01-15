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

// initialise a new Order
var myOrder = new Order();
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

