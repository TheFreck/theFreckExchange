import { Box, Button, TextField } from "@mui/material";
import react, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../Context";

export const CreateProduct = () => {
    const context = useContext(ProductContext);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0.0);
    const [description, setDescription] = useState("");

    return <div>
            <div>Create Product Here</div>
            <Box
                component="form"
                sx={{display:"flex", flexDirection: "column"}}
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
                <Button 
                    id="createProductButton"
                    variant="contained"
                    onClick={() => context.createProductAsync({name,description,price})}
                >
                    Create
                </Button>
            </Box>
        </div>
}

export default CreateProduct;