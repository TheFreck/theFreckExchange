import axios from "axios";
import react, { useEffect, useState } from "react";

export const ProductDescription = async ({product}) => {
    const descriptinoApi = axios.create({
        baseURL: `https://localhost:7299/Site`
    });
    const [description,setDescription] = useState("");

    useEffect(() => {
        getDescription(desc => setDescription(desc));
    },[]);

    const getDescription = async (cb) => {
        await descriptinoApi.get(product)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    }

    return await description;
}

export default ProductDescription;