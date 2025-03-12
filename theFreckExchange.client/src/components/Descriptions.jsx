import { Box, Grid2, Modal, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import PurchaseItem from "../Views/Item/PurchaseItem";
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from "../Context";

export const Descriptions = ({products}) => {
    const {isMobile} = useContext(AuthContext);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [productOpen, setProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});

    useEffect(() => {
        if(!products.length) return;
        let leftCol = [];
        let rightCol = [];
        for(let i=0; i<6; i+=2){
            leftCol.push(products[i]);
            rightCol.push(products[i+1]);
        }
        setLeft(leftCol);
        setRight(rightCol);
    },[]);

    const selectProduct = (theOne) => {
        setSelectedProduct(theOne);
        setProductOpen(true);
    }

    const LeftColumn = () => (
        <Grid2
            data-left
            size={6}
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "40vw",
                marginLeft: "auto",
                marginRight: 0,
                alignItems: "center"
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
                display: "flex",
                flexDirection: "column",
                width: "40vw",
                marginRight: "auto",
                marginLeft: 0,
                alignItems: "center"
            }}
        >
            {right && right.map((r,i) => (
                <Typography
                    key={i}
                    variant="h4"
                    onClick={() => selectProduct(r)}
                    sx={{ 
                        cursor: "pointer",
                    }}
                >
                    {r.name}
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
                    width: `${isMobile ? "98vw" : "80vw"}`,
                    background: "white",
                    margin: "5vh auto",
                    height: "90vh",
                    overflowY: "auto"
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
                <PurchaseItem product={selectedProduct} setProductOpen={setProductOpen} />
                
            </Box>
        </Modal>
    )

    return <Box>
        <Grid2
            container
            spacing={1}
            size={12}
            sx={{
                display: "flex", 
                flexDirection: "row",
                justifyContent: "center"
            }}
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