import react, { useCallback, useContext, useEffect, useState } from "react";
import { ProductContext } from "../../Context";
import { FormControl, MenuItem, Select } from "@mui/material";
import ProductView from "../Product/ProductView";

export const CreateItems = () => {
    const {getProductsAsync,getItemsAsync,getAttributesAsync} = useContext(ProductContext);
    const [product, setProduct] = useState({});
    const [items, setItems] = useState([]);
    const [products,setProducts] = useState([]);
    const [ready, setReady] = useState(false);
    const [attributes,setAttributes] = useState([]);

    useEffect(() => {
        getProductsAsync(prods => {
            var prodys = [];
            for(var prod of prods){
                prodys.push(prod);
            }
            setProducts(prodys);
            setReady(true);
        });
    },[]);

    const selectProduct = async (p) => {
        console.log("select Product: ", p);
        setProduct(p);
        getAttributesAsync(p.name,att => {
            console.log("selected product got attributes: ", att);
            setAttributes(att);
            setReady(!ready);
        })
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
                {
                    products.map((p,i) => (
                        <MenuItem key={i} value={p}>{p.name}</MenuItem>
                    ))
                }
            </Select>
            {attributes.length > 0 && <ProductView product={product} attributes={attributes} setAttributes={setAttributes} />}
        </FormControl>
    </div>,[ready]);

    return <CreateItemsCallback />
}

export default CreateItems;