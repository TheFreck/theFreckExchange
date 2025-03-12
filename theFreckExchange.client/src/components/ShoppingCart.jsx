import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context";
import { Box, Button, Grid2, Typography } from "@mui/material";
import TransactionDetails from "./TransactionDetails";
import { calcOrderTotal, currencyFormat } from "../helpers/helpers";
import { NavLink } from "react-router";

export const ShoppingCart = ({setCheckoutOpen}) => {
    const {getShoppingCart,isMobile} = useContext(AuthContext);
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
    
    const CartCallback = useCallback(() => (
     <Box
        sx={{
            width: `${isMobile ? "80vw" : "70vw"}`, 
            maxHeight: "60vh", 
            margin: `${isMobile ? 0 : "10vh"} 5vw`,
            paddingBottom: "5vh"
        }}
    >
        <Box
            sx={{
                width: "100%",
                maxHeight: "50vh",
                overflowY: "auto", 
                marginBottom: "5vh",
            }}
        >
            <Grid2 >
                <Typography
                    variant="h4"
                >
                    Shopping Cart
                </Typography>
                <hr/>
            </Grid2>
            {items.length && items.map((i,j) => (
                <TransactionDetails
                    key={j}
                    transaction={i}
                    updateQty={updateQty}
                />
            ))}

        </Box>
        <Grid2 size={12} container>
            <Grid2 size={isMobile ? 8 : 3}>
                <Typography
                    variant="h6"
                    sx={{marginLeft: "4vw"}}
                    >
                    Order Total: 
                </Typography>
            </Grid2>
            <Grid2 size={3}>
                <Typography
                    variant="h6"
                >
                    {orderTotal}
                </Typography>
            </Grid2>
        </Grid2>
        <br/>
        <NavLink to="/User/Shopping/Checkout" onClick={() => setCheckoutOpen(false)} end>
            Proceed to Checkout
        </NavLink>
    </Box>),[items]);

    return <CartCallback />
}

export default ShoppingCart;