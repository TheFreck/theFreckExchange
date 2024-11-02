import { Box, Button, TextField } from "@mui/material";
import react, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../Context";

export const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const accountContext = useContext(AccountContext);

    const login = accountContext[0];

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
                <Button onClick={() => login(userName,password)} variant="contained">Login</Button>
        </Box>
        <Button variant="text">Create Account</Button>
    </div>
}

export default Login;