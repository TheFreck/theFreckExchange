import { Box, Button, Modal, TextField } from "@mui/material";
import react, { useContext, useEffect, useRef, useState } from "react";
import { AccountContext } from "../Context";
import NewAccount from "./NewAccount";

export const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [newAccountModal,setNewAccountModal] = useState(false);
    const accountContext = useContext(AccountContext);

    return <div>
        <h1>Welcome To The Store</h1>
        <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ border: "solid", paddingTop: "5vh", paddingBottom: "5vh" }}
        >
            <TextField
                label="User Name"
                onChange={u => setUserName(u.target.value)}
            />
            <br />
            <br />
            <TextField
                label="Password"
                onChange={p => setPassword(p.target.value)}
            />
            <br />
            <br />
            <Button onClick={() => accountContext.login(userName,password)} variant="contained">Login</Button>
        </Box>
        <Button onClick={() => setNewAccountModal(true)} variant="text">Create Account</Button>
        <Modal
            open={newAccountModal}
            onClose={() => setNewAccountModal(false)}
        >
            <NewAccount newAccountModal={newAccountModal} setNewAccountModal={setNewAccountModal} />
        </Modal>
    </div>
}

export default Login;