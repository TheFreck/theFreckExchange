import { Box, TextField } from "@mui/material";
import react, { useCallback, useContext, useEffect, useState } from "react";
import { AccountContext } from "../Context";
import AdminView from "./AdminView";
import UserView from "./UserView";

export const Welcome = () => {
    const accountContext = useContext(AccountContext);
    const [userPermissions, setUserPermissions] = useState([]);

    const WelcomeCallback = useCallback(() => <>
        <h1>Welcome</h1>
        {localStorage.getItem("permissions.admin") !== null && <AdminView />}
        {localStorage.getItem("permissions.user") !== null && <UserView />}
    </>, [userPermissions]);

    return <WelcomeCallback />
}

export default Welcome;