import { Box, Grid2, Modal, Typography } from "@mui/material";
import react, { useContext } from "react";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import { ProductContext } from "../../Context";
import Descriptions from "../../components/Descriptions";

export const SiteConfiguration = () => {
    const { uploadImages, getImages, config, createConfigurationAsync, updateConfigurationAsync } = useContext(ProductContext);
    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });

    const CategoryModal = () => <Modal
    >
        {
            // either load the categories and allow admin to modify from the gui
            // or build a form
        }
    </Modal>

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
                <Typography>
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
                <Typography>
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
                <Typography>
                    Add categories
                </Typography>
                <Typography>
                    Add descriptions for categories
                </Typography>
                <Descriptions isConfig={true} config={config} />
            </Grid2>
        </Grid2>
    </Box>
}

export default SiteConfiguration;