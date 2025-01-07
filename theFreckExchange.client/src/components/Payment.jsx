import { Box, Grid2 } from "@mui/material";
import {useState} from "react";

export const Payment = () => {
    const [account,setAccount] = useState({});
    const [cart,setCart] = useState({});

    return <Box>
        <Grid2>
            {
                // cart
            }
            {
                // subtotal
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

export default Payment;