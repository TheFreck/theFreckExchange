import react, { useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios';
import BathtubIcon from '@mui/icons-material/Bathtub';

import { Box, Button, FormControl, Grid2, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ProductContext } from "../../Context";
import Carousel from "react-material-ui-carousel";

export const ProductView = ({ product, view }) => {
    const { createItemsAsync, purchaseItemAsync } = useContext(ProductContext);
    const [quantity, setQuantity] = useState(0);
    const [imageObjects, setImageObjects] = useState([]);
    const [ready, setReady] = useState(false);
    const [attributes, setAttributes] = useState([]);

    useEffect(() => {
        setImageObjects(product.imageBytes);
        if (product?.attributes?.length > 0)
            setAttributes(product.attributes);
        setReady(true);
    }, []);

    return (
        <Box
            sx={{ width: "60vw", height: "auto" }}
        >
            {ready &&
                <Grid2 size={12}
                    container
                >
                    <Grid2 size={4}
                        container
                        spacing={1}
                        sx={{ display: "flex", flexDirection: "column" }}
                    >
                        <Grid2 size={12}>
                            {product?.imageBytes !== undefined &&
                                <Carousel
                                    sx={{ minHeight: "20em", maxHeight: "20em", height: "20em" }}
                                    autoPlay={false}
                                    indicatorContainerProps={{
                                        style: {
                                            position: "absolute",
                                            bottom: "1em"
                                        }
                                    }}
                                >
                                    {
                                        imageObjects.map((image, i) => (
                                            <img style={{ backgroundSize: "contain", maxHeight: "20em", maxWidth: "100%" }} src={window.atob(image.bytes)} height={"auto"} key={i} />
                                        ))
                                    }
                                </Carousel>
                            }
                        </Grid2>
                        <Grid2 size={12}>
                            {
                                product && product?.attributes?.length > 0 &&
                                <Grid2
                                    size={12}
                                    sx={{ display: "flex", flexDirection: "column" }}
                                >
                                    {
                                        view === "admin" && product?.attributes?.map((type, i) => (
                                            <TextField
                                                key={i}
                                                label={type.type}
                                                value={product.attributes[i].value}
                                                onChange={(s) => {
                                                    product.attributes[i].value = s.target.value;
                                                    setAttributes([...attributes.filter(a => a.key !== type.type), { type: type.type, value: s.target.value, product: product.name }]);
                                                }}
                                            />
                                        ))
                                    }
                                    {
                                        view === "user" &&
                                        product.attributes.map((type, i) => (
                                            <Grid2 size={12} key={i}
                                                sx={{ width: "100%" }}
                                            >
                                                <FormControl
                                                    sx={{ width: "100%" }}
                                                    defaultValue=""
                                                >
                                                    <InputLabel
                                                    >
                                                        {type.type}
                                                    </InputLabel>
                                                    <Select
                                                        sx={{ width: "100%" }}
                                                        labelId={`${type.type}-label`}
                                                        label={type.type}
                                                        value={type.value}
                                                        onChange={s => {
                                                            product.attributes[i].value = s.target.value;
                                                            setAttributes([...attributes.filter(a => a.key !== type.type), { type: type.type, value: s.target.value, product: product.name }]);
                                                        }}
                                                    >
                                                        <MenuItem
                                                            name="attribute"
                                                            value="attribute"
                                                            disabled
                                                        >Choose the {type.type}</MenuItem>
                                                        {
                                                            type.values.map((v, j) => (
                                                                <MenuItem
                                                                    key={j}
                                                                    name={v}
                                                                    value={v}
                                                                >
                                                                    {v}
                                                                </MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Grid2>
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
                            <Grid2 size={7}
                                sx={{
                                    display: 'flex',
                                    justifyContent: "center"
                                }}
                            >
                                {
                                    view === "admin" && attributes &&
                                    <Button onClick={() => createItemsAsync({ item: product, quantity, attributes })} disabled={quantity == 0 || attributes?.filter(a => a.value === "").length > 0} variant="contained">Create</Button>
                                }
                                {
                                    view === "user" && attributes &&
                                    <Button onClick={() => purchaseItemAsync()} disabled={quantity === 0 || attributes?.filter(a => a.value === "").length > 0} variant="contained" >Purchase</Button>
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
                            >${product.price}</Typography>
                        </Grid2>
                        <Grid2 size={12}>
                            <Typography
                                sx={{ textAlign: "left", paddingLeft: '1em', fontSize: "1.25rem" }}
                            >Description:</Typography>
                            <Typography
                                sx={{ width: "100%", textAlign: "left", paddingLeft: "2em", fontSize: "1rem" }}
                            >{product.productDescription}</Typography>
                        </Grid2>
                    </Grid2>
                </Grid2>
            }
        </Box >
    )
}

export default ProductView;