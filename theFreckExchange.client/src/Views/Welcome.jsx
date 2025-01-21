import { Box, Button, TextField, Typography } from "@mui/material";
import react, { useCallback, useContext, useEffect, useState } from "react";
import { AccountContext } from "../Context";
import StoreFront from "./StoreFront";
import Store from "./User/Store";
import CreateProduct from "./Product/CreateProduct";
import ModifyProduct from "./Product/ModifyProduct";
import CreateItems from "./Item/CreateItems";
import SiteConfiguration from "./Admin/SiteConfig";
import {getConfigurationAsync,getProductsAsync} from "../helpers/helpersWelcome";
import AccountView from "./Account/AccountView";

export const Welcome = () => {
    const {userView,userEnum} = useContext(AccountContext);
    const [products, setProducts] = useState([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        getConfigurationAsync(figs => {
            if(figs.configId !== null && figs.configId !== undefined)
                localStorage.setItem("configId", figs.configId);
            if(figs.siteTitle !== null && figs.siteTitle !== undefined && figs.siteTitle !== "" && figs.siteTitle !== "undefined")
                localStorage.setItem("siteTitle", figs.siteTitle);
            if(figs.adminAccountId !== null && figs.adminAccountId !== undefined){
                getProductsAsync(prods => {
                    setProducts(prods);
                    setReady(true);
                });
            }
        });
    }, []);

    useEffect(() => {
        setReady(true);
    },[userView]);

    const WelcomeCallback = useCallback(() => {
        if (ready) return (
            <Box
                sx={{
                    height: "90vh",
                    color: "black",
                    paddingTop: "10vh"
                }}
            >
                {userView === userEnum.home && <StoreFront />}
                {/* {check local storage against server} */}

                {userView === userEnum.createProduct && localStorage.getItem("permissions.admin") !== null && <CreateProduct />}
                {userView === userEnum.createItems && localStorage.getItem("permissions.admin") !== null && <CreateItems />}
                {userView === userEnum.updateProduct && localStorage.getItem("permissions.admin") !== null && <ModifyProduct />}
                {userView === userEnum.siteConfig && localStorage.getItem("permissions.admin") !== null && <SiteConfiguration />}
                {userView === userEnum.shop && localStorage.getItem("permissions.user") !== null && <Store />}
                {userView === userEnum.viewAccount && localStorage.getItem("permissions.user") !== null && <AccountView />}
                
            </Box>
            )
        else return;
    }, [products, ready, userView]);

    return <WelcomeCallback />
}

export default Welcome;