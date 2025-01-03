import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {updateConfigurationAsync,uploadImagesAsync} from "../../helpers/helpersWelcome";

export const ImageUpload = ({getImages,type,multiple,uploadImages}) => {
    const [images, setImages] = useState([]);

    return <Box
        sx={{marginTop: "10em"}}
    >
        <input type="file" multiple={multiple} onChange={e => getImages(e,im => {
            const toSet = [];
            for(let i=0; i<e.target.files.length; i++){
                let filename = e.target.files[i].filename;
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
            onClick={() => uploadImagesAsync(images,async uploaded => {

                if(type==="background"){
                    await updateConfigurationAsync({background: uploaded[0].imageId, configId: localStorage.getItem("configId")},cbck => {
                        console.info("updated site background: ", cbck);
                    })
                }
                else
                if(type === "product"){
                    uploadImages(uploaded.map(u => u.imageId));
                }
                else{
                    await updateConfigurationAsync({images: uploaded.map(u => u.imageId), configId: localStorage.getItem("configId")}, cbck => {
                        console.info("updated site images: ", cbck);
                    })
                }
            })}
        >
            Upload
        </Button>
    </Box>
}

export default ImageUpload;