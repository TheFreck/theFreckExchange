import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Context";
import { useNavigate } from "react-router";
import NewAccount from "./Account/NewAccount";


export const Login = (props) => {
    const {login,isMobile} = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newAccountModal,setNewAccountModal] = useState(false);
    const modalRef = useRef();
    const navigate = useNavigate();

    const handleLogin = () => {
        login(username,password);
        navigate("/Home")
    }

    return <Box
        sx={{
            width: `${isMobile ? "100vw" : "80vw"}`,
            height: "80vh",
            marginLeft: `${isMobile ? 0 : "10vw"}`,
            marginRight: `${isMobile ? 0 : "10vw"}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}
    >
        <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ 
                border: `${isMobile ? "" : "solid"}`,
                width: `${isMobile ? "90vw" : "60vw"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: `${isMobile ? 0 : "5vh"}`
            }}
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
            <Button onClick={handleLogin} variant="contained">Login</Button>
            <br />
            <Typography>No Account?</Typography>
            <Button onClick={() => setNewAccountModal(true)} variant="text">Create Account</Button>
        </Box>
        <Modal
            open={newAccountModal}
            onClose={() => setNewAccountModal(false)}
            ref={modalRef}
        >
            <Box>
                <NewAccount  newAccountModal={newAccountModal} setNewAccountModal={setNewAccountModal} />
            </Box>
        </Modal>
    </Box>
}

export default Login;