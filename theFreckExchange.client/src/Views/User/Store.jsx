import react, { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Autocomplete, Box, Grid2, Modal, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ProductView from "../Product/ProductView";
import { ProductContext } from "../../Context";
import Descriptions from "../../components/Descriptions-dep";
import PurchaseItem from "../Item/PurchaseItem";

export const Store = ({ }) => {
    const [products, setProducts] = useState([]);
    const [productNames, setProductNames] = useState([""]);
    const [items,setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [ready,setReady] = useState(false);
    const [open,setOpen] = useState(false);
    const modalRef = useRef();

    const {getProductsAsync,getImagesFromReferencesAsync} = useContext(ProductContext);

    const getBaseURL = (cb) => {
        if(process.env.NODE_ENV === "development"){
            cb("https://localhost:7299/");
        }
        else if(process.env.NODE_ENV === "production"){
            cb("/");
        }
    }

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
        if(selectedProduct.name !== undefined){
            let prodItems = [];
            getImagesFromReferencesAsync(selectedProduct.imageReferences,bytes => {
                selectedProduct.imageBytes = bytes.map(b => b.image);
                getAttributesAsync(selectedProduct.name,atts => {
                    if(atts.length > 0 && atts[0].product === selectedProduct.name){
                        selectedProduct.attributes = atts;
                        getItemsAsync(selectedProduct.name,pItems => {
                            prodItems.push(pItems);
                            setItems(prodItems);
                        });
                    }
                });
            })
        }
    },[selectedProduct]);

    const getItemsAsync = async (item,cb) => {
        getBaseURL(async url => {
            let productApi = axios.create({
                baseURL: url + "Product"
            });
            await productApi.get(`items/${item}`)
            .then(yup => {
                cb({[item]:yup.data});
            })
            .catch(nope => console.error(nope));
        })
    }

    const getAttributesAsync = async (prod, cb) => {
        getBaseURL(async url => {
            let productApi = axios.create({
                baseURL: url + "Product"
            });
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
        })
    }

    useEffect(() => {
        if(selectedProduct.id !== undefined) setOpen(true);
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
                        sx={{width: "100%", background: "#ccbbaa"}}
                        options={productNames}
                        onChange={c => setSelectedProduct(products.find(p => p.name === c.target.innerHTML))}
                        renderInput={(params) => <TextField {...params} label="Product Search" />}
                    />
                    <SearchIcon 
                        sx={{width:"auto", height: "2.25em",border: "solid",borderWidth: "1px", background: "#ccbbaa"}}
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