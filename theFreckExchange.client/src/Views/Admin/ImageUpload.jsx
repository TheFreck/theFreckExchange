import { Box, Button, Typography } from "@mui/material";
import react, { useState } from "react";
import axios from "axios";

export const ImageUpload = () => {
    const imageApi = axios.create({
        baseURL: `/Product`
    })
    const [images, setImages] = useState([]);
    const [imageBytes,setImageBytes] = useState([]);

    const getImages = async (e) => {
        let targetImages = [];
        let targetBytes = [];
        for (var i = 0; i < e.target.files.length; i++) {
            targetImages.push(URL.createObjectURL(e.target.files[i]));
            targetBytes.push(e.target.files[i]);
        }
        setImages(targetImages);
        setImageBytes(targetBytes);
    }
    
    const readImagesAsync = async (imagesInput, cb) => {
        let base64Images = [];
        for (var image of imagesInput) {
            console.log("image to read: ", image);
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
            if (base64Images.length === imagesInput.length) {
                console.log("base64Images: ", base64Images);
                cb(base64Images);
            }
        }
    }

    const uploadImages = () => {
        readImagesAsync(images, ready => {
            let formData = new FormData();
            for (var i = 0; i < ready.length; i++) {
                formData.append("images",new Blob([ready[i]]));
            }

            imageApi.post("images/upload",formData)
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