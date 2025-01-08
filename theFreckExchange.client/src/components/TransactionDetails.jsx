import { Box, Button, Grid2, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';


export const TransactionDetails = ({transaction,updateQty,removeFromCart,isCheckout}) => {
    const [qty,setQty] = useState(transaction.quantity);
    const [isDirty,setIsDirty] = useState(false);
    
    return <Box
        sx={{display: "flex", flexDirection: "row", borderBottom: "solid", padding: "2vh 5vw 0vh 5vw"}}
    >
        <Grid2 container spacing={1}>
            {!isCheckout &&
                <Tooltip
                    title="Remove item from Cart"
                    arrow
                >
                    <Button
                        sx={{margin: "0 auto auto 0"}}
                        onClick={() => {
                            removeFromCart(transaction,done => {
                                console.log("done: ", done);
                            })
                        }}
                    >
                        <CloseIcon />
                    </Button>
                </Tooltip>
            }
            <Grid2
                sx={{display: "flex", flexDirection: "column"}}
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
                <Grid2
                    sx={{display: "flex", flexDirection: "row", alignItems: "center"}}
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
                        ${transaction.item.price * qty}
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
            </Grid2>
        </Grid2>
    </Box>
}

export default TransactionDetails;