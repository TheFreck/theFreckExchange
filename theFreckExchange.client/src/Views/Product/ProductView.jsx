import react, { useCallback, useContext, useEffect, useState } from "react";

import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ProductContext } from "../../Context";
import { ImageCarousel } from "../../components/ImageCarousel";

export const ProductView = ({ product, view }) => {
    const { createItemsAsync, purchaseItemAsync, getItemsAsync } = useContext(ProductContext);
    const [quantity, setQuantity] = useState(0);
    const [imageObjects, setImageObjects] = useState([]);
    const [ready, setReady] = useState(false);
    const [attributes, setAttributes] = useState([]);

    // using product get items
    // 

    useEffect(() => {
        console.log("product: ", product);
        setImageObjects(product.imageBytes);
        if (product?.availableAttributes?.length > 0){
            let atts = product.availableAttributes.map(a => ({type: a, value: ""}));
            setAttributes(atts);
        }
        setReady(true);
    }, []);
    
    // const groupItemsByAttribute = (items) => {
    //     console.log("items: ", items);
    //     let types = {};
    //     items.forEach(element => {
    //         element.attributes.forEach(attribute => {
    //             if(!Object.keys(types).includes(attribute.type))
    //                 types[attribute.type] = {[attribute.value]: []};
    //             console.log("types[attribute.type]: ", types[attribute.type][attribute.value]);
    //             console.log("types: ", types);
    //             console.log("element: ", element);
    //             types[attribute.type][attribute.value].push(element);
    //         })
    //     });
    //     console.log("types: ", types);
    //     setAttributes(types);
    // }

    return (
        <Box
            sx={{ width: "60vw", height: "auto", border: "solid" }}
        >
            {ready &&
                <Grid2 size={12}
                    container
                    sx={{border: "solid"}}
                >
                    <Grid2 size={4}
                        container
                        spacing={1}
                        sx={{ display: "flex", flexDirection: "column", border: "solid" }}
                    >
                        <Grid2 size={12}
                            sx={{border: "solid"}}
                        >
                            {product?.imageBytes !== undefined &&
                                <ImageCarousel
                                    minHeight="20em"
                                    maxHeight="20em"
                                    height="20em"
                                    minWidth="auto"
                                    maxWidth="auto"
                                    width="auto"
                                    imageObjects={imageObjects}
                                />
                            }
                        </Grid2>
                        <Grid2 size={12}
                            sx={{border: "solid"}}>
                            {
                                product && product?.availableAttributes?.length > 0 && attributes.length > 0 &&
                                <Grid2
                                    size={12}
                                    sx={{ display: "flex", flexDirection: "column", border: "solid" }}
                                >
                                    {
                                        // view === "admin" && attributes.map((type, i) => (
                                        //     <TextField
                                        //         key={i}
                                        //         label={type.type}
                                        //         value={attributes.find(a => a.type === type.type).value}
                                        //         onChange={(s) => {
                                        //             console.log("s: ", s);
                                        //             let att = attributes.find(a => a.type === type.type);
                                        //             att.value = s.target.value;
                                        //             console.log("textfield att: ", att);
                                        //             setAttributes([...attributes.filter(a => a.type !== type.type), { type: type.type, value: att.value }]);
                                        //         }}
                                        //     />
                                        // ))
                                    }
                                    {
                                        view === "user" &&
                                        attributes.map((type, i) => (
                                            <Grid2 size={12} key={i}
                                                sx={{ width: "100%", border: "solid" }}
                                            >
                                                {console.log("attribute type: ", type)}
                                                {/* <FormControl
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
                                                        >
                                                            Choose a {type.type}
                                                        </MenuItem>
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
                                                </FormControl> */}
                                            </Grid2>
                                        ))
                                    }
                                </Grid2>
                            }
                        </Grid2>
                        <Grid2
                            size={12}
                            sx={{ display: "flex", flexDirection: "row", border: "solid" }}
                        >
                            <Grid2
                                size={5}
                            >
                                {/* <TextField
                                    label="Quantity"
                                    type="number"
                                    onChange={q => setQuantity(q.target.value)}
                                /> */}
                            </Grid2>
                            <Grid2 size={7}
                                sx={{
                                    display: 'flex',
                                    justifyContent: "center",
                                    border: "solid"
                                }}
                            >
                                {/* {
                                    view === "admin" && attributes &&
                                    <Button onClick={() => createItemsAsync({ item: product, quantity, attributes })} disabled={quantity == 0 || attributes?.filter(a => a.value === "").length > 0} variant="contained">Create</Button>
                                }
                                {
                                    view === "user" && attributes &&
                                    <Button onClick={() => purchaseItemAsync(product,quantity)} disabled={quantity === 0 || attributes?.filter(a => a.value === "").length > 0} variant="contained" >Purchase</Button>
                                } */}
                            </Grid2>
                        </Grid2>
                    </Grid2>
                    <Grid2 size={8}
                        container
                        sx={{ display: "flex", flexDirection: "column", border: "solid" }}
                    >
                        <Grid2 size={12}
                            sx={{border: "solid"}}>
                            {/* <br />
                            <Typography
                                sx={{ width: "100%", fontSize: "3rem", textAlign: "left", paddingLeft: "1vw", border: "solid" }}
                            >
                                {product.name}
                            </Typography> */}
                        </Grid2>
                        <Grid2 size={12}
                            sx={{border: "solid"}}>
                            {/* <Typography
                                sx={{ width: "100%", textAlign: "left", paddingLeft: "1em", fontSize: "1.5rem", display: "flex", flexDirection: "row" }}
                            >
                                ${product.price}
                            </Typography> */}
                        </Grid2>
                        <Grid2 size={12}
                            sx={{border: "solid"}}>
                            {/* <Typography
                                sx={{ textAlign: "left", paddingLeft: '1em', fontSize: "1.25rem" }}
                            >
                                Description:
                            </Typography>
                            <Typography
                                sx={{ width: "100%", textAlign: "left", paddingLeft: "2em", fontSize: "1rem" }}
                            >
                                {product.productDescription}
                            </Typography> */}
                        </Grid2>
                    </Grid2>
                </Grid2>
            }
        </Box >
    )
}

export default ProductView;