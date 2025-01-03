import { Box, Grid2, ImageList, ImageListItem, Modal, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Descriptions from "../components/Descriptions-dep";
import { ImageCarousel } from "../components/ImageCarousel";
import { getConfigurationAsync, getSiteImagesAsync } from "../helpers/helpersWelcome";

export const StoreFront = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        getConfigurationAsync(figs => {
            if(localStorage.getItem("configId") === null || figs.configId === null || localStorage.getItem("configId") === undefined || localStorage.getItem("configId") === "undefined") return;
            getSiteImagesAsync(figs, ims => {
                setImages(ims);
            });
        })
    }, []);

    return <Box
        sx={{
            height: "60vh",
            width: "100vw",
            margin: 0,
            padding: 0,
            color: "black"
        }}
    >
        <ImageCarousel
            imageObjects={images}
            height="60vh"
            width="100%"
            isGrouped={true}
        />
        <Descriptions />
    </Box>
}

export default StoreFront;