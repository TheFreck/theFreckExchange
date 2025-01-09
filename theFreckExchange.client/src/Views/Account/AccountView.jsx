import { Accordion, AccordionDetails, AccordionSummary, Box, Grid2, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {getAccountAsync} from "../../helpers/helpersApp";
import TransactionDetails from "../../components/TransactionDetails";

export const AccountView = () => {
    const [account,setAccount] = useState({});
    const [transactionHistory,setTransactionHistory] = useState([]);

    useEffect(() => {
        getAccountAsync(localStorage.getItem("username"), acct => {
            setAccount(acct);
            setTransactionHistory(acct.history.sort((a,b) => Date.parse(b.transactionDate)-Date.parse(a.transactionDate)));
        });
    },[]);

    // name
    // email
    // current balance
    // purchase history
    // browsing history
    // account permissions
    // account history

    return <Box
            sx={{
                width: "80vw",
                margin: "auto",
            }}
    >
        <Typography
            variant="h3"
        >
            {account.name}
        </Typography>
        <Typography>
            {account.email}
        </Typography>
        <Typography>
            Account since: {
                (new Date(account.dateOpened).getMonth()%12+1) + "/" + new Date(account.dateOpened).getDate() + "/" + new Date(account.dateOpened).getFullYear()
            }
        </Typography>
        <Accordion
        >
            <AccordionSummary>
                Transaction History
            </AccordionSummary>
            <AccordionDetails>
            {
                account.history && account.history.map((h,i) => (
                    <Accordion
                        key={i}
                    >
                        {console.log("h: ", h)}
                        <AccordionSummary>
                            {h.item.name} {new Date(h.transactionDate).getMonth()%12+1}/{new Date(h.transactionDate).getDate()}/{new Date(h.transactionDate).getFullYear()}
                        </AccordionSummary>
                        <AccordionDetails>
                            <TransactionDetails
                                transaction={h}
                            />
                        </AccordionDetails>
                    </Accordion>
                ))
            }
            </AccordionDetails>
        </Accordion>
    </Box>
}

export default AccountView;