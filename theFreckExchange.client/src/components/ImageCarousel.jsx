import { Box } from "@mui/material";
import react, { useEffect } from "react";
import Carousel from "react-material-ui-carousel";

export const ImageCarousel = ({
        imageObjects,
        minHeight,
        maxHeight,
        height,
        minWidth,
        maxWidth,
        width,
        isAutoPlay,
        isGrouped
    }) => {

    const ImageGroups = () => {
        return <Box
            sx={{display: "flex", flexDirection: "row"}}
        >
            <img alt="first" src={imageObjects[Math.floor(Math.random() * imageObjects.length)].image} style={{ width: "auto", height: "60vh", top: 0 }} />
            <img alt="second" src={imageObjects[Math.floor(Math.random() * imageObjects.length)].image} style={{ width: "auto", height: "60vh", top: 0 }} />
            <img alt="third" src={imageObjects[Math.floor(Math.random() * imageObjects.length)].image} style={{ width: "auto", height: "60vh", top: 0 }} />
            <img alt="fourth" src={imageObjects[Math.floor(Math.random() * imageObjects.length)].image} style={{ width: "auto", height: "60vh", top: 0 }} />
        </Box>
    }

    return <Carousel
        sx={{ minHeight, maxHeight, height, width, border: "solid", borderWidth: "1px" }}
        cycleNavigation={true}
        interval={10000}
        autoPlay={isAutoPlay}
        indicatorContainerProps={{
            style: {
                position: "absolute",
                bottom: "1em"
            }
        }}
    >
        {
            !isGrouped && imageObjects.map((image, i) => (
                <img 
                    style={{ backgroundSize: "contain", height }} 
                    src={image.image} 
                    height={"auto"} 
                    key={i} 
                />
            ))
        }
        {
            isGrouped && imageObjects.map((image,i) => 
                <div
                    key={i}
                    style={{ margin: 0, padding: 0 }}
                >
                    <ImageGroups />
                </div>
            )
        }
    </Carousel>
}