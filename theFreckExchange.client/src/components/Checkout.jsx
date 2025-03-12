import { Box, Button, Grid2, Typography } from "@mui/material";
import {useContext, useEffect, useState} from "react";
import { AuthContext } from "../Context";
import TransactionDetails from "./TransactionDetails";
import { calcOrderTotal,currencyFormat,purchaseItemsAsync } from "../helpers/helpers";
import { useNavigate } from "react-router";

export const Checkout = ({completed}) => {
    const {isMobile} = useContext(AuthContext);
    const [cart,setCart] = useState({});
    const [orderTotal,setOrderTotal] = useState(0.0);
    const [salesTax,setSalesTax] = useState(.05);
    const [paid,setPaid] = useState(false);
    const {getShoppingCart,resetCart} = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        let shoppingCart = getShoppingCart();
        setCart(shoppingCart);
        calcOrderTotal(shoppingCart,total => setOrderTotal(total));
    },[]);

    return <Grid2
        sx={{
            display: "flex", 
            flexDirection: "column", 
            marginTop: "10vh",
            width: "100vw",
            padding: "5vw"
        }}
    >
        <Typography
            variant="h4"
        >
            Checkout
            <hr/>
        </Typography>
        <Grid2
            sx={{
                maxHeight: "60vh",
                overflowY: "scroll",
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
                paddingTop: "1vh",
                width: `${isMobile ? "90vw" : "auto"}`
            }}
        >
            <Grid2 size={isMobile ? 5 : 1}>
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
            <Grid2 size={isMobile ? 5 : 1}>
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
            <Grid2 size={isMobile ? 5 : 1}>
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
                        navigate("/Home");
                    })}
                >
                    Confirm Purchase
                </Button>
            }
        </Grid2>
    </Grid2>
}

export default Checkout;