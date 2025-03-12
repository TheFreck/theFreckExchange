import { Box, Button, Grid2, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { currencyFormat } from "../helpers/helpers";
import { AuthContext } from "../Context";


export const TransactionDetails = ({transaction,updateQty,isCheckout}) => {
    const {isMobile,removeFromCart} = useContext(AuthContext);
    const [qty,setQty] = useState(transaction.quantity);
    const [isDirty,setIsDirty] = useState(false);
    
    return <Box
        sx={{
            // borderBottom: "solid", 
            width: `${isMobile ? "90vw" : "60vw"}`
        }}
    >
        <Grid2 container spacing={1}
            sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap"
            }}
        >
            {!isCheckout &&
                <Tooltip
                    title="Remove item from Cart"
                    arrow
                >
                    <Button
                        sx={{margin: "0 auto auto 0"}}
                        onClick={() => {
                            removeFromCart(transaction,done => {
                            })
                        }}
                    >
                        <CloseIcon />
                    </Button>
                </Tooltip>
            }
            <Grid2
                sx={{
                    display: "flex", 
                    flexDirection: "column",
                    width: "90vw",
                    padding: "0 5vw",
                }}
            >
                <Typography
                    variant="h5"
                >
                    Item: {transaction.item.name}
                </Typography>
                {transaction.item.attributes && transaction.item.attributes.map((a,i) => (
                    <Typography
                        sx={{marginLeft: "1ems"}}
                        key={i}
                    >
                        {a.type}: {a.value}
                    </Typography>
                ))}
            </Grid2>
        </Grid2>
        <Grid2
            sx={{
                display: "flex", 
                flexDirection: "row", 
                alignItems: "center",
                marginLeft: "5vw"
            }}
        >
            <Typography
                sx={{padding: "1em"}}
            >
                ${transaction.item.price}
            </Typography>
            <Typography sx={{paddingRight: "1em"}}>X</Typography>
            {!isCheckout && 
                <TextField
                    type="number"
                    size="small"
                    sx={{width: "4em"}}
                    value={qty}
                    onChange={q => {
                        setQty(q.target.value);
                        setIsDirty(true);
                    }
                    }
                />
            }
            {isCheckout &&
                <Typography>
                    {qty}
                </Typography>
            }
            <Typography sx={{padding: "1em"}}>=</Typography>
            <Typography>
                {currencyFormat.format(transaction.item.price * qty)}
            </Typography>
            {isDirty &&
                <Button
                    onClick={() => {
                        updateQty(transaction,parseInt(qty))
                        setIsDirty(false);
                    }}
                >
                    Update Quantity
                </Button>
            }
        </Grid2>
        <hr/>
    </Box>
}

export default TransactionDetails;