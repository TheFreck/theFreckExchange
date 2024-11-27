import react, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, Box, Grid2, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ProductView from "../Product/ProductView";

export const Store = ({ }) => {
    const productApi = axios.create({ baseURL: `/Product` });
    const [products, setProducts] = useState([]);
    const [productNames, setProductNames] = useState([""]);
    const [items,setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [ready,setReady] = useState(false);

    useEffect(() => {
        if(ready) return;
        getProductsAsync(async prods => {
            let allProds = [];
            let prodItems = [];
            let prodNames = [];
            let count = 0;
            for(var prod of prods){
                prodNames.push({label:prod.name,id:count++});
                await getAttributesAsync(prod.name,async atts => {
                    let pImages = [];
                    for(let pImage of prod.imageBytes){
                        pImages.push({bytes:pImage});
                    }
                    prod.imageBytes = pImages;
    
                    if(prod.name !== undefined && atts[0].product === prod.name){
                        prod.attributes = atts;
                        allProds.push(prod);
                        await getItemsAsync(prod.name,pItems => {
                            prodItems.push(pItems);
                            if(prodItems.length === prods.length){
                                setItems(prodItems);
                                setProductNames(prodNames);
                                setProducts(allProds);
                                setReady(true);
                            }
                        });
                    }
                });
            }
        })
    },[]);

    useEffect(() => {
        if(selectedProduct.name !== undefined){
            let prodItems = [];
            let pImages = [];
            for(let pImage of selectedProduct.imageBytes){
                pImages.push({bytes:pImage.bytes});
            }
            selectedProduct.imageBytes = pImages;
            getAttributesAsync(selectedProduct.name,atts => {
                if(atts[0].product === selectedProduct.name){
                    selectedProduct.attributes = atts;
                    getItemsAsync(selectedProduct.name,pItems => {
                        prodItems.push(pItems);
                        if(prodItems.length === products.length){
                            setItems(prodItems);
                        }
                    });
                }
            });
        }
    },[selectedProduct]);

    const getProductsAsync = async (cb) => {
        await productApi.get()
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    }

    const getItemsAsync = async (item,cb) => {
        await productApi.get(`items/${item}`)
        .then(yup => {
            cb({[item]:yup.data});
        })
        .catch(nope => console.error(nope));
    }

    const getAttributesAsync = async (prod, cb) => {
        await productApi.get(`items/product/${prod}/attributes`)
        .then(yup => {
            for(var att of yup.data){
                att.product = prod;
                att.values = att.value;
                att.value = "";
            }
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    }

    const updateProduct = (product,cb) => {
        setSelectedProduct(product);
        cb(product);
    }

    const ProductViewCallback = useCallback(() => {
        return selectedProduct && selectedProduct.attributes &&
        <ProductView 
            product={selectedProduct}
            view="user"
        />
    },[selectedProduct,setSelectedProduct]);

    return <Grid2
        container
        size={12}
    >
        <Grid2 size={12}>
            <Typography
                sx={{ fontSize: "2em" }}
            >
                TheFreck Exchange
            </Typography>
        </Grid2>
        <Grid2 size={12}
            sx={{display:"flex"}}
        >
            <Autocomplete
                sx={{width: "100%"}}
                options={productNames}
                onChange={c => setSelectedProduct(products.find(p => p.name === c.target.innerHTML))}
                renderInput={(params) => <TextField {...params} label="Product Search" />}
            />
            <SearchIcon 
                sx={{width:"auto", height: "2em"}}
            />
        </Grid2>
        { selectedProduct.name !== undefined &&
            <Grid2 size={12}>
                <ProductViewCallback />
            </Grid2>
        }
    </Grid2>
}

export default Store;