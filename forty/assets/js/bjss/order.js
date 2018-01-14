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
}

module.exports.Order = Order;
module.exports.OrderItem = OrderItem;