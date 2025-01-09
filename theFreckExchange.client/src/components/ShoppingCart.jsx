import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../Context";
import { Box, Button, Grid2, Typography } from "@mui/material";
import TransactionDetails from "./TransactionDetails";
import { calcOrderTotal, currencyFormat } from "../helpers/helpersApp";

export const ShoppingCart = ({setCheckoutOpen}) => {
    const {getShoppingCart,removeFromCart} = useContext(AccountContext);
    const [items,setItems] = useState([]);
    const [orderTotal,setOrderTotal] = useState(0.0);

    useEffect(() => {
        let cart = getShoppingCart();
        cart.sort((a,b) => {
            if(a.item.sku>b.item.sku) return 1;
            if(a.item.sku<b.item.sku) return -1;
            return 0;
        });
        calcOrderTotal(cart, total => setOrderTotal(currencyFormat.format(total)));
        setItems(cart);
    },[]);

    const sortCart = (cart) => {
        cart.sort((a,b) => {
            if(a.item.sku>b.item.sku) return 1;
            if(a.item.sku<b.item.sku) return -1;
            return 0;
        });
        setItems(cart);
    }

    const updateQty = (transaction,qty) => {
        let cartItem = items.find(i => i.item.sku === transaction.item.sku);
        cartItem.quantity = qty;
        let toSet = [...items.filter(i => i.item.sku !== transaction.item.sku),cartItem];
        calcOrderTotal(toSet, total => setOrderTotal(currencyFormat.format(total)));
        sortCart(toSet);
    }
    
    return <Box
        sx={{
            width: "80vw", 
            maxHeight: "60vh", 
            border: "solid", 
            borderColor: "white", 
            margin: "10vh auto", 
            background: "white",
        }}
    >
        <Box
            sx={{maxHeight: "50vh",overflowY: "auto", marginBottom: "5vh"}}
        >
            <Grid2 size={11}>
                <Typography
                    variant="h4"
                >
                    Shopping Cart
                </Typography>
            </Grid2>
            {items.length && items.map((i,j) => (
                <TransactionDetails
                    key={j}
                    transaction={i}
                    updateQty={updateQty}
                    removeFromCart={removeFromCart}
                />
            ))}

        </Box>
        <Typography
            variant="h6"
            sx={{marginLeft: "8vw"}}
        >
            Order Total: {orderTotal}
        </Typography>
        <Button
            sx={{marginLeft: "8vw"}}
            onClick={() => setCheckoutOpen(true)}
        >
            Proceed to Checkout
        </Button>
    </Box>
}

export default ShoppingCart;