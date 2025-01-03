import { Box, Button, Card, Chip, FormControl, Grid2, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ImageCarousel } from "../../components/ImageCarousel";
import { updateItemsAsync,getImagesFromReferencesAsync, getProductsAsync } from "../../helpers/helpersWelcome";

export const ModifyProduct = () => {
    const [productsArray, setProductsArray] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [imageObjects, setImageObjects] = useState([]);
    const [name,setName] = useState("");
    const [price, setPrice] = useState(0.0);
    const [description, setDescription] = useState("");
    const [attributes,setAttributes] = useState([]);
    const [attributeInput, setAttributeInput] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        getProductsAsync(prods => {
            console.log("prods: ", prods);
            if (prods.length === 0) return;
            setProductsArray(prods);
            console.log("up and atom!");
        });
    }, []);

    const selectProduct = (p) => {
        getImagesFromReferencesAsync(p.target.value.imageReferences,images => {
            setSelectedProduct(p.target.value);
            setImageObjects(images.map(i => ({id:i.id,imageId: i.imageId,name: i.name,image: window.atob(i.image)})));
            setName(p.target.value.name);
            setPrice(p.target.value.price);
            setDescription(p.target.value.productDescription);
            setAttributes(p.target.value.availableAttributes);
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
            console.log("prod back from update: ", prod);
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
            sx={{
                margin: "0 auto",
                width: "80vw",
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh",
                background: "rgb(204,187,170)"
            }}
            component="form"
        >
            <Grid2
                sx={{ width: "100%" }}
            >
                {productsArray.length > 0 &&
                    <FormControl fullWidth>
                        <InputLabel id="productLabel">Product</InputLabel>
                        <Select
                            id="productSelector"
                            labelId="productLabel"
                            label="Product"
                            value={selectedProduct}
                            onChange={selectProduct}
                            sx={{ fontSize: "2em", height: "2em", margin: 0, padding: "0 2em", display: "flex", textAlign: "left" }}
                        >
                            <MenuItem
                                name="Select a product"
                                value=""
                                disabled
                            >
                                Select a product
                            </MenuItem>
                            {productsArray.length > 0 && productsArray.map((p, i) => (
                                <MenuItem
                                    name={p.name}
                                    key={i}
                                    value={p}
                                >
                                    {p.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }
            </Grid2>
            {selectedProduct &&
                <Grid2>
                    <Grid2>
                        <ImageCarousel
                            imageObjects={imageObjects}
                            height="40vh"
                            width="80vw"
                        />
                    </Grid2>
                    <Grid2
                        container
                        spacing={1}
                        sx={{padding: "1vh 1vw 1vh 1vw"}}
                    >
                        <Grid2
                            size={4}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <TextField
                                required
                                id="productName"
                                label="Product Name"
                                onChange={n => setName(n.target.value)}
                                value={name}
                            />
                            <Stack direction="row" spacing={1}
                                label="Attributes"
                                sx={{ border: "solid", borderWidth: "1px", borderColor: "lightgray", margin: ".5vh 0", padding: ".5em" }}
                            >
                                {attributes && attributes.map((a, i) => (
                                    <Chip onClick={() => setAttributes([...attributes.filter(at => at !== a)])} label={a} key={i} />
                                ))}
                            </Stack>
                            <TextField
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
                            <Grid2>
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
                                >Update Product</Button>
                            </Grid2>
                        </Grid2>
                        <Grid2
                            size={8}
                        >
                            <TextField
                                sx={{width: "100%",fieldSet: {marginBottom: "-1vh"}}}
                                multiline
                                value={description}
                                label="Product Description"
                                onChange={p => setDescription(p.target.value)}
                            />
                        </Grid2>
                    </Grid2>
                </Grid2>
            }
        </Box >
    )
}

export default ModifyProduct;