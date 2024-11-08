import react, { useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios';
import NewProduct from "./NewProduct";
import BathtubIcon from '@mui/icons-material/Bathtub';

import { Box, Button, FormControl, Grid2, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ProductContext } from "../../Context";
import Carousel from "react-material-ui-carousel";

export const ProductView = ({ product, attributes }) => {
    const { createItemsAsync } = useContext(ProductContext);
    const [quantity, setQuantity] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState();
    const [attributeObjects, setAttributeObjects] = useState([]);
    const [imageObjects, setImageObjects] = useState([]);

    useEffect(() => {
        product.attributes = [];
        for (var attribute of attributes) {
            product.attributes.push({ type: attribute, value: "" });
        }
        setSelectedProduct(product);
        setAttributeObjects(product.attributes);
        setImageObjects(product.imageBytes);
    }, []);

    return (
        <Box
            sx={{ width: "60vw", height: "auto" }}
        >
            <Grid2 size={12}
                container
            >
                <Grid2 size={4}
                    container
                    spacing={1}
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <Grid2 size={12}>
                        {selectedProduct?.imageBytes !== undefined &&
                            <Carousel
                                sx={{minHeight: "20em",maxHeight: "20em", height: "20em"}}
                                cycleNavigation="false"
                                autoPlay="false"
                                interval="100000000"
                                indicatorContainerProps={{
                                    style: {
                                        position: "absolute",
                                        bottom: "1em"
                                    }
                                }}
                            >
                                {
                                    imageObjects.map((image, i) => (
                                        <img style={{ width: "100%" }} src={window.atob(image)} height={"auto"} key={i} />
                                    ))
                                }
                            </Carousel>
                        }
                    </Grid2>
                    <Grid2 size={12}>
                        {
                            selectedProduct && attributes.length > 0 &&
                            <Grid2
                                size={12}
                                sx={{ display: "flex", flexDirection: "column" }}
                            >
                                {
                                    attributes.map((type, i) => (
                                        <TextField
                                            label={type}
                                            value={selectedProduct.attributes[i].value}
                                            onChange={(a) => {
                                                selectedProduct.attributes[i].value = a.target.value;
                                                attributeObjects[i].value = a.target.value;
                                                setAttributeObjects([...attributeObjects.filter(a => a.key !== type), attributeObjects[i]])
                                            }}
                                        />
                                    ))
                                }
                            </Grid2>
                        }
                    </Grid2>
                    <Grid2
                        size={12}
                        sx={{ display: "flex", flexDirection: "row" }}
                    >
                        <Grid2
                            size={5}
                        >
                            <TextField
                                label="Quantity"
                                type="number"
                                onChange={q => setQuantity(q.target.value)}
                            />
                        </Grid2>
                        <Grid2 size={7}>
                            {

                                <Button onClick={() => createItemsAsync({ item: selectedProduct, quantity, image })} variant="contained">Create</Button>
                            }
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Grid2 size={8}
                    container
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <Grid2 size={12}>
                        <br />
                        <Typography
                            sx={{ width: "100%", fontSize: "3rem", textAlign: "left", paddingLeft: "1vw" }}
                        >{product.name}</Typography>
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography
                            sx={{ width: "100%", textAlign: "left", paddingLeft: "1em", fontSize: "1.5rem", display: "flex", flexDirection: "row" }}
                        ><InputAdornment variant="standard" position="start">$</InputAdornment>{product.price}</Typography>
                    </Grid2>
                    <Grid2 size={12}>
                        <Typography
                            sx={{ width: "100%", textAlign: "left", paddingLeft: "1em", fontSize: "1rem" }}
                        ><InputAdornment variant="standard" position="start">Description:</InputAdornment>{product.productDescription}</Typography>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box >
    )
}

export default ProductView;