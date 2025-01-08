import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import ImageUpload from "../Admin/ImageUpload"
import { createProductAsync, getImages } from "../../helpers/helpersWelcome";

const styles = {
    textField: {
        margin: "1vh 0"
    }
}

export const CreateProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0.0);
    const [description, setDescription] = useState("");
    const [attributeInput, setAttributeInput] = useState("");
    const [attributes, setAttributes] = useState([]);
    const [images, setImages] = useState([]);
    const [primary,setPrimary] = useState({});
    const [resetImages,setResetImages] = useState(false);

    const uploadImages = (im) => {
        setImages(im);
    }

    const reset = () => {
        setName("");
        setPrice(0.0);
        setDescription("");
        setAttributeInput("");
        setAttributes([]);
        setImages([]);
        setPrimary({});
        setResetImages(true);
    }

    const ImageUploadCallback = useCallback(() => <ImageUpload 
            getImages={getImages} 
            primary={primary} 
            setPrimary={setPrimary} 
            type="product" 
            multiple={true} 
            uploadImages={uploadImages} 
        />
    ,[resetImages]);

    return (
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", margin: "0 auto", width: "80vw" }}
        >
            <TextField
                style={styles.textField}
                required
                id="productName"
                label="Product Name"
                onChange={n => setName(n.target.value)}
                value={name}
            />
            <TextField
                style={styles.textField}
                required
                id="productPrice"
                label="Price"
                value={price}
                onChange={p => setPrice(p.target.value)}
            />
            <TextField
                style={styles.textField}
                required
                id="productDescription"
                label="Product Description"
                value={description}
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
            <ImageUploadCallback />
            <br/>
            <Button
                id="createProductButton"
                variant="contained"
                onClick={() => {
                    let primaryImageReference = images.find(i => i.name === primary.filename).imageId;
                    createProductAsync({ name, description, attributes, price, primaryImageReference, imageReferences: images.map(i=>i.imageId) },yup => {
                        reset();
                    });
                }}
            >
                Create
            </Button>
        </Box>);
}

export default CreateProduct;