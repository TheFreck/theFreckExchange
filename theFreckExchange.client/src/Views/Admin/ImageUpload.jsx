import { Box, Button, Typography } from "@mui/material";
import react, { useState } from "react";
import axios from "axios";

export const ImageUpload = ({getImages,uploadImages,type}) => {
    const imageApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    })
    const [images, setImages] = useState([]);

    return <Box
        sx={{marginTop: "10em"}}
    >
        <input type="file" multiple onChange={e => getImages(e,im => {
            const toSet = [];
            for(let i=0; i<e.target.files.length; i++){
                let filename = e.target.files[i].filename;
                if(type === "background" && !e.target.files[i].filename.includes("background")){
                    filename = "background-"+filename;
                }
                toSet.push({filename, blob: im[i]});
            }
            setImages(toSet);
        })} />
        <br/>
        {
            images.length > 0 &&
            images.map((i, j) => (
                <img src={i.blob} key={j} style={{ minWidth: "5vw", maxWidth: "20vw", borderRadius: "5px" }} />
            ))
        }
        <br/>
        <Button
            sx={{width: "100%"}}
            variant="contained"
            onClick={() => uploadImages(images)}
        >
            Upload
        </Button>
    </Box>
}

export default ImageUpload;