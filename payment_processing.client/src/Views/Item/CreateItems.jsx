import react, { useCallback, useContext, useEffect, useState } from "react";
import { ProductContext } from "../../Context";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ProductView from "../Product/ProductView";
import { Label } from "@mui/icons-material";

export const CreateItems = ({products}) => {
    const { getProductsAsync, getAvailableAttributesAsync } = useContext(ProductContext);
    const [product, setProduct] = useState({});
    const [productsArray, setProductsArray] = useState([]);
    const [ready, setReady] = useState(false);
    const [attributes, setAttributes] = useState([]);

    useEffect(() => {
        if(!products) return;
        var prods = [];
        for(var prod of products.values()){
            prods.push(prod);
        }
        setProductsArray(prods);
    }, []);
    
    useEffect(() => {
            console.log("product useeffect: ", product);
    },[product]);

    const selectProduct = async (p) => {
        console.log("selected: ", p.target.value);
        setProduct(p.target.value);
        getAvailableAttributesAsync(p.target.value.name, att => {
            setAttributes(att);
            setReady(!ready);
        })
    }

    const CreateItemsCallback = useCallback(() => <div>
        {products.size > 0 && <FormControl fullWidth>
        <InputLabel id="productLabel">Product</InputLabel>
            <Select
                id="productSelector"
                labelId="productLabel"
                label="Product"
                value={product}
                onChange={selectProduct}
            >
                {productsArray.map((p, i) => (
                    <MenuItem name={p.name} key={i} value={p}>{p.name}</MenuItem>
                ))}
            </Select>
        </FormControl>}
        {attributes.length > 0 && product.name !== undefined && <ProductView product={product} attributes={attributes} setAttributes={setAttributes} />}
    </div>, [ready, product, productsArray, attributes]);

    return <CreateItemsCallback />
}

export default CreateItems;