import { Box, Button, TextField } from "@mui/material";
import react from "react";

export const LoginV2 = () => {

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
                    defaultValue={"email@email.com"}
                />
                <br />
                <br />
                <TextField
                    label="Password"
                    defaultValue={"user password"}
                />
                <br />
                <br />
                <Button variant="contained">Login</Button>
        </Box>
    </div>
}

export default LoginV2;