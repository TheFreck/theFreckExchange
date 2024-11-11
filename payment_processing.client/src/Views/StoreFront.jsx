import react, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, Box, Grid2, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { pink } from "@mui/material/colors";
import ProductView from "./Product/ProductView";

export const StoreFront = ({ }) => {
    const productApi = axios.create({ baseURL: `https://localhost:7299/Product` });
    const [products, setProducts] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [items,setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [attributes,setAttributes] = useState([]);

    useEffect(() => {
        getProductsAsync(prods => {
            setProducts(prods);
            let prodItems = [];
            let prodNames = [];
            let count = 0;
            for(var prod of prods){
                let pImages = [];
                for(let pImage of prod.imageBytes){
                    pImages.push({bytes:pImage});
                }
                prod.imageBytes = pImages;

                prodNames.push({label:prod.name,id:count++});
                getAttributesAsync(prod.name,atts => {
                    setAttributes(atts);
                });
                getItemsAsync(prod.name,pItems => {
                    prodItems.push(pItems);
                    if(prodItems.length === prods.length){
                        setItems(prodItems);
                        setProductNames(prodNames);
                    }
                });
            }
        })
    },[]);

    useEffect(() => {
        let prodItems = [];
        let prodNames = [];
        let count = 0;
        for(var prod of products){
            let pImages = [];
            for(let pImage of prod.imageBytes){
                pImages.push({bytes:pImage.bytes});
            }
            prod.imageBytes = pImages;
            prodNames.push({label:prod.name,id:count++});
            getAttributesAsync(prod.name,atts => {
                setAttributes(atts);
            });
            getItemsAsync(prod.name,pItems => {
                prodItems.push(pItems);
                if(prodItems.length === products.length){
                    setItems(prodItems);
                    setProductNames(prodNames);
                }
            });
        }
    },[selectedProduct,products]);

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
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    }

    const ProductViewCallback = useCallback(() => <ProductView 
        product={selectedProduct}
        attributes={attributes}
        view="user"
    />,[selectedProduct,attributes]);

    return <Grid2
        container
        size={12}
    >
        <Grid2 size={12}>
            <Typography
                sx={{ fontSize: "2em" }}
            >
                TheFreck Store
            </Typography>
        </Grid2>
        <Grid2 size={12}
            sx={{display:"flex"}}
        >
            <Autocomplete
                sx={{width: "100%"}}
                disablePortal
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

export default StoreFront;