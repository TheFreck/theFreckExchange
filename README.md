# Payment_Processing

This is basically a storefront. On the back end there are 
### Account:
This is either a buyer in which they receive "user" credentials or an admin in which they get both "user" and "admin" credentials
### Product:
This is the base class for things bought and sold. When a new product is created the admin will add 
<pre>
  Name,
  Description,
  Price,
  Available Attributes (such as size, color, etc.)
</pre>
### Item : Product
An Item is an individual unit of a product. It will have the attribute values based on the available attributes setup in the Product. It will also be assigned a SKU.
<br/>
[demo](https://thefreckexchange-cvgkagadbkcedyfm.westus2-01.azurewebsites.net/)
<br/>
[roadmap](https://github.com/TheFreck/Payment_Processing.wiki.git)
