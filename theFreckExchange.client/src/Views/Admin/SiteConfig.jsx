import { Box, Button, Grid2, Modal, TextField, Typography } from "@mui/material";
import react, { useContext, useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import { AccountContext, ProductContext } from "../../Context";
import Descriptions from "../../components/Descriptions";

const configTemplate = {
    background: "",
    categories: [
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""}
    ],
    categoryTitle: "",
    imageFiles: [],
    siteTitle: ""
};

export const SiteConfiguration = () => {
    const { uploadImagesAsync, getImages, updateConfigurationAsync,getConfigurationAsync,createConfigurationAsync,deleteConfigurationAsync} = useContext(ProductContext);
    const { refreshConfig,setRefreshConfig } = useContext(AccountContext);
    const [siteTitle,setSiteTitle] = useState("");
    const [backgroundImage, setBackgroundImage] = useState({});
    const [siteImages,setSiteImages] = useState([]);
    const [config,setConfig] = useState(configTemplate);
    

    useEffect(() => {
        getConfigurationAsync(cfg => {
            setConfig(cfg);
        });
    },[]);

    const setTitleConfig = () => {
        setConfig({...config,siteTitle});
        localStorage.setItem("siteTitle", siteTitle);
        updateConfigurationAsync({...config,siteTitle},cfg => {
            setRefreshConfig(!refreshConfig);
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
                {(localStorage.getItem("configId") !== "" && localStorage.getItem("configId") !== "00000000-0000-0000-0000-000000000000" && localStorage.getItem("configId") !== null) && 
                    <Button
                        onClick={() => deleteConfigurationAsync(localStorage.getItem("configId"),yup => {
                            setConfig(yup);
                            setRefreshConfig(!refreshConfigs);
                        })}
                        variant="outlined"
                    >
                        Delete Current Configuration
                    </Button>
                }
                {(localStorage.getItem("configId") === "00000000-0000-0000-0000-000000000000" || localStorage.getItem("configId") === "" || localStorage.getItem("configId") === null) && 
                    <Button
                        onClick={() => createConfigurationAsync(yup => {
                            setConfig(yup);
                            setRefreshConfig(!refreshConfig);
                        })}
                        variant="contained"
                    >
                        Setup New Configuration
                    </Button>
                }
            </Grid2>
            {
                (localStorage.getItem("configId") !== "" && localStorage.getItem("configId") !== "00000000-0000-0000-0000-000000000000" && localStorage.getItem("configId") !== null) && 
                <Grid2 container sx={{display: "flex", flexDirection: "column"}}>
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
                            Upload A Background Image
                        </Typography>
                        <ImageUpload
                            getImages={getImages} 
                            uploadImagesAsync={uploadImagesAsync}
                            type="background"
                            multiple={false}
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
                                uploadImagesAsync={uploadImagesAsync}
                                type="site"
                                multiple={true}
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
                        <Descriptions isConfig={true} bckImage={config.background} />
                    </Grid2>
                </Grid2>
            }
        </Grid2>
    </Box>
}

export default SiteConfiguration;