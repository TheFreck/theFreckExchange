import { FormControl, MenuItem, Select } from "@mui/material";
import react, { useState } from "react";

export const ProductViewV2 = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({});
    const [productAttributes, setProductAttributes] = useState([]);

    const handleAttributeSelection = (e) => {
        e.preventDefault();
        console.log("handle the attribute selection: ", e.target.value);
    };

    return (
        <Grid2>
            {
                products.map((p, i) => (
                    <Grid2 container spacing={2} key={i}>
                        <Grid2 size={4} >
                            <img src={p.image} />
                            {
                                p.attributes.map((a,j) => (
                                    <FormControl fullWidth key={j}>
                                        <InputLabel>{a.type}</InputLabel>
                                        <Select
                                            label={a.type}
                                            value={productAttributes[j]}
                                            onChange={handleAttributeSelection}
                                        >
                                            {
                                                a.attributes.map((m,k) => (
                                                    <MenuItem value={m.value[k]}>{m.value[k]}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                ))
                            }
                        </Grid2>
                        <Grid2 size={8}>
                            <h2>{p.name}</h2>
                            <p>{p.description}</p>
                        </Grid2>
                    </Grid2>
                ))
            }
        </Grid2>
    );
}

export default ProductViewV2;