import { Box, Button, Typography } from "@mui/material";
import react, { useState } from "react";
import axios from "axios";

export const ImageUpload = () => {
    const imageApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    })
    const [images, setImages] = useState([]);

    const getImages = async (e) => {
        let targetImages = [];
        for (var i = 0; i < e.target.files.length; i++) {
            targetImages.push(URL.createObjectURL(e.target.files[i]));
        }
        setImages(targetImages);
    }
    
    const readImagesAsync = async (images, cb) => {
        let base64Images = [];
        for (var image of images) {
            base64Images.push(await fetch(image)
                .then(res => res.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    return new Promise(resolve => {
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                    })
                }));
            if (base64Images.length === images.length) {
                cb(base64Images);
            }
        }
    }

    const uploadImages = () => {
        readImagesAsync(images, ready => {
            let data = [];
            for (var i = 0; i < ready.length; i++) {
                data.push(window.btoa([ready[i]]));
            }
            imageApi.post("images/upload",{imageBytes: data})
            .then(yup => {
                console.log("uploaded: ", yup.data);
            })
            .catch(nope => console.error(nope));
        });
    }

    return <Box
        sx={{marginTop: "10em"}}
    >
        <Typography>
            Upload Images for the site
        </Typography>
        <input type="file" multiple onChange={getImages} />
        <br/>
        {
            images.length > 0 &&
            images.map((i, j) => (
                <img src={i} key={j} style={{ minWidth: "5vw", maxWidth: "20vw", borderRadius: "5px" }} />
            ))
        }
        <br/>
        <Button
            onClick={uploadImages}
        >
            Upload
        </Button>
    </Box>
}

export default ImageUpload;