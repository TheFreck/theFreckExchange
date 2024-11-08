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
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    }

    const getAvailableAttributesAsync = async (product,cb) => {
        await productApi.get(`items/availableAttributes/${product}`)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    }

    const createProductAsync = async ({name,description,attributes,price, images},cb) => {
        console.log("attributes: ", attributes);
        productApi.post(`create`,{name,description,price,attributes,credentials:{
            username: localStorage.getItem("username"),
            loginToken: localStorage.getItem("loginToken"),
            adminToken: localStorage.getItem("permissions.admin"),
            userToken: localStorage.getItem("permissions.user")
        }})
            .then(yup => {
                readImagesAsync(images,ready => {
                    console.log("ready: ", ready);
                    let data = new FormData();
                    for(var i=0; i<ready.length; i++){
                        data.append("images",new Blob([ready[i]]));
                    }
                    productApi.post(`image/uploadImage/${yup.data.productId}`,
                        data
                    )
                    .then(() => {
                        getProductsAsync(prods => {
                            setProducts(prods);
                            cb();
                        });
                    })
                    .catch(nope => console.error(nope));
                })
            })
            .catch(nope => console.error(nope));
    }

    const readImagesAsync = async (images, cb) => {
        let base64Images = [];
        for (var image of images) {
            base64Images.push(await fetch(image)
                .then(res => res.blob())
                .then(blob => {
                    console.log("welcome blob: ", blob);
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    return new Promise(resolve => {
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                    })
                }));
            if (base64Images.length === images.length) {
                cb(base64Images);
            }
        }
    }

    const createItemsAsync = async ({item,quantity,image}) => {
        item.credentials = {
            username: localStorage.getItem("username"),
            loginToken: localStorage.getItem("loginToken"),
            adminToken: localStorage.getItem("permissions.admin"),
            userToken: localStorage.getItem("permissions.user")
        }
        item.sku = "";
        item.image = image;
        productApi.post(`items/create/${quantity}`,item)
        .then(yup => {
            console.log("created: ", yup.data);
        })
        .catch(nope => console.error(nope));
    }
    
    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });

    const src = "data:image/png;base64,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"

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

    return <ProductContext.Provider value={{products,getProductsAsync,getItemsAsync,createProductAsync,createItemsAsync,getAvailableAttributesAsync}}>
            <WelcomeCallback />
        </ProductContext.Provider>

}

export default Welcome;