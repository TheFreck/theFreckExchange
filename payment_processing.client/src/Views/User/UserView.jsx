import react, { useCallback } from "react";
import StoreFront from "./StoreFront";
import { Box, Typography } from "@mui/material";

export const UserView = () => {

    const StorefrontCallback = useCallback(() => <StoreFront />,[]);

    return <Box>
            <Typography>User View</Typography>
            <StorefrontCallback />
        </Box>
}

export default UserView;