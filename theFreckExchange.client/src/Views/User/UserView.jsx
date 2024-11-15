import react, { useCallback } from "react";
import Store from "./Store";
import { Box, Typography } from "@mui/material";

export const UserView = () => {

    const StorefrontCallback = useCallback(() => <Store />,[]);

    return <Box>
            <Typography>User View</Typography>
            <StorefrontCallback />
        </Box>
}

// export default UserView;