import { Box, Button, Grid2, Modal, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import { AuthContext } from "../../Context";
import { uploadImagesAsync, getImages, updateConfigurationAsync,getConfigurationAsync,createConfigurationAsync,deleteConfigurationAsync,getProductsAsync} from "../../helpers/helpers";

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
    const { refreshConfig,setRefreshConfig,getUserAcct,isMobile } = useContext(AuthContext);
    const [acct,setAcct] = useState({});
    const [siteTitle,setSiteTitle] = useState("");
    const [config,setConfig] = useState(configTemplate);
    const [categoryTitle,setCategoryTitle] = useState("");
    const [products,setProducts] = useState([]);
    

    useEffect(() => {
        setAcct(getUserAcct());
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
                setProducts(prods);
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

    return <Box>
        <Grid2 container
            spacing={1}
            sx={{
                display: "flex", 
                flexDirection: "column", 
                width: `${isMobile ? "98vw" : "80vw"}`, 
                height: "80vh",
                margin: `${isMobile ? "0 1vw" : "0 10vw"}`, 
            }}
        >
            <Typography
                variant="h3"
            >
                Site Configuration
            </Typography>
            <Grid2>
                {
                    (localStorage.getItem("configId") !== "" && 
                    localStorage.getItem("configId") !== "00000000-0000-0000-0000-000000000000" && 
                    localStorage.getItem("configId") !== null) && 
                    <Button
                        sx={{
                            width: `${isMobile ? "100%" : "80vw"}`,
                            color: "red",
                            borderColor: "red"
                        }}
                        onClick={() => deleteConfigurationAsync(localStorage.getItem("configId"),yup => {
                            setConfig(yup);
                            setRefreshConfig(!refreshConfigs);
                        })}
                        variant="outlined"
                    >
                        Reset Configuration
                    </Button>
                }
            </Grid2>
            <Grid2>
                {
                    (localStorage.getItem("configId") === "00000000-0000-0000-0000-000000000000" || 
                    localStorage.getItem("configId") === "" || 
                    localStorage.getItem("configId") === null) && 
                    <Button
                        sx={{
                            width: `${isMobile ? "98vw" : "auto"}`,
                        }}
                        onClick={() => createConfigurationAsync(configTemplate,getUserAcct(),yup => {
                            let acct = getUserAcct();
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
                (localStorage.getItem("configId") !== "" && 
                localStorage.getItem("configId") !== "00000000-0000-0000-0000-000000000000" && 
                localStorage.getItem("configId") !== null) && 
                <Grid2 container 
                    sx={{
                        display: "flex", 
                        flexDirection: "column"
                    }} 
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
                    <Grid2
                        container
                        spacing={3}
                        sx={{
                            border: "solid",
                            display: "flex", 
                            flexDirection: "column",
                            height: "50vh",
                            overflowY: "auto"
                        }}
                    >
                        {/* {on click opens product modify page} */}
                        {
                            products && products.length && 
                            products.map((p,i) => (
                            <Typography
                                key={i}
                                variant="h4"
                                sx={{
                                    width: "30vw",
                                }}
                                >
                                {p.name}
                            </Typography>
                            ))
                        }
                    </Grid2>
                </Grid2>
            }
        </Grid2>
    </Box>
}

export default SiteConfiguration;