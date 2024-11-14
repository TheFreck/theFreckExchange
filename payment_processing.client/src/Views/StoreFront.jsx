import { Box, Grid2, ImageList, ImageListItem, Typography } from "@mui/material";
import react, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import axios from "axios";

export const StoreFront = () => {
    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });
    const [images, setImages] = useState([]);

    useEffect(() => {
        productApi.get("images")
            .then(async yup => {
                for (var im of yup.data) {
                    let img = await fetch(window.atob(im.image));
                    let blob = await img.blob();
                    im.img = URL.createObjectURL(blob);
                }
                console.log("yup images: ", yup.data);
                setImages(yup.data);
            })
            .catch(nope => console.error(nope));
    }, []);

    const ImageGroups = () => {
        console.log("images: ", images);
        return <>
            <img src={images[Math.floor(Math.random() * images.length)].img} style={{ height: "60vh" }} />
            <img src={images[Math.floor(Math.random() * images.length)].img} style={{ height: "60vh" }} />
            <img src={images[Math.floor(Math.random() * images.length)].img} style={{ height: "60vh" }} />
        </>
    }

    return <Box
        sx={{
            height: "60vh",
            width: "100vw",
            margin: 0,
            padding: 0,
        }}
    >
        <Carousel
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
                        style={{ display: "flex", flexDirection: "row", margin: 0, padding: 0 }}
                    >
                        <ImageGroups />
                    </div>
                ))
            }
        </Carousel>
        <Typography
            variant="h3"
        >
            Hat Types
        </Typography>
        <Grid2 container size={12}
            sx={{ display: "flex", margin: "2em"}}
        >
            <Grid2 size={2}>
            </Grid2>
            <Grid2 size={4}
                sx={{ padding: "1em", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <Grid2 size={3}>
                    <Typography
                    sx={{width: "100%"}}
                        variant="h4"
                    >
                        Bowler
                    </Typography>
                </Grid2>
                <Grid2 size={3}>
                    <Typography
                    sx={{width: "100%"}}
                        variant="h4"
                    >
                        Trilby
                    </Typography>
                </Grid2>
                <Grid2 size={3}>
                    <Typography
                    sx={{width: "100%"}}
                        variant="h4"
                    >
                        Porkpie
                    </Typography>
                </Grid2>
            </Grid2>
            <Box
                sx={{ border: "solid", borderWidth: "1px" }}
            />
            <Grid2 size={4}
                sx={{ padding: "1em", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <Grid2 size={3}>
                    <Typography
                    sx={{width: "100%"}}
                        variant="h4"
                    >
                        Ballcap
                    </Typography>
                </Grid2>
                <Grid2 size={3}>
                    <Typography
                    sx={{width: "100%"}}
                        variant="h4"
                    >
                        Fedora
                    </Typography>
                </Grid2>
                <Grid2 size={3}
                    sx={{width: "100%"}}
                >
                    <Typography
                        variant="h4"
                    >
                        Writing Cap
                    </Typography>
                </Grid2>
            </Grid2>
            <Grid2 size={2}>
            </Grid2>
        </Grid2>
    </Box>
}

export default StoreFront;