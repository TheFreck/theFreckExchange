import { Box, Grid2, ImageList, ImageListItem, Modal, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { ImageCarousel } from "../components/ImageCarousel";
import { getConfigurationAsync, getProductsAsync, getSiteImagesAsync } from "../helpers/helpersWelcome";
import Descriptions from "../components/Descriptions";
import bowlerImg from "../assets/images/bowler.jpg";
import bowler2Img from "../assets/images/bowler-2.jpg";
import fedoraImg from "../assets/images/fedora.jpg";
import fedora2Img from "../assets/images/fedora-2.jpg";
import newsieImg from "../assets/images/newsie.jpg";
import writingCapImg from "../assets/images/writingCap.jpg";
import porkpieImg from "../assets/images/porkpie-2.jpg";
import trilbyImg from "../assets/images/trilby-side.jpg";

export const StoreFront = () => {
    const [images, setImages] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setImages([
            bowlerImg,
            fedoraImg,
            newsieImg,
            porkpieImg,
            trilbyImg,
            bowler2Img,
            fedora2Img,
            writingCapImg
        ])
        getConfigurationAsync(figs => {
            if(localStorage.getItem("configId") === null || figs.configId === null || localStorage.getItem("configId") === undefined || localStorage.getItem("configId") === "undefined") return;
            getProductsAsync(prods => {
                setProducts(prods);
            });
        })
    }, []);

    const ImagesCallback = useCallback(() => images && 
        <ImageList
            variant="masonry"
            rows={4}
            cols={4}
            gap={1}
        >
            {
                images && images.map((m,i) => (
                    <ImageListItem key={i}>
                        <img 
                            srcSet={`${m}?fit=crop&auto=format&dpr=2 2x`}
                            src={`${m}?fit=crop&auto=format`} 
                        />
                    </ImageListItem>
                ))
            }
        </ImageList>
        , [images]);

    return <Box
        sx={{
            height: "60vh",
            width: "100vw",
            margin: 0,
            padding: 0,
            color: "black",
        }}
    >
        <Box
            sx={{
                overflowY: "scroll",
                height: "60vh"
            }}
        >
            <ImagesCallback />
        </Box>
            
        <br/>
        <Descriptions products={products} />
    </Box>
}

export default StoreFront;