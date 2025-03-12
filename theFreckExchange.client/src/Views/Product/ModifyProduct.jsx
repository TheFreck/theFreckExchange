import { Box, Button, Card, Chip, FormControl, Grid2, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { updateItemsAsync,getImagesFromProductAsync, getProductsAsync } from "../../helpers/helpers";

export const ModifyProduct = () => {
    const [productsArray, setProductsArray] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [imageObjects, setImageObjects] = useState([]);
    const [name,setName] = useState("");
    const [price, setPrice] = useState(0.0);
    const [description, setDescription] = useState("");
    const [attributes,setAttributes] = useState([]);
    const [attributeInput, setAttributeInput] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    const [ready,setReady] = useState(false);

    useEffect(() => {
        getProductsAsync(prods => {
            if (prods.length === 0) return;
            setProductsArray(prods);
            setReady(true);
        });
    }, []);

    const selectProduct = (p) => {
        let prod = productsArray.find(a => a.name === p.target.value);
        getImagesFromProductAsync(prod.productId,images => {
            setSelectedProduct(prod);
            setImageObjects(images.map(i => ({id:i.id,imageId: i.imageId,name: i.name,image: window.atob(i.image)})));
            setName(prod.name);
            setPrice(prod.price);
            setDescription(prod.productDescription);
            setAttributes(prod.availableAttributes);
        });
    }

    const removeImage = image => {
        image.delete = undefined ? true : !image.delete;
        setIsDirty(!isDirty);
    }

    const updateAsync = () => {
        let keepers = imageObjects.filter(o => !o.delete);
        selectedProduct.imageReferences = keepers.map(k => k.imageId);
        selectedProduct.description = description;
        selectedProduct.attributes = attributes;
        selectedProduct.availableAttributes = attributes;
        selectedProduct.price = price;
        selectedProduct.credentials = {
            username: localStorage.getItem("username"),
            loginToken: localStorage.getItem("loginToken"),
            adminToken: localStorage.getItem("permissions.admin"),
            userToken: localStorage.getItem("permissions.user")
        }
        updateItemsAsync(selectedProduct, prod => {
        });
    }

    const ImageCardCallback = useCallback(({ image, i }) => (<Card>
        {image.delete &&
            <DisabledByDefaultIcon
                onClick={() => {
                    if (image.delete !== undefined)
                        image.delete = !image.delete
                    setIsDirty(!isDirty);
                }}
                sx={{ color: "red", position: "absolute", top: 0, right: "1em", width: "5vw", height: "5vh" }}
            />
        }
        {image.delete !== undefined && !image.delete &&
            <CheckBoxIcon
                onClick={() => {
                    if (image.delete !== undefined)
                        image.delete = !image.delete
                    setIsDirty(!isDirty);
                }}
                sx={{ color: "green", position: "absolute", top: 0, right: "1em", width: "5vw", height: "5vh" }}
            />
        }
        <img style={{ backgroundSize: "contain", maxHeight: "20em", maxWidth: "100%" }} src={window.atob(image.bytes)} onClick={() => removeImage(image)} height={"auto"} key={i} />
    </Card>), [isDirty, selectedProduct]);

    return (
        <Box
            component="form"
            sx={{ 
                display: "flex", 
                flexDirection: "column", 
                margin: "0 auto", 
                padding: "0 5vw",
                width: "90vw",
                height: "80vh"
            }}
        >
            <Grid2 container >
                <Typography
                    variant="h4"
                >
                    Modify Product
                    <hr/>
                </Typography>
                {ready &&
                    <FormControl fullWidth>
                        <InputLabel id="productLabel">Product Name</InputLabel>
                        <Select
                            id="productSelector"
                            labelId="productLabel"
                            label="Product Name"
                            value={name}
                            onChange={selectProduct}
                            sx={{ 
                                fontSize: "2em", 
                                height: "2em", 
                                margin: 0, 
                                padding: "0 2em", 
                                display: "flex", 
                                textAlign: "left",
                            }}
                        >
                            <MenuItem
                                name="Select a product"
                                value=""
                                disabled
                            >
                                Select a product
                            </MenuItem>
                            {
                                ready && productsArray.map((p,i) => (
                                    <MenuItem
                                        key={i}
                                        value={p.name}
                                    >
                                        {p.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                }
                <Grid2 size={12}>
                    <Stack direction="row" spacing={1}
                        label="Attributes"
                        sx={{ border: "solid", borderWidth: "1px", borderColor: "lightgray", margin: ".5vh 0", padding: ".5em" }}
                    >
                        {attributes && attributes.map((a, i) => (
                            <Chip onClick={() => setAttributes([...attributes.filter(at => at !== a)])} label={a} key={i} />
                        ))}
                    </Stack>
                    <TextField
                        sx={{
                            width: "100%"
                        }}
                        label="Product Attributes"
                        onChange={p => {
                            setAttributeInput(p.target.value);
                        }}
                        value={attributeInput}
                        onKeyDown={k => {
                            if (k.code === "NumpadEnter" || k.code === "Enter") {
                                setAttributes([...attributes, attributeInput])
                                setAttributeInput("");
                            }
                        }}
                        onBlur={() => {
                            setAttributes([...attributes, attributeInput])
                            setAttributeInput("");
                        }}
                    />
                </Grid2>
                <hr/>
                <Grid2 size={12}>
                    <TextField
                        sx={{width: "100%",fieldSet: {marginBottom: "-1vh"}}}
                        multiline
                        value={description}
                        label="Product Description"
                        onChange={p => setDescription(p.target.value)}
                    />
                </Grid2>
                <hr/>
                <Grid2 size={12}>
                    <TextField
                        sx={{width: "50%"}}
                        required
                        id="productPrice"
                        label="Price"
                        value={price}
                        onChange={p => setPrice(p.target.value)}
                    />
                    <Button
                        variant="contained"
                        sx={{height: "100%",width: "50%"}}
                        onClick={updateAsync}
                    >
                        Update Product
                    </Button>
                </Grid2>
            </Grid2>
        </Box >
    )
}

export default ModifyProduct;