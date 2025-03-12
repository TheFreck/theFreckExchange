import react, { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Autocomplete, Box, Grid2, Modal, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PurchaseItem from "../Item/PurchaseItem";
import {getProductsAsync,getImagesFromReferencesAsync,getItemsAsync,getAttributesAsync} from "../../helpers/helpers";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "../../Context";

export const Store = ({ }) => {
    const {selectedProductName,setSelectedProductName,isMobile} = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [items,setItems] = useState([]);
    const [ready,setReady] = useState(false);
    const [open,setOpen] = useState(false);
    const modalRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();

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
        if(selectedProductName.id !== undefined) setOpen(true);
        if(selectedProductName.name !== undefined){
            let prodItems = [];
            getImagesFromReferencesAsync(selectedProductName.imageReferences,bytes => {
                selectedProductName.imageBytes = bytes.map(b => b.image);
                getItemsAsync(selectedProductName.name,pItems => {
                    prodItems.push({[selectedProductName.name]:pItems});
                    setItems(prodItems);
                });
            })
        }
    },[selectedProductName]);

    const PurchaseItemCallback = useCallback(() => <PurchaseItem product={selectedProductName} setProductOpen={() => {}} />,[selectedProductName,ready]);

    return <Box
            sx={{
                padding: 0,
                minHeight: 0,
                maxHeight: "80vh",
                width: `${isMobile ? "98vw" : "80vw"}`,
                margin: `${isMobile ? "10vh auto" : "10vh 10vw"}`,
            }}
        >
            <Grid2
                container
                size={12}
                sx={{
                    width: `${isMobile ? "100vw" : "80vw"}`, 
                    margin: "auto"
                }}
            >
                <Grid2 size={12}
                    sx={{display:"flex"}}
                >
                    <Autocomplete
                        sx={{width: "100%"}}
                        options={productNames}
                        onChange={c => {
                            let product = products.find(p => p.name === c.target.innerHTML);
                            if(product) {
                                if(location.pathname !== "/User/Shopping") {
                                    navigate("/User/Shopping");
                                }
                                setSelectedProductName(product);
                            }
                            else setSelectedProductName("");
                        }}
                        renderInput={(params) => <TextField {...params} label="Product Search" />}
                    />
                    <SearchIcon 
                        sx={{width:"auto", height: "2.25em",border: "solid",borderWidth: "1px"}}
                    />
                </Grid2>
                {
                    selectedProductName && 
                    <Grid2>
                        <PurchaseItemCallback />
                    </Grid2>
                }
            </Grid2>
        </Box>
}

export default Store;