import { Box, Typography } from "@mui/material";
import react, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import axios from "axios";

export const StoreFront = () => {
    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });
    const [images,setImages] = useState([]);

    useEffect(() => {
        productApi.get("images")
        .then(yup => {
            setImages(yup.data);
        })
        .catch(nope => console.error(nope));
    })

    return <Box
        sx={{
            height: "60vh",
            width: "100vw",
            border: "solid",
            margin: 0,
            padding: 0,
        }}
    >
        <Typography>Store Front</Typography>
        <Carousel
            sx={{width: "100%",height: "60vh"}}
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
                images.map((p,i) => (
                    <img src={window.atob(p.image)} key={i} />
                ))
            }
        </Carousel>
    </Box>
}

export default StoreFront;