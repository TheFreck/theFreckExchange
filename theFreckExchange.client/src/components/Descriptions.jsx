import { Box, Grid2, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PurchaseItem from "../Views/Item/PurchaseItem";
import CloseIcon from '@mui/icons-material/Close';

export const Descriptions = ({products}) => {
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [productOpen, setProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});

    useEffect(() => {
        let leftCol = [];
        let rightCol = [];
        for(let product in products){
            if(product%2) leftCol.push(products[product]);
            else rightCol.push(products[product]);
        }
        setLeft(leftCol);
        setRight(rightCol);
    },[products]);

    const selectProduct = (theOne) => {
        setSelectedProduct(theOne);
        setProductOpen(true);
    }

    const LeftColumn = () => (
        <Grid2
            data-left
            size={6}
            sx={{
                width: "40vw",
                marginLeft: "auto",
                marginRight: 0
            }}
        >
            {left && left.map((l,i) => (
                <Typography
                    key={i}
                    variant="h4"
                    onClick={() => selectProduct(l)}
                    sx={{cursor: "pointer"}}
                >
                    {l.name}
                </Typography>
            ))}
        </Grid2>
    );

    const RightColumn = () => (
        <Grid2
            data-right
            size={6}
            sx={{
                width: "40vw",
                marginRight: "auto",
                marginLeft: 0
            }}
        >
            {right && right.map((l,i) => (
                <Typography
                    key={i}
                    variant="h4"
                    onClick={() => selectProduct(l)}
                    sx={{ cursor: "pointer" }}
                >
                    {l.name}
                </Typography>
            ))}
        </Grid2>
    );

    const ProductModal = () => (
        <Modal
            open={productOpen}
            onClose={() => setProductOpen(false)}
        >
            <Box
                sx={{
                    width: "80vw",
                    background: "white",
                    margin: "5vh auto",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row-reverse"
                    }}
                >
                    <CloseIcon
                        sx={{
                            width: "2vw",
                            marginRight: 0,
                            marginLeft: "auto"
                        }}
                        fontSize="large"
                        onClick={() => setProductOpen(false)}
                    />
                </Box>
                <PurchaseItem product={selectedProduct} />
                
            </Box>
        </Modal>
    )

    return <Box>
        <Grid2
            container
            spacing={1}
            size={12}
            sx={{display: "flex", flexDirection: "row"}}
        >
            <LeftColumn />
            <div
                style={{
                    width: 0,
                    border: "solid",
                    borderWidth: "1px"
                }}
            />
            <RightColumn />
        </Grid2>
        <ProductModal />
    </Box>
}

export default Descriptions;