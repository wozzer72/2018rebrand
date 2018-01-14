/* WOZiTech - BJSS Challenge */

// VueJS/Angular are not readily available in my corporate website; opting to use JSview (with JSOberservale/JSTemplates)
//  to handle the dynamic aspects of the web page.

// Opting also to present Order and Checkout on the same page (SPA) to improve the user experience.

// Referencing a localised model of the problem domain:
// * Order - an Order has zero of more OrderItems
// * OrderItem - an OrderItem references a ProductItem
// * ProductItem - has name & unit price
// * Product - collection of all ProductItems

var products = require('./bjss/product');

var productCatalogue = new products.Products();
var newProduct = new products.Product("bread", 1.23);

console.log("newProduct name: " + newProduct.name);

newProduct.name = "milk";
console.log("newProduct name: " + newProduct.name);
newProduct.unitPrice = 1.78;
console.log("newProduct unitProce: " + newProduct.unitPrice);