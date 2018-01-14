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