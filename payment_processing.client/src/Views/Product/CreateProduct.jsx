import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import react, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../Context";

export const CreateProduct = ({created}) => {
    const { createProductAsync } = useContext(ProductContext);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0.0);
    const [description, setDescription] = useState("");
    const [attributeInput, setAttributeInput] = useState("");
    const [attributes, setAttributes] = useState([]);

    return <div>
        <div>Create Product Here</div>
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column" }}
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
                    <Chip label={a} key={i} />
                ))}
            </Stack>
            <TextField
                label="Product Attributes"
                onChange={p => {
                    setAttributeInput(p.target.value);
                    console.log(p.target.value);
                }}
                value={attributeInput}
                onKeyDown={k => {
                    console.log(k);
                    if (k.code === "NumpadEnter" || k.code === "Enter") {
                        setAttributes([...attributes, attributeInput])
                        setAttributeInput("");
                        console.log("attributeInput: ", attributeInput);
                    }
                }}
            />
            <br/>
            <Button
                id="createProductButton"
                variant="contained"
                onClick={() => {
                    createProductAsync({ name, description, attributes, price });
                    created();
                }}
            >
                Create
            </Button>
        </Box>
    </div>
}

export default CreateProduct;