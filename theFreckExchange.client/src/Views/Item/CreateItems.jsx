import { useCallback, useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Grid2, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { ImageCarousel } from "../../components/ImageCarousel";
import { getProductsAsync, getAvailableAttributesAsync, getImagesFromProductAsync, createItemsAsync } from "../../helpers/helpers";
import { AuthContext } from "../../Context";

export const CreateItems = ({ }) => {
    const { isMobile } = useContext(AuthContext);
    const [productsArray, setProductsArray] = useState([]);
    const [product, setProduct] = useState("");
    const [productImages, setProductImages] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [orderedAttributes, setOrderedAttributes] = useState([]);
    const [lastAttribute, setLastAttribute] = useState(0);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        getProductsAsync(products => {
            if (products.size === 0) return;
            var prods = [];
            for (var prod of products) {
                prods.push(prod);
            }
            setProductsArray(prods);
        })
    }, []);

    const selectProduct = (p) => {
        getAvailableAttributesAsync(p.target.value.name, attributes => {
            getImagesFromProductAsync(p.target.value.productId, imgs => {
                imgs.forEach(image => {
                    image.image = window.atob(image.image);
                })
                setProductImages(imgs);
            });
            let attArray = [];
            let orderCount = 0;
            for (let attribute of attributes) {
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
        attributes.sort((a, b) => a.order - b.order);
        setOrderedAttributes(attributes);
    }, [attributes]);

    const Desktop = () => <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            height: "80vh",
            margin: "0 10vw",
            width: "80vw",
        }}
    >
        <Typography
            variant="h4"
        >
            New Item
            <hr />
        </Typography>
        {
            productsArray.length > 0 &&
            <FormControl fullWidth>
                <InputLabel id="productLabel">Product</InputLabel>
                <Select
                    id="productSelector"
                    labelId="productLabel"
                    label="Product"
                    value={product}
                    onChange={selectProduct}
                    sx={{
                        fontSize: "2em",
                        height: "2em",
                        margin: 0,
                        padding: "0 2em",
                        display: "flex",
                        textAlign: "left"
                    }}
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
        <Grid2 spacing={1} container
            size={12}
            sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh",
            }}
        >
            {
                product &&
                <Grid2
                    size={12}
                    sx={{
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <Box
                        sx={{ height: "auto" }}
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
                                    sx={{ width: "100%" }}
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
                                sx={{ display: "flex", flexDirection: "row" }}
                                size={12}
                                container
                                spacing={1}
                            >
                                <Grid2
                                    size={4}
                                    sx={{ display: "flex", flexDirection: "column", paddingLeft: ".5em", paddingTop: "1em" }}
                                    container
                                >
                                    {/* attributes */}
                                    {orderedAttributes && orderedAttributes.length &&
                                        orderedAttributes.map((attribute, key) => (
                                            <TextField
                                                key={key}
                                                label={`${attribute.type}`}
                                                type="text"
                                                autoFocus={lastAttribute === attribute.order}
                                                onChange={v => {
                                                    attribute.value = v.target.value;
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
                                        sx={{ display: "flex" }}
                                    >
                                        <TextField
                                            sx={{ width: "100%" }}
                                            label="Quantity"
                                            type="number"
                                            autoFocus={lastAttribute === -1}
                                            onChange={q => {
                                                setQuantity(parseInt(q.target.value));
                                                setLastAttribute(-1);
                                            }}
                                            value={quantity}
                                        />
                                        <Button
                                            onClick={() => createItemsAsync({ item: product, quantity, attributes })}
                                            variant="contained"
                                        >
                                            Create
                                        </Button>
                                    </Grid2>
                                </Grid2>
                                <Grid2
                                    size={8}
                                    sx={{ padding: "1vh 1vw", textAlign: "justify", height: "100%" }}
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

                </Grid2>
            }
        </Grid2>
    </Box>;

    const Mobile = () => <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            height: "80vh",
            margin: "0 1vw",
            width: "97vw",
        }}
    >
        <Grid2
            container
            spacing={1}
        >
            <Typography
                variant="h4"
            >
                New Item
                <hr />
            </Typography>
            {
                productsArray.length > 0 &&
                <FormControl fullWidth>
                    <InputLabel id="productLabel">Product</InputLabel>
                    <Select
                        id="productSelector"
                        labelId="productLabel"
                        label="Product"
                        value={product}
                        onChange={selectProduct}
                        sx={{
                            fontSize: "2em",
                            height: "2em",
                            margin: 0,
                            padding: "0 2em",
                            display: "flex",
                            textAlign: "left"
                        }}
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
            {
                productImages.length &&
                <ImageCarousel
                    imageObjects={productImages}
                    minHeight="20vh"
                    maxHeight="30vh"
                    minWidth="100%"
                    maxWidth="100vw"
                    width="100%"
                    isAutoPlay={true}
                    isGrouped={true}
                />
            }
            {
                orderedAttributes && 
                orderedAttributes.length &&
                orderedAttributes.map((attribute, key) => (
                    <TextField
                        sx={{
                            width: "98vw"
                        }}
                        key={key}
                        label={`${attribute.type}`}
                        type="text"
                        autoFocus={lastAttribute === attribute.order}
                        onChange={v => {
                            attribute.value = v.target.value;
                            setAttributes([...attributes.filter(a => a.order !== attribute.order),
                                attribute
                            ]);
                            setLastAttribute(attribute.order);
                        }}
                        value={attribute.value}
                    />
                ))
            }
            <TextField
                sx={{ width: "100%" }}
                label="Quantity"
                type="number"
                autoFocus={lastAttribute === -1}
                onChange={q => {
                    setQuantity(parseInt(q.target.value));
                    setLastAttribute(-1);
                }}
                value={quantity}
            />
            <TextField
                sx={{
                    width: "98vw",
                    maxHeight: "40vh",
                    overflowY: "auto"
                }}
                label="Description"
                multiline
                value={product.productDescription}
                disabled
            />
            <Button
                sx={{
                    width:"98vw"
                }}
                onClick={() => createItemsAsync({ item: product, quantity, attributes })}
                variant="contained"
            >
                Create
            </Button>
        </Grid2>
    </Box>;

    return <Box>
        {
            isMobile ?
            <Mobile /> :
            <Desktop /> 
        }
    </Box>
}

export default CreateItems;