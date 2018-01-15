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
console.log(productCatalogue);

// initialise a new Order
var myOrder = new Order();
myOrder.add(productCatalogue.products[3], 2);
myOrder.add(productCatalogue.products[2], 1);

console.log("Order items: " + myOrder.lineItems);

var orderTmpl = `{{for orderItems}}
<tr>
    <td>{{>product.name}}</td>
    <td>{{>quantity}}</td>
    <td width="20%"><a class="button small icon fa-remove">Remove</a></td>
<tr>
{{/for}}`;
var tmpl = $.templates(orderTmpl);

var orderHtml = tmpl.render({
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
});

var renderOrder = {
    orderItems : myOrder.lineItems
};

// jsRender is not able to follow class objects, so need
//  to export to a simpler object format it can
var mySimpleOrder = myOrder.export();

console.log("Render Order: " + mySimpleOrder);
var orderTwoHtml = tmpl.render(mySimpleOrder);
console.log("Order generated html: " + orderHtml);
console.log("Second Order generated html: " + orderTwoHtml);
//$("#orderItems").html(orderHtml);
$("#orderItems").html(orderTwoHtml);

// display checkout
var checkoutTemplate = `{{for orderItems}}
<tr>
    <td>{{>product.name}}</td>
    <td>{{>quantity}}</td>
    <td>{{>product.unitPrice}}</td>
    <td>{{>subTotal}}</td>
<tr>
{{/for}}`;
var checkoutTmpl = $.templates(checkoutTemplate);

mySimpleOrder.total = myOrder.total;
console.log("The order total: " + mySimpleOrder.total);

var checkoutHtml = checkoutTmpl.render(mySimpleOrder);
$("#checkoutItems").html(checkoutHtml);
