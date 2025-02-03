import { Box, Button, Grid2, Typography } from "@mui/material";
import {useContext, useEffect, useState} from "react";
import { AccountContext } from "../Context";
import TransactionDetails from "./TransactionDetails";
import { calcOrderTotal,currencyFormat } from "../helpers/helpersApp";
import { purchaseItemsAsync } from "../helpers/helpersWelcome";

export const Checkout = ({completed}) => {
    const [cart,setCart] = useState({});
    const [orderTotal,setOrderTotal] = useState(0.0);
    const [salesTax,setSalesTax] = useState(.05);
    const [paid,setPaid] = useState(false);
    const {getShoppingCart,resetCart} = useContext(AccountContext);

    useEffect(() => {
        let shoppingCart = getShoppingCart();
        setCart(shoppingCart);
        calcOrderTotal(shoppingCart,total => setOrderTotal(total));
    },[]);

    return <Grid2
        sx={{display: "flex", flexDirection: "column"}}
    >
        <Grid2
            sx={{
                height: "60vh",
                overflowY: "scroll"
            }}
        >
            {
                cart.length && cart.map((c,i) => (
                    <TransactionDetails
                    key={i}
                    transaction={c}
                    isCheckout={true}
                    />
                ))
            }
        </Grid2>
        <Grid2 container
            sx={{
                marginLeft: "5vw",
                borderTop: "solid",
                borderWidth: "1px",
                marginTop: "1vh",
                paddingTop: "1vh"
            }}
        >
            <Grid2 size={1}>
                <Typography>
                    Subtotal: 
                </Typography>
            </Grid2>
            <Grid2 >
                <Typography>
                    {currencyFormat.format(orderTotal)}
                </Typography>
            </Grid2>
        </Grid2>
        <Grid2 container
            sx={{marginLeft: "5vw"}}
        >
            <Grid2 size={1}>
                <Typography>
                    Tax rate: 
                </Typography>
            </Grid2>
            <Grid2 >
                <Typography>
                    {salesTax*100}%
                </Typography>
            </Grid2>
        </Grid2>
        <Grid2 container
            sx={{marginLeft: "5vw"}}
            >
            <Grid2 size={1}>
                <Typography>
                    Order Total: 
                </Typography>
            </Grid2>
            <Grid2 >
                <Typography>
                    {currencyFormat.format(orderTotal*(1+salesTax))}
                </Typography>
            </Grid2>
        </Grid2>
        <Grid2 container
            sx={{marginLeft: "5vw"}}
        >
            {!paid && 
                <Button
                    onClick={() => setPaid(!paid)}
                >
                    Submit Payment
                </Button>}
            {paid &&
                <Button
                    onClick={() => purchaseItemsAsync(cart,() => {
                        completed();
                    })}
                >
                    Confirm Purchase
                </Button>
            }
        </Grid2>
    </Grid2>
}

export default Checkout;