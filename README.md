# [theFreckExchange](https://thefreckexchange-cvgkagadbkcedyfm.westus-01.azurewebsites.net/)

This is basically a storefront. On the back end there are 
### Account:
This is either a buyer in which they receive "user" credentials or an admin in which they get both "user" and "admin" credentials
### Product:
This is the base class for things bought and sold. When a new product is created the admin will add 
<pre>
{
  Name,
  Description,
  Price,
  Available Attributes (such as size, color, etc.)
}
</pre>
### Item : Product
An Item is an individual unit of a product. It will have the attribute values based on the available attributes setup in the Product. It will also be assigned a SKU.
<pre>
{
  ProductName,
  ProductDescription,
  Price,
  SKU,
  Attributes: [
   {
     type: Attribute1 Name (color, size, etc.),
     value: Attribute1 Value (green, XL, etc.)
   },
   {
     type: Attribute2 Name,
     value: Attribute2 Value
   }
  ]
}
</pre>
### Shopping Cart
The Shopping Cart will display the items in your cart with the following functionality:
- Remove Item
- Change Item Quantity
- Proceed to Checkout
### Checkout
The Checkout page allows the user to submit payment. Since this is a simulation there is no payment taken. The shopping cart is emptied and item inventory quantities updated.
