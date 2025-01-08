import { Box, Grid2, Typography } from "@mui/material";
import {useContext, useEffect, useState} from "react";
import { AccountContext } from "../Context";
import TransactionDetails from "./TransactionDetails";
import { calcOrderTotal } from "../helpers/helpersApp";

export const Checkout = () => {
    const [account,setAccount] = useState({});
    const [cart,setCart] = useState({});
    const [orderTotal,setOrderTotal] = useState(0.0);
    const {getShoppingCart} = useContext(AccountContext);

    useEffect(() => {
        setCart(getShoppingCart());
        calcOrderTotal(cart,total => setOrderTotal(total));
    },[]);

    useEffect(() => {
        console.log("cart: ", cart);
    },[cart]);

    return <Box>
        <Grid2>
            {
                // cart
                cart.length && cart.map((c,i) => (
                    <TransactionDetails
                        key={i}
                        transaction={c}
                        isCheckout={true}
                    />
                ))
            }
            {
                // subtotal
                <Typography>
                    Subtotal: ${orderTotal}
                </Typography>
            }
            {
                // tax
            }
            {
                // handle payment
            }
            {
                // submit button
            }
        </Grid2>
    </Box>
}

export default Checkout;