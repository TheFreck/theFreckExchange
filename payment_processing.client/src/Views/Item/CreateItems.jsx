import react, { useCallback, useContext, useEffect, useState } from "react";
import { ProductContext } from "../../Context";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ProductView from "../Product/ProductView";

export const CreateItems = ({products}) => {
    const { getProductsAsync, getAvailableAttributesAsync } = useContext(ProductContext);
    const [productsArray,setProductsArray] = useState([]);
    const [product, setProduct] = useState("");
    const [ready, setReady] = useState(false);
    const [attributes, setAttributes] = useState([]);

    useEffect(() => {
        if(products.size === 0) return;
        var prods = [];
        for(var prod of products.values()){
            prods.push(prod);
        }
        setProductsArray(prods);
    }, []);

    const selectProduct = (p) => {
        setProduct(p.target.value);
        getAvailableAttributesAsync(p.target.value.name, att => {
            setAttributes(att);
            setReady(!ready);
        })
    }

    const CreateItemsCallback = useCallback(() => <div>
        <div>
            {products.size > 0  && productsArray.length > 0 && 
                <FormControl fullWidth>
                    <InputLabel id="productLabel">Product</InputLabel>
                    <Select
                        id="productSelector"
                        labelId="productLabel"
                        label="Product"
                        value={product}
                        onChange={selectProduct}
                    >
                        <MenuItem
                            name="Select a product"
                            value=""
                            disabled
                        >
                            Select a product
                        </MenuItem>
                        {productsArray.length > 0 && productsArray.map((p, i) => (
                            <MenuItem 
                                name={p.name} 
                                key={i} 
                                value={p}
                            >
                                {p.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            }
        </div>
        <div>
            {attributes.length > 0 && product.name !== undefined && <ProductView product={product} attributes={attributes} view="admin" />}
        </div>
    </div>, [ready, product, productsArray, attributes]);

    return <CreateItemsCallback />
}

export default CreateItems;