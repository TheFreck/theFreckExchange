import { Box, Button, Modal, TextField } from "@mui/material";
import react, { useContext, useEffect, useRef, useState } from "react";
import { AccountContext } from "../Context";
import NewAccount from "./Account/NewAccount";

export const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newAccountModal,setNewAccountModal] = useState(false);
    const {login} = useContext(AccountContext);
    const modalRef = useRef();

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
                onChange={u => setUsername(u.target.value)}
            />
            <br />
            <br />
            <TextField
                type="password"
                label="Password"
                onChange={p => setPassword(p.target.value)}
            />
            <br />
            <br />
            <Button onClick={() => login(username,password)} variant="contained">Login</Button>
        </Box>
        <Button onClick={() => setNewAccountModal(true)} variant="text">Create Account</Button>
        <Modal
            open={newAccountModal}
            onClose={() => setNewAccountModal(false)}
            ref={modalRef}
        >
            <Box>
                <NewAccount  newAccountModal={newAccountModal} setNewAccountModal={setNewAccountModal} />
            </Box>
        </Modal>
    </div>
}

export default Login;