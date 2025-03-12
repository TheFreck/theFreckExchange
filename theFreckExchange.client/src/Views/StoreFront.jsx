import { Box, Grid2, ImageList, ImageListItem, Modal, Typography } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { getConfigurationAsync, getProductsAsync, getSiteImagesAsync } from "../helpers/helpers";
import Descriptions from "../components/Descriptions";
import bowlerImg from "../assets/images/bowler.jpg";
import bowler2Img from "../assets/images/bowler-2.jpg";
import fedoraImg from "../assets/images/fedora.jpg";
import fedora2Img from "../assets/images/fedora-2.jpg";
import newsieImg from "../assets/images/newsie.jpg";
import writingCapImg from "../assets/images/writingCap.jpg";
import porkpieImg from "../assets/images/porkpie-2.jpg";
import trilbyImg from "../assets/images/trilby-side.jpg";
import Store from "./User/Store";
import { AuthContext } from "../Context";

export const StoreFront = () => {
    const {isMobile} = useContext(AuthContext);
    const [images, setImages] = useState([]);
    const [products, setProducts] = useState([]);
    const [ready,setReady] = useState(false);

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
            if(!figs.configId) return;
            getProductsAsync(prods => {
                setProducts(prods);
                setReady(true);
            });
        })
    }, []);

    const ImagesCallback = useCallback(() => images && 
        <ImageList
            variant="masonry"
            rows={4}
            cols={isMobile ? 1 : 4}
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
        , [images,ready]);

    const StorefrontCallback = useCallback(() => <Box
        sx={{
            minHeight: "90vh",
            width: "100vw",
            margin: 0,
            padding: 0,
            color: "black",
        }}
    >
        <Box
            sx={{
                overflowY: "scroll",
                height: `${isMobile ? "40vh" : "60vh"}`
            }}
        >
            <ImagesCallback />
        </Box>
        <Box
            sx={{marginTop: "-10vh"}}
        >
            <Store />
        </Box>
            
        <br/>
        <Descriptions products={products} />
    </Box>,
    [ready]);

    return <StorefrontCallback />
}

export default StoreFront;