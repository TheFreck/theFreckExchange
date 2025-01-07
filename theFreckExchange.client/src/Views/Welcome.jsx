import { Box, Button, TextField, Typography } from "@mui/material";
import react, { useCallback, useContext, useEffect, useState } from "react";
import { AccountContext, ProductContext } from "../Context";
import StoreFront from "./StoreFront";
import Store from "./User/Store";
import CreateProduct from "./Product/CreateProduct";
import ModifyProduct from "./Product/ModifyProduct";
import CreateItems from "./Item/CreateItems";
import SiteConfiguration from "./Admin/SiteConfig";
import {getConfigurationAsync,getBackgroundAsync,getProductsAsync} from "../helpers/helpersWelcome";
import AccountView from "./Account/AccountView";

const configTemplate = {
    background: "",
    adminAccountId: "",
    categories: [
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""},
        {name:"",description:"",url:""}
    ],
    categoryTitle: "",
    imageFiles: [],
    siteTitle: ""
};

export const Welcome = () => {
    const {userView,userEnum} = useContext(AccountContext);
    const [products, setProducts] = useState([]);
    const [ready, setReady] = useState(false);
    const [config,setConfig] = useState(configTemplate);
    const [background,setBackground] = useState({});

    useEffect(() => {
        getConfigurationAsync(figs => {
            setConfig(figs);
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

    const created = () => {
        console.info("created");
    }

    useEffect(() => {
        setReady(true);
    },[userView]);

    const WelcomeCallback = useCallback(() => {
        if (ready) return (
            <Box
                sx={{
                    height: "100vh",
                    color: "black",
                    paddingTop: "10vh"
                }}
            >
                {userView === userEnum.home && <StoreFront />}
                {/* {check local storage against server} */}

                {userView === userEnum.createProduct && localStorage.getItem("permissions.admin") !== null && <CreateProduct created={created} />}
                {userView === userEnum.createItems && localStorage.getItem("permissions.admin") !== null && <CreateItems />}
                {userView === userEnum.updateProduct && localStorage.getItem("permissions.admin") !== null && <ModifyProduct />}
                {userView === userEnum.siteConfig && localStorage.getItem("permissions.admin") !== null && <SiteConfiguration />}
                {userView === userEnum.shop && localStorage.getItem("permissions.user") !== null && <Store />}
                {userView === userEnum.viewAccount && localStorage.getItem("permissions.user") !== null && <AccountView />}
                
            </Box>
            )
        else return;
    }, [products, ready, userView]);

    return <ProductContext.Provider 
            value={{ 
                config, 
                products, 
                ready,
                userView, 
                setReady
            }}
        >
        <WelcomeCallback />
    </ProductContext.Provider>

}

export default Welcome;