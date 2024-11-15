import react, { useContext, useState } from "react";
import { AccountContext } from "../../Context";
import { Box, Button, Checkbox, Grid2, TextField, Typography } from "@mui/material";

export const NewAccount = ({newAccountModal,setNewAccountModal}) => {
    const {createAccount} = useContext(AccountContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [permissions, setPermissions] = useState(new Set());
    const permissionsEnum = {admin:0,user:1};

    const userPermission = () => {
        if(permissions.has(permissionsEnum.user)){
            permissions.delete(permissionsEnum.user);
        }
        else{
            permissions.add(permissionsEnum.user);
        }
    }

    const adminPermission = () => {
        if(permissions.has(permissionsEnum.admin)){
            permissions.delete(permissionsEnum.admin);
        }
        else{
            permissions.add(permissionsEnum.admin);
        }
    }

    return <Box
        sx={{ width: "23vw", border: "solid", background: "white", display: "flex", margin: "auto", marginTop: "20vh", paddingTop: "5vh", paddingBottom: "10vh"}}
    >
        
        <Grid2 container spacing={2}>
            <Grid2 size={12}
                sx={{display: "flex", justifyContent: "center"}}
            >
                <Typography
                    align="center"
                    variant="h2"
                >
                    New Account
                </Typography>
            </Grid2>
            <Grid2 size={12}
                sx={{display: "flex", justifyContent: "center"}}
            >
                <TextField
                    label="Name"
                    type="text"
                    onChange={c => setName(c.target.value)}
                    value={name}
                />
            </Grid2>
            <Grid2 size={12}
                sx={{display: "flex", justifyContent: "center"}}
            >
                <TextField
                    label="Email"
                    type="email"
                    onChange={c => setEmail(c.target.value)}
                    value={email}
                />
            </Grid2>
            <Grid2 size={12}
                sx={{display: "flex", justifyContent: "center"}}
            >
                <TextField
                    label="Username"
                    type="text"
                    onChange={c => setUsername(c.target.value)}
                    value={username}
                />
            </Grid2>
            <Grid2 size={12}
                sx={{display: "flex", justifyContent: "center"}}
            >
                <TextField
                    label="Password"
                    type="password"
                    onChange={p => setPassword(p.target.value)}
                    value={password}
                />
            </Grid2>
            <Grid2 size={12}
                sx={{display:"flex", flexDirection:"column"}}
            >
                <Grid2 size={12}>
                    <Typography
                        align="center"
                        variant="h3"
                    >
                        Permissions
                    </Typography>
                </Grid2>
                <Grid2 size={12}
                    sx={{display:"flex", flexDirection:"row", padding:"0 7vw"}}
                >
                    <Grid2 size={6} 
                        sx={{textAlign:"center"}}
                    >
                        <Typography>User</Typography>
                        <Checkbox label="User" onClick={userPermission} />
                    </Grid2>
                    <Grid2 size={6}
                        sx={{textAlign:"center"}}
                    >
                        <Typography>Admin</Typography>
                        <Checkbox label="Admin" onClick={adminPermission} />
                    </Grid2>
                </Grid2>
            </Grid2>
            <Grid2 size={12}
                sx={{display: "flex", justifyContent: "center"}}
            >
                <Button
                    onClick={() => {
                        var perms = [];
                        for(var permission of permissions){
                            perms.push({ type:permission });
                        }
                        createAccount({ name, email, username, password, permissions:perms });
                        setNewAccountModal(false);
                    }}
                >
                    Submit
                </Button>
            </Grid2>
        </Grid2>
    </Box>
}

export default NewAccount;