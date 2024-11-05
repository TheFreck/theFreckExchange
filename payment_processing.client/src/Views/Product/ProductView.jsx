import react, { useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios';
import NewProduct from "./NewProduct";
import BathtubIcon from '@mui/icons-material/Bathtub';

import { Box, Button, FormControl, Grid2, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Label } from "@mui/icons-material";
import { ProductContext } from "../../Context";

export const ProductView = ({ product, attributes }) => {
    const {createItemsAsync} = useContext(ProductContext);
    const [quantity, setQuantity] = useState(0);
    const [item,setItem] = useState(product);

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
                        <BathtubIcon sx={{ width: "200%", height: "auto" }} />
                    </Grid2>
                    <Grid2 size={12}>
                        {
                            attributes.length > 0 &&
                            <Grid2
                                size={12}
                                sx={{ display: "flex", flexDirection: "column" }}
                            >
                                {
                                    attributes.map((items, i) => (
                                        <FormControl key={i} fullWidth>
                                            <InputLabel
                                                id={`${items.type}-label`}
                                            >{items.type}</InputLabel>
                                            <Select
                                                labelId={`${items.type}-label`}
                                                onChange={x => {
                                                    items.choice = x.target.value;
                                                    console.log("item: ", item);
                                                }}
                                            >
                                                {items.value.map((b,j) => (
                                                <MenuItem key={j} name={items.type} value={b} >{b}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
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

                                <Button onClick={() => createItemsAsync({item,quantity,attributes})} variant="contained">Create</Button>
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
        </Box>
    )
}

export default ProductView;