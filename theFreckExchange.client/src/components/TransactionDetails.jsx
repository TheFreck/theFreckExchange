import { Box, Grid2, TextField, Typography } from "@mui/material";


export const TransactionDetails = ({transaction,updateQty}) => {
    
    return <Box
        sx={{display: "flex", flexDirection: "row", border: "solid", padding: "5vh 5vw"}}
    >
        <Grid2 container spacing={1}>
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
                        key={i}>{a.type}: {a.value}
                    </Typography>
                ))}
                <Grid2
                    sx={{display: "flex", flexDirection: "row", alignItems: "center"}}
                >
                    <Typography
                        sx={{padding: "1em"}}
                    >
                        {transaction.item.price}
                    </Typography>
                    <Typography sx={{paddingRight: "1em"}}>X</Typography>
                    <TextField
                        size="small"
                        sx={{width: "3em"}}
                        value={transaction.quantity}
                        onChange={updateQty}
                    >
                        Qty: {transaction.quantity}
                    </TextField>
                    <Typography sx={{padding: "1em"}}>=</Typography>
                    <Typography>
                        ${transaction.totalPrice}
                    </Typography>
                </Grid2>
            </Grid2>
        </Grid2>
    </Box>
}

export default TransactionDetails;