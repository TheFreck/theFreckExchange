import react, { useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios';
import NewProduct from "./NewProduct";
import BathtubIcon from '@mui/icons-material/Bathtub';

import { Box, Button, FormControl, Grid2, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ProductContext } from "../../Context";

export const ProductView = ({ product, attributes }) => {
    const { createItemsAsync } = useContext(ProductContext);
    const [quantity, setQuantity] = useState(0);
    const [item, setItem] = useState();
    const [attributeObjects, setAttributeObjects] = useState([]);
    const [image, setImage] = useState({});
    const [hasImage, setHasImage] = useState(false);

    useEffect(() => {
        product.attributes = [];
        for (var attribute of attributes) {
            product.attributes.push({ type: attribute, value: "" });
        }
        setItem(product);
        setAttributeObjects(product.attributes);
    }, []);

    const uploadImage = (e) => {
        console.log("target: ", e.target.files);
        setImage(URL.createObjectURL(e.target.files[0]));
        setHasImage(true);
    }

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
                    <Grid2 size={4}>
                        <>
                            <input type="file" onChange={uploadImage} />
                            {hasImage &&
                                <img src={image} style={{minWidth: "5vw", maxWidth: "20vw", borderRadius: "5px"}}/>
                            }
                            {!hasImage &&
                                <BathtubIcon sx={{ width: "200%", height: "auto" }} />
                            }
                        </>
                    </Grid2>
                    <Grid2 size={12}>
                        {
                            item && attributes.length > 0 &&
                            <Grid2
                                size={12}
                                sx={{ display: "flex", flexDirection: "column" }}
                            >
                                {
                                    attributes.map((type, i) => (
                                        <TextField
                                            label={type}
                                            value={item.attributes[i].value}
                                            onChange={(a) => {
                                                item.attributes[i].value = a.target.value;
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

                                <Button onClick={() => createItemsAsync({ item, quantity, image })} variant="contained">Create</Button>
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