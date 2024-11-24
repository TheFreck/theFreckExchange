import { Box, Button, Typography } from "@mui/material";
import react, { useState } from "react";
import axios from "axios";

export const ImageUpload = ({getImages,uploadImages}) => {
    const imageApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    })
    const [images, setImages] = useState([]);

    return <Box
        sx={{marginTop: "10em"}}
    >
        <Typography>
            Upload Images for the site
        </Typography>
        <input type="file" multiple onChange={e => getImages(e,im => {
            setImages(im);
        })} />
        <br/>
        {
            images.length > 0 &&
            images.map((i, j) => (
                <img src={i} key={j} style={{ minWidth: "5vw", maxWidth: "20vw", borderRadius: "5px" }} />
            ))
        }
        <br/>
        <Button
            onClick={() => uploadImages(images)}
        >
            Upload
        </Button>
    </Box>
}

export default ImageUpload;