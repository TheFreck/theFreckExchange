import { Box, TextField } from "@mui/material";
import react, { useCallback, useContext, useEffect, useState } from "react";
import { AccountContext, ProductContext } from "../Context";
import AdminView from "./AdminView";
import UserView from "./UserView";
import axios from "axios";

export const Welcome = () => {
    const accountContext = useContext(AccountContext);
    const [userPermissions, setUserPermissions] = useState(new Set());
    const [products, setProducts] = useState(new Set());
    const [ready, setReady] = useState(false);

    useEffect(() => {
        getProductsAsync(prods => {
            setProducts(prods);
            setReady(true);
        })
    },[]);
    
    const getProductsAsync = async (cb) => {
        await productApi.get()
        .then(yup => {
            cb(new Set(yup.data));
        })
        .catch(nope => console.error(nope));
    }

    const getItemsAsync = async (prod,cb) => {
        await productApi.get(`items/${prod}`)
            .then(yup => {
                console.log("items returned: ", yup.data);
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const createProductAsync = async ({name,description,price}) => {
        console.log(`name: ${name}; price: $${price}; description: ${description}`);
        productApi.post(`create`,{name,description,price,credentials:{
            username: accountContext.userAcct.username,
            loginToken: localStorage.getItem("loginToken"),
            adminToken: localStorage.getItem("permissions.admin"),
            userToken: localStorage.getItem("permissions.user")
        }})
            .then(yup => {
                console.log("yup: ", yup);
            })
            .catch(nope => console.error(nope));
    }

    const createItemsAsync = async (items) => {

    }
    
    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });

    const WelcomeCallback = useCallback(() => {
        if(ready) return(
        <>
            <h1>Welcome</h1>
            {/* {check local storage against server} */}
            {localStorage.getItem("permissions.admin") !== null && <AdminView />}
            {localStorage.getItem("permissions.user") !== null && <UserView />}
        </>)
        else return;
    }, [userPermissions,products,ready]);

    return <ProductContext.Provider value={{products,getProductsAsync,getItemsAsync,createProductAsync,createItemsAsync}}>
            <WelcomeCallback />
        </ProductContext.Provider>
}

export default Welcome;