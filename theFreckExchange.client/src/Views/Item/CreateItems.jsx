import react, { useCallback, useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ImageCarousel } from "../../components/ImageCarousel";
import { getProductsAsync, getAvailableAttributesAsync,getImagesFromReferencesAsync,createItemsAsync } from "../../helpers/helpersWelcome";

export const CreateItems = ({}) => {
    const [productsArray,setProductsArray] = useState([]);
    const [product, setProduct] = useState("");
    const [productImages,setProductImages] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [orderedAttributes,setOrderedAttributes] = useState([]);
    const [lastAttribute,setLastAttribute] = useState(0);
    const [quantity,setQuantity] = useState(0);

    useEffect(() => {
        getProductsAsync(products => {
            if(products.size === 0) return;
            var prods = [];
            for(var prod of products){
                prods.push(prod);
            }
            setProductsArray(prods);
        })
    }, []);

    const selectProduct = (p) => {
        getAvailableAttributesAsync(p.target.value.name, attributes => {
            getImagesFromReferencesAsync(p.target.value.imageReferences,imgs => {
                imgs.forEach(image => {
                    image.image = window.atob(image.image);
                })
                setProductImages(imgs);
            });
            let attArray = [];
            let orderCount = 0;
            for(let attribute of attributes){
                attArray.push({
                    type: attribute,
                    value: "",
                    order: orderCount++
                });
            }
            p.target.value.attributes = attArray;
            setProduct(p.target.value);
            setAttributes(attArray);
        })
    }

    useEffect(() => {
        attributes.sort((a,b) => a.order-b.order);
        setOrderedAttributes(attributes);
    },[attributes]);

    const CreateItemsCallback = () => <Box>
        <Grid2 spacing={1} container
            size={12}
            sx={{
                margin: "0 auto",
                width: "80vw",
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh",
            }}
        >
            <Grid2 
                sx={{width: "100%"}}
            >
                {productsArray.length > 0 && 
                    <FormControl fullWidth>
                        <InputLabel id="productLabel">Product</InputLabel>
                        <Select
                            id="productSelector"
                            labelId="productLabel"
                            label="Product"
                            value={product}
                            onChange={selectProduct}
                            sx={{fontSize: "2em", height: "2em", margin: 0, padding: "0 2em", display: "flex", textAlign: "left"}}
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
            { product && <Grid2
                size={12}
            >
                <Box
                    sx={{ height: "auto"}}
                >
                    <Grid2 
                        container
                        spacing={1}
                        size={12}
                    >
                        <Grid2 
                            size={24}
                        >
                            <Box
                                sx={{width: "100%"}}
                            >
                                {
                                    productImages.length &&
                                    <ImageCarousel
                                        imageObjects={productImages}
                                        minHeight="30vh"
                                        maxHeight="50vh"
                                        height="40vh"
                                        minWidth="100%"
                                        maxWidth="100vw"
                                        width="100%"
                                        isAutoPlay={true}
                                        isGrouped={true}
                                    />
                                }
                            </Box>
                        </Grid2>
                        <Grid2 
                            sx={{display: "flex", flexDirection: "row" }}
                            size={12}
                            container
                            spacing={1}
                        >
                            <Grid2
                                size={4}
                                sx={{ display: "flex", flexDirection: "column", paddingLeft: ".5em", paddingTop: "1em"}}
                                container
                            >
                                {/* attributes */}
                                {orderedAttributes && orderedAttributes.length &&
                                    orderedAttributes.map((attribute,key) => (
                                        <TextField
                                            key={key}
                                            label={`${attribute.type}`}
                                            type="text"
                                            autoFocus={lastAttribute === attribute.order}
                                            onChange={v => {
                                                attribute.value=v.target.value;
                                                setAttributes([...attributes.filter(a => a.order !== attribute.order),
                                                    attribute
                                                ]);
                                                setLastAttribute(attribute.order);
                                            }}
                                            value={attribute.value}
                                        />
                                    )
                                )}
                                <Grid2
                                    sx={{display:"flex"}}
                                >
                                    <TextField
                                        sx={{width:"100%"}}
                                        label="Quantity"
                                        type="number"
                                        autoFocus={lastAttribute === -1}
                                        onChange={q => {
                                            console.log("quantity: ", q.target.value)
                                            setQuantity(parseInt(q.target.value));
                                            setLastAttribute(-1);
                                        }}
                                        value={quantity}
                                    />
                                    <Button
                                        onClick={() => createItemsAsync({item:product,quantity,attributes})}
                                        variant="contained"
                                    >
                                        Create
                                    </Button>
                                </Grid2>
                            </Grid2>
                            <Grid2
                                size={8}
                                sx={{padding: "1vh 1vw", textAlign: "justify",height: "100%"}}
                            >
                                {/* description  */}
                                <Typography
                                >
                                    {product.productDescription}
                                </Typography>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Box>

            </Grid2>}

        </Grid2>
    </Box>;

    return <CreateItemsCallback />
}

export default CreateItems;