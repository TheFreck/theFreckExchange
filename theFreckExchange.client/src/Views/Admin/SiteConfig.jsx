import { Box, Button, Grid2, Modal, TextField, Typography } from "@mui/material";
import react, { useContext, useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import { ProductContext } from "../../Context";
import Descriptions from "../../components/Descriptions";

const configTemplate = {
    background: {image:"",name: ""},
    categories: [
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""}
    ],
    categoryTitle: "",
    iamgeFiles: [],
    siteTitle: ""
};

export const SiteConfiguration = () => {
    const { uploadImages, getImages, updateConfigurationAsync,getConfigurationAsync,createConfigurationAsync} = useContext(ProductContext);
    const [siteTitle,setSiteTitle] = useState("");
    const [config,setConfig] = useState(configTemplate);
    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });

    useEffect(() => {
        getConfigurationAsync(cfg => {
            setConfig(cfg);
            console.log("got config: ", cfg);
        });
    },[]);

    useEffect(() => {
        console.log("setting siteTitle: ", siteTitle);
    },[siteTitle]);

    const setTitleConfig = () => {
        console.log("siteTitle: ", siteTitle);
        setConfig({...config,siteTitle});
        updateConfigurationAsync({...config,siteTitle},cfg => {
            console.log("updated site title: ", cfg);
        });
    }

    return <Box>
        <Grid2 container
            spacing={1}
            sx={{display: "flex", flexDirection: "column", width: "80vw", border: "solid", margin: "auto", marginTop: "10vh"}}
        >
            <Grid2
                sx={{border: "solid"}}
            >
                <Typography
                    variant="h3"
                >
                    Site Configurations
                </Typography>
            </Grid2>
            <Grid2>
                <Button
                    onClick={() => createConfigurationAsync(yup => console.log("yup: ", yup))}
                    variant="outlined"
                >
                    Setup New Configuration
                </Button>
            </Grid2>
            <Grid2
                sx={{border: "solid",padding: "1em", height: "10vh"}}
            >
                <TextField
                    sx={{height: "100%"}}
                    label="Site Title"
                    onChange={t => setSiteTitle(t.target.value)}
                    value={siteTitle}
                />
                <Button
                    sx={{height: "100%"}}
                    variant="contained"
                    onClick={setTitleConfig}
                >
                    Set Title
                </Button>
            </Grid2>
            <Grid2
                sx={{border: "solid"}}
            >
                <Typography
                    variant="h5"
                >
                    Upload Background Images
                </Typography>
                <ImageUpload
                    getImages={getImages}
                    uploadImages={uploadImages}
                    type="background"
                />
            </Grid2>
            <Grid2
                sx={{border: "solid"}}
            >
                <Typography
                    variant="h5"
                >
                    Upload Site Images
                </Typography>
                    <ImageUpload 
                        getImages={getImages} 
                        uploadImages={uploadImages}
                        type="site"
                    />
            </Grid2>
            <Grid2
                sx={{border: "solid"}}
            >
                <Typography
                    variant="h5"
                >
                    Add categories and descriptions
                </Typography>
                <Descriptions isConfig={true} />
            </Grid2>
        </Grid2>
    </Box>
}

export default SiteConfiguration;