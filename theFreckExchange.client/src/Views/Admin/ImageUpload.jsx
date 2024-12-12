import { Box, Button, Typography } from "@mui/material";
import react, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ProductContext } from "../../Context";

export const ImageUpload = ({getImages,uploadImagesAsync,type,multiple}) => {
    const {updateConfigurationAsync} = useContext(ProductContext);
    const imageApi = axios.create({
        baseURL: `/Product`
    })
    const [images, setImages] = useState([]);

    useEffect(() => {
        // console.log("set images: ", images);
    },[images]);

    return <Box
        sx={{marginTop: "10em"}}
    >
        <input type="file" multiple={multiple} onChange={e => getImages(e,im => {
            const toSet = [];
            for(let i=0; i<e.target.files.length; i++){
                let filename = e.target.files[i].filename;
                // if(type === "background" && !e.target.files[i].filename.includes("background")){
                //     filename = "background-"+filename;
                // }
                toSet.push({filename, blob: im[i]});
            }
            setImages(toSet);
        })} />
        <br/>
        {/* {console.log("images to view: ", images)} */}
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
                // console.log("before updating config: ", uploaded[0].imageId);
                if(type==="background"){
                    await updateConfigurationAsync({background: uploaded[0].imageId, configId: localStorage.getItem("configId")},cbck => {
                        console.info("updated site background: ", cbck);
                    })
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