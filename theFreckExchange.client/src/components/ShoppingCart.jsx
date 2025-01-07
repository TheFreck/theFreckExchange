import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../Context";
import { Box, Button } from "@mui/material";
import TransactionDetails from "./TransactionDetails";

export const ShoppingCart = () => {
    const {getShoppingCart} = useContext(AccountContext);
    const [items,setItems] = useState([]);

    useEffect(() => {
        let cart = getShoppingCart();
        setItems(cart);
    },[]);
    
    return <Box
        sx={{
            width: "80vw", 
            height: "80vh", 
            border: "solid", 
            borderColor: "white", 
            margin: "10vh auto", 
            background: "white"
        }}
    >
        {items.length && items.map((i,j) => (
            <TransactionDetails
                key={j}
                transaction={i}
            />
        ))}
        <Button
            variant="contained"
            sx={{marginLeft: "10vw"}}
        >
            Proceed to Checkout
        </Button>
    </Box>
}

export default ShoppingCart;