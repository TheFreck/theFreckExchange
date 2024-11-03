import react, { useCallback, useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context";
import { FormControl, MenuItem, Select } from "@mui/material";
import {NewProductForm, ProductView} from "./ProductView";

export const CreateItems = () => {
    const productContext = useContext(ProductContext);
    const [product, setProduct] = useState({});
    const [items, setItems] = useState([]);
    const [products,setProducts] = useState([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        productContext.getProductsAsync(prods => {
            var prodys = [];
            for(var prod of prods){
                prodys.push(prod.name);
            }
            setProducts(prodys);
            console.log("products to create: ", productContext.products);
            setReady(true);
        });
    },[]);

    const selectProduct = async (p) => {
        console.log("select Product: ", p);
        await productContext.getItemsAsync(p,items => {
            console.log("items: ", items);
            setItems(items);
        });
    }

    const CreateItemsCallback = useCallback(() => <div>
        <div>Create Items</div>
        <FormControl fullWidth>
            <Select
                labelId="productSelectorLabel"
                id="productSelector"
                value={product.name}
                label="Product"
                onChange={p => selectProduct(p.target.value)}
            >
                {console.log("all ps: ", products)}
                {
                    products.map((p,i) => (
                        <MenuItem key={i} value={p}>{p}</MenuItem>
                    ))
                }
            </Select>
            <NewProductForm />
        </FormControl>
    </div>,[ready]);

    return <CreateItemsCallback />
}

export default CreateItems;