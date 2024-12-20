import { Box, Button, FormControlLabel, FormGroup, Grid2, Modal, Switch, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context";

export const Categories = () => {
    const {getProductsAsync,getConfigurationAsync} = useContext(ProductContext);
    const [products,setProducts] = useState([]);
    const [config,setConfig] = useState({});

    useEffect(() => {
        getConfigurationAsync(fig => {
            setConfig(fig);
            getProductsAsync(prods => {
                setProducts(prods);
            });
        });
    },[]);

    return <Box >

    </Box>
}

export default Categories;