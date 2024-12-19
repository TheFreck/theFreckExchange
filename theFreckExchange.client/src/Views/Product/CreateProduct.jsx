import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import react, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../Context";
import ImageUpload from "../Admin/ImageUpload";
import BathtubIcon from '@mui/icons-material/Bathtub';

export const CreateProduct = ({created}) => {
    const { createProductAsync, getImages } = useContext(ProductContext);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0.0);
    const [description, setDescription] = useState("");
    const [attributeInput, setAttributeInput] = useState("");
    const [attributes, setAttributes] = useState([]);
    const [images, setImages] = useState([]);

    const uploadImages = (im) => {
        setImages(im);
    }

    useEffect(() => {
        console.log("product images: ", images);
    },[images]);

    return (
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", margin: "10vh auto", width: "80vw" }}
        >
            <TextField
                required
                id="productName"
                label="Product Name"
                onChange={n => setName(n.target.value)}
                value={name}
            />
            <TextField
                required
                id="productPrice"
                label="Price"
                onChange={p => setPrice(p.target.value)}
            />
            <TextField
                required
                id="productDescription"
                label="Product Description"
                onChange={d => setDescription(d.target.value)}
            />

            <Stack direction="row" spacing={1}
                label="Attributes"
                sx={{ border: "solid", borderWidth: "1px", borderColor: "lightgray", margin: ".5vh 0", padding: ".5em" }}
            >
                {attributes.map((a, i) => (
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
            <ImageUpload getImages={getImages} type="product" multiple={true} uploadImages={uploadImages} />
            <br/>
            <Button
                id="createProductButton"
                variant="contained"
                onClick={() => {
                    createProductAsync({ name, description, attributes, price, images },() => {
                        created();
                    });
                }}
            >
                Create
            </Button>
        </Box>);
}

export default CreateProduct;