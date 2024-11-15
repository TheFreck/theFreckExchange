import { Box, Grid2, ImageList, ImageListItem, Modal, Typography } from "@mui/material";
import react, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import axios from "axios";
import ProductDescription from "./productDescription";

export const StoreFront = () => {
    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });
    const descriptionApi = axios.create({
        baseURL: `https://localhost:7299/Site`
    });
    const [images, setImages] = useState([]);
    const [open,setOpen] = useState(false);
    const [productName,setProductname] = useState("");
    const [description,setDescription] = useState("");
    const [background,setBackground] = useState("");

    useEffect(() => {
        productApi.get("images")
            .then(async yup => {
                for (var im of yup.data) {
                    let img = await fetch(window.atob(im.image));
                    let blob = await img.blob();
                    im.img = URL.createObjectURL(blob);
                    if(im.name === "wood"){
                        setBackground(im.img);
                    }
                }
                setImages(yup.data);
            })
            .catch(nope => console.error(nope));
    }, []);

    const handleClose = () => {
        setOpen(false);
    }

    const getDescription = (product) => {
        descriptionApi.get(product)
        .then(yup => {
            let reggy1 = new RegExp("(?=<sup)(.*?)(?<=>)|(<a)(.*?)(?<=>)|(</a>)|(&#91)(.*?)(?<=&#93)","g");
            let reggy2 = new RegExp(">;","g");
            let reggied = yup.data.replace(reggy1,"");
            let final = reggied.replace(reggy2,',');
            setDescription(`<div>${final}</div>`);
    })
        .catch(nope => console.error(nope));
    }

    useEffect(() => {
        setOpen(true);
    },[description])

    const ImageGroups = () => {
        return <>
            <img src={images[Math.floor(Math.random() * images.length)].img} style={{ height: "60vh" }} />
            <img src={images[Math.floor(Math.random() * images.length)].img} style={{ height: "60vh" }} />
            <img src={images[Math.floor(Math.random() * images.length)].img} style={{ height: "60vh" }} />
        </>
    }

    const DescriptionModal = () => <>
        {description !== "" &&
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box
                sx={{
                    width: "70vw",
                    height: "70vh",
                    justifyContent: "center",
                    margin: "10vw auto",
                    background: "tan",
                    color: "black",
                    border: "solid",
                    padding: "1em",
                    overflowY: "scroll",
                }}
            >
                <Typography
                    variant="h4"
                >
                    {productName}
                </Typography>
                {description !== "" && <div dangerouslySetInnerHTML={{__html:description}} />}
                <br/>
                <Typography>
                    This description brought to you by Wikipedia.
                </Typography>
            </Box>
        </Modal>
    }
    </>
        
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
                        key={i}
                        style={{ display: "flex", flexDirection: "row", margin: 0, padding: 0 }}
                    >
                        <ImageGroups />
                    </div>
                ))
            }
        </Carousel>
        <Box
            sx={{
                backgroundImage: `url(${background})`, 
                backgroundRepeat: "no-repeat", 
                backgroundSize: "cover", 
                backgroundColor: "rgba(255,255,255,.2)", 
                backgroundBlendMode: "lighten",
                height: "66%", 
                color: "blackS"
            }}
        >
        <Typography
            variant="h3"
        >
            Hat Types
        </Typography>
        <Grid2 container size={12}
            sx={{ display: "flex", margin: "2em" }}
        >
            <Grid2 size={2}>
            </Grid2>
            <Grid2 size={4}
                sx={{ padding: "1em", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <Grid2 size={3}>
                    <Typography
                        sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                        variant="h4"
                        onClick={async () => {
                            setProductname("Bowler");
                            getDescription("Bowler");
                        }}
                    >
                        Bowler
                    </Typography>
                </Grid2>
                <Grid2 size={3}>
                    <Typography
                        sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                        variant="h4"
                        onClick={() => {
                            setProductname("Trilby");
                            getDescription("Trilby");
                        }}
                    >
                        Trilby
                    </Typography>
                </Grid2>
                <Grid2 size={3}>
                    <Typography
                        sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                        variant="h4"
                        onClick={() => {
                            setProductname("Porkpie");
                            getDescription("Porkpie");
                        }}
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
                        sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                        variant="h4"
                        onClick={() => {
                            setProductname("Ballcap");
                            getDescription("Ballcap");
                        }}
                    >
                        Ballcap
                    </Typography>
                </Grid2>
                <Grid2 size={3}>
                    <Typography
                        sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                        variant="h4"
                        onClick={() => {
                            setProductname("Fedora");
                            getDescription("Fedora");
                        }}
                    >
                        Fedora
                    </Typography>
                </Grid2>
                <Grid2 size={3}
                        sx={{ width: "100%", ":hover": {cursor: "pointer"} }}
                >
                    <Typography
                        variant="h4"
                        onClick={() => {
                            setProductname("Writing Cap");
                            getDescription("Writing Cap");
                        }}
                    >
                        Writing Cap
                    </Typography>
                </Grid2>
            </Grid2>
            <Grid2 size={2}>
            </Grid2>
        </Grid2>
        </Box>
        <DescriptionModal />
    </Box>
}

export default StoreFront;