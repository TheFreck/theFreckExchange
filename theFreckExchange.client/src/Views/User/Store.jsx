import react, { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Autocomplete, Box, Grid2, Modal, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PurchaseItem from "../Item/PurchaseItem";
import {getProductsAsync,getImagesFromReferencesAsync,getItemsAsync,getAttributesAsync} from "../../helpers/helpersWelcome";

export const Store = ({ }) => {
    const [products, setProducts] = useState([]);
    const [productNames, setProductNames] = useState([""]);
    const [items,setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [ready,setReady] = useState(false);
    const [open,setOpen] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        if(ready) return;
        getProductsAsync(async prods => {
            let prodItems = [];
            let prodNames = [];
            let count = 0;
            for(var prod of prods){
                prodNames.push({label:prod.name,id:count++});
                await getItemsAsync(prod.name,pItems => {
                    prodItems.push(pItems);
                    if(prodItems.length === prods.length){
                        setItems(prodItems);
                        setProductNames(prodNames);
                        setProducts(prods);
                        setReady(true);
                    }
                });
            }
        })
    },[]);

    useEffect(() => {
        if(selectedProduct.id !== undefined) setOpen(true);
        if(selectedProduct.name !== undefined){
            let prodItems = [];
            getImagesFromReferencesAsync(selectedProduct.imageReferences,bytes => {
                selectedProduct.imageBytes = bytes.map(b => b.image);
                getItemsAsync(selectedProduct.name,pItems => {
                    prodItems.push({[selectedProduct.name]:pItems});
                    setItems(prodItems);
                });
            })
        }
    },[selectedProduct]);

    const PurchaseItemCallback = useCallback(() => <PurchaseItem product={selectedProduct} />,[selectedProduct]);

    return <Box
            sx={{padding: "10vh"}}
        >
            <Grid2
                container
                size={12}
                sx={{width: "80vw", margin: "auto"}}
            >
                <Grid2 size={12}
                    sx={{display:"flex"}}
                >
                    <Autocomplete
                        sx={{width: "100%"}}
                        options={productNames}
                        onChange={c => {
                            let product = products.find(p => p.name === c.target.innerHTML);
                            if(product) setSelectedProduct(product);
                            else setSelectedProduct("");
                        }}
                        renderInput={(params) => <TextField {...params} label="Product Search" />}
                    />
                    <SearchIcon 
                        sx={{width:"auto", height: "2.25em",border: "solid",borderWidth: "1px"}}
                    />
                </Grid2>
                <Grid2>
                    {
                        selectedProduct.id && 
                        <PurchaseItemCallback />
                    }
                </Grid2>
            </Grid2>
        </Box>
}

export default Store;