import { Box, Grid2, ImageList, ImageListItem, Modal, Typography } from "@mui/material";
import react, { useContext, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import ProductDescription from "./productDescription";
import Descriptions from "../components/Descriptions-dep";
import { ProductContext } from "../Context";
import { ImageCarousel } from "../components/ImageCarousel";

export const StoreFront = () => {
    const {getConfigurationAsync,getBackground} = useContext(ProductContext);
    const [baseUrl,setBaseUrl] = useState("");

    const getBaseURL = (cb) => {
        if(process.env.NODE_ENV === "development"){
            setBaseUrl("https://localhost:7299");
            cb("https://localhost:7299");
        }
        else if(process.env.NODE_ENV === "production"){
            setBaseUrl("");
            cb("");
        }
    }

    const [images, setImages] = useState([]);

    useEffect(() => {
        getConfigurationAsync(figs => {
            if(localStorage.getItem("configId") === null || figs.configId === null || localStorage.getItem("configId") === undefined || localStorage.getItem("configId") === "undefined") return;
            getBaseURL(url => {
                const productApi = axios.create({
                    baseURL: `${url}/Product`
                });
                productApi.get(`images/site`)
                    .then(async yup => {
                        let yupReturn = [];
                        for (var im of yup.data) {
                            im.image = window.atob(im.image);
                            let img = await fetch(im.image);
                            let blob = await img.blob();
                            im.url = URL.createObjectURL(blob);
                            yupReturn.push(im);
                            setImages(yupReturn);
                        }
                    })
                    .catch(nope => console.error(nope));
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
        {/* <Carousel
            sx={{ width: "100%", height: "60vh" }}
            cycleNavigation={true}
            autoPlay={true}
            interval={30000}
            indicatorContainerProps={{
                style: {
                    position: "absolute",
                    bottom: "1em"
                }
            }}
        >
            {
                images.map((p, i) => (
                    <div
                        key={i}
                        style={{ display: "flex", flexDirection: "row", margin: 0, padding: 0 }}
                    >
                        <ImageGroups />
                    </div>
                ))
            }
        </Carousel> */}
        <Descriptions />
    </Box>
}

export default StoreFront;