import { Box, Button, Grid2, Modal, TextField, Typography } from "@mui/material";
import react, { useContext, useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import { AccountContext, ProductContext } from "../../Context";

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
    const { uploadImagesAsync, getImages, updateConfigurationAsync,getConfigurationAsync,createConfigurationAsync,deleteConfigurationAsync,getProductsAsync} = useContext(ProductContext);
    const { refreshConfig,setRefreshConfig } = useContext(AccountContext);
    const [siteTitle,setSiteTitle] = useState("");
    const [config,setConfig] = useState(configTemplate);
    const [categoryTitle,setCategoryTitle] = useState("");
    const [products,setProducts] = useState([]);
    

    useEffect(() => {
        getConfigurationAsync(cfg => {
            setConfig(cfg);
            getProductsAsync(prods => {
                let productPairs = [];
                for(let i=0; i<prods.length; i+=2){
                    productPairs.push({
                        left: prods[i],
                        right: prods[i+1]
                    });
                }
                setProducts(productPairs);
            });
        });
    },[]);

    const setTitleConfig = () => {
        setConfig({...config,siteTitle});
        localStorage.setItem("siteTitle", siteTitle);
        updateConfigurationAsync({...config,siteTitle},cfg => {
            setRefreshConfig(!refreshConfig);
        });
    }

    const setCategoryConfig = () => {
        setConfig({...config,categoryTitle});
        updateConfigurationAsync({...config,categoryTitle}, cfg => {
            setRefreshConfig(!refreshConfig);
        })
    }

    const addDescription = () => {

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
                <Grid2 container sx={{display: "flex", flexDirection: "column"}} >
                    <Grid2
                        sx={{border: "solid",  display: "flex", flexDirection: "column"}}
                    >
                        <TextField
                            label="Site Title"
                            onChange={t => setSiteTitle(t.target.value)}
                            value={siteTitle}
                        />
                        <Button
                            variant="contained"
                            onClick={setTitleConfig}
                        >
                            Set Site Title
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
                        container
                        spacing={3}
                        sx={{border: "solid",display: "flex", flexDirection: "column"}}
                    >
                        <Grid2
                            sx={{display: "flex", flexDirection: "column"}}
                        >
                            <TextField
                                sx={{height: "100%"}}
                                label="Product Categories Title"
                                onChange={t => setCategoryTitle(t.target.value)}
                                value={categoryTitle}
                            />
                            <Button
                                sx={{height: "100%"}}
                                variant="contained"
                                onClick={() => setCategoryConfig()}
                            >
                                Set Category Title
                            </Button>
                        </Grid2>
                        <Grid2 
                            sx={{
                                width: "60vw",
                                margin: "auto"
                            }}
                        >
                            {/* {on click opens product modify page} */}
                            {
                                products && products.length && 
                                products.map((p,i) => (
                                    <Box 
                                        key={i}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-evenly",
                                            margin: "auto",
                                            height: "5vh"
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            sx={{width: "30vw"}}
                                            >
                                            {p.left.name}
                                        </Typography>
                                        <div
                                            style={{width: 0, height: "100%", border: "solid", borderWidth: "2spx"}}
                                            />
                                        {
                                            p.right && 
                                            <Typography
                                                sx={{width: "30vw"}}
                                                variant="h4"
                                                >
                                                {p.right.name}
                                            </Typography>
                                        }
                                        {
                                            !p.right && 
                                            <Typography
                                                sx={{width: "30vw"}}
                                                variant="h4"
                                            ></Typography>
                                        }
                                    </Box>
                                ))
                            }
                        </Grid2>
                    </Grid2>
                </Grid2>
            }
        </Grid2>
    </Box>
}

export default SiteConfiguration;