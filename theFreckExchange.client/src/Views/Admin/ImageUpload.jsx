import { Box, Button, ImageListItem, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {updateConfigurationAsync,uploadImagesAsync} from "../../helpers/helpersWelcome";
import CheckIcon from '@mui/icons-material/Check';

export const ImageUpload = ({getImages,type,multiple,uploadImages,primary,setPrimary}) => {
    const [images, setImages] = useState([]);

    return <Box
        sx={{marginTop: "5vh"}}
    >
        {images && images.length && 
            <Typography
                variant="h4"
                sx={{margin: "0 0 5vh 0"}}
            >
                Select one image to be primary
            </Typography>
        }
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
                <ImageListItem key={j}>
                    <img 
                        key={j} 
                        onClick={() => {
                            if(primary && primary.filename && primary.filename === i.filename) setPrimary({});
                            else setPrimary(i)
                        }}
                        alt={`${i.filename}`}
                        src={i.blob} 
                        style={{ minWidth: "5vw", maxWidth: "20vw", borderRadius: "5px" }} />
                        {i.filename === primary.filename && 
                            <CheckIcon sx={{color: "green",fontWeight: "bold",fontSize: "5em",position: "absolute",left: 0,top: 0,zIndex: 100}}/>
                        }
                </ImageListItem>
            ))
        }
        <br/>
        <Button
            sx={{width: "100%"}}
            variant="contained"
            onClick={() => uploadImagesAsync(images,async uploaded => {
                console.log("uploaded: ", uploaded);

                if(type==="background"){
                    await updateConfigurationAsync({background: uploaded[0].imageId, configId: localStorage.getItem("configId")},cbck => {
                        console.info("updated site background: ", cbck);
                    })
                }
                else
                if(type === "product"){
                    uploadImages(uploaded);
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