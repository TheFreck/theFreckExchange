import react, { useState } from "react";
import axios from 'axios';

export const NewProduct = ({saveNewProduct}) => {
    const [name,setName] = useState("");
    const [price, setPrice] = useState(0.0);
    const [description, setDescription] = useState("");

    return <div>
            <h1>New Product</h1>
            <label>Product Name:
                <input type="text" onChange={c => setName(c.target.value)} placeholder="product name" value={name} />
            </label>
            <br/>
            <label>Price: 
                <input type="number" onChange={c => setPrice(c.target.value)} value={price} />
            </label>
            <br/>
            <label>Product Description: 
                <textarea name="description" onChange={c => setDescription(c.target.value)}></textarea>
            </label>
            <br/>
            <input type="submit" onClick={() => saveNewProduct(name,price,description)} />
        </div>
}

export default NewProduct;