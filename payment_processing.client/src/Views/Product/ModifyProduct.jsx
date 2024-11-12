import { Box, Button, Card, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import react, { useCallback, useContext, useEffect, useState } from "react";
import { ProductContext } from "../../Context";
import Carousel from "react-material-ui-carousel";
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export const ModifyProduct = ({products}) => {
    const { getAvailableAttributesAsync,updateItemsAsync } = useContext(ProductContext);
    const [productsArray, setProductsArray] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [ready, setReady] = useState(false);
    const [imageObjects, setImageObjects] = useState([]);
    const [productPrice, setProductPrice] = useState(0.0);
    const [productDescription, setProductDescription] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if(products.size === 0) return;
        var prods = [];
        for(var prod of products.values()){
            prods.push(prod);
        }
        setProductsArray(prods);
    }, []);

    const selectProduct = (p) => {
        setSelectedProduct(p.target.value);
        setImageObjects(p.target.value.imageBytes);
        setProductPrice(p.target.value.price);
        setProductDescription(p.target.value.productDescription);
        getAvailableAttributesAsync(p.target.value.name, att => {
            setReady(!ready);
        });
    }

    const removeImage = image => {
        image.delete = undefined ? true : !image.delete;
        setIsDirty(!isDirty);
    }

    const updateAsync = () => {
        let keepers = imageObjects.filter(o => !o.delete);
        selectedProduct.imageBytes = keepers.map(k => k.bytes);
        selectedProduct.description = productDescription;
        selectedProduct.attributes = selectedProduct.availableAttributes;
        selectedProduct.price = productPrice;
        selectedProduct.credentials = {
            username: localStorage.getItem("username"),
            loginToken: localStorage.getItem("loginToken"),
            adminToken: localStorage.getItem("permissions.admin"),
            userToken: localStorage.getItem("permissions.user")
        }
        updateItemsAsync(selectedProduct,prod => {
            console.log("prod back from update: ", prod);
        });
    }

    const ImageCardCallback = useCallback(({image,i}) => (<Card>
        {image.delete && 
            <DisabledByDefaultIcon 
                onClick={() => {
                    if(image.delete !== undefined)
                        image.delete = !image.delete
                    setIsDirty(!isDirty);
                }}
                sx={{color: "red", position: "absolute", top: 0, right: "1em",width: "5vw", height: "5vh"}}  
            />
        }
        {image.delete !== undefined && !image.delete &&
            <CheckBoxIcon
            onClick={() => {
                if(image.delete !== undefined)
                    image.delete = !image.delete
                setIsDirty(!isDirty);
            }}
                sx={{color: "green", position: "absolute", top: 0, right: "1em", width: "5vw", height: "5vh"}}
            />
        }
        <img style={{ backgroundSize: "contain", maxHeight: "20em", maxWidth: "100%" }} src={window.atob(image.bytes)} onClick={() => removeImage(image)} height={"auto"} key={i} />
    </Card>),[isDirty]);

    return (
        <Box
            sx={{ width: "60vw", height: "auto" }}
            component="form"
        >
            <Grid2 size={12}
                container
                spacing={1}
            >
                {productsArray.length > 0 && 
                    <FormControl fullWidth>
                        <InputLabel id="productLabel">Product</InputLabel>
                        <Select
                            id="productSelector"
                            labelId="productLabel"
                            label="Product"
                            name="Product"
                            value={selectedProduct}
                            onChange={selectProduct}
                        >
                            <MenuItem
                                name="Select a product"
                                value="Select a product"
                                disabled
                            >
                                Select a product
                            </MenuItem>
                            {productsArray.map((p, i) => (
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
                                    imageObjects?.map((image, i) => (
                                        <ImageCardCallback image={image} key={i} i={i} />
                                    ))
                                }
                            </Carousel>
                        }
                    </Grid2>
                    <Grid2 size={12}>
                        {/* {
                            selectedProduct && attributes.length > 0 &&
                            <Grid2
                                size={12}
                                sx={{ display: "flex", flexDirection: "column" }}
                            >
                                {
                                    attributes.map((type, i) => (
                                        <TextField
                                            key={i}
                                            label={type}
                                            value={attributes[i]?.value}
                                            onChange={(a) => {
                                                selectedProduct.attributes[i].value = a.target.value;
                                                attributeObjects[i].value = a.target.value;
                                                setAttributeObjects([...attributeObjects.filter(a => a.key !== type), attributeObjects[i]])
                                            }}
                                        />
                                    ))
                                }
                            </Grid2>
                        } */}
                    </Grid2>
                    <Grid2
                        size={12}
                        sx={{ display: "flex", flexDirection: "row" }}
                    >
                        <Grid2 size={12}>
                            <Button onClick={updateAsync} variant="contained">Update</Button>
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Grid2 size={8}
                    container
                    spacing={1}
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <Grid2 size={12}
                        sx={{display: "flex"}}
                    >
                        <Typography
                            sx={{ marginLeft: ".4em", fontSize: "2em"}}
                        >
                            {selectedProduct.name}
                        </Typography>
                    </Grid2>
                    <Grid2 size={12}
                        sx={{display: "flex"}}
                    >
                        <TextField
                            label="Price"
                            value={productPrice}
                            InputLabelProps={{shrink:true}}
                            sx={{width: "100%"}}
                            onChange={p => setProductPrice(p.target.value)}
                        />
                        
                    </Grid2>
                    <Grid2 size={12}
                        sx={{display: "flex"}}
                    >
                        <TextField
                            label="Description: "
                            value={productDescription}
                            InputLabelProps={{shrink:true}}
                            multiline
                            sx={{width: "100%"}}
                            onChange={d => setProductDescription(d.target.value)}
                        />
                    </Grid2>
                </Grid2>
            </Grid2>
        </Box >
    )
}

export default ModifyProduct;