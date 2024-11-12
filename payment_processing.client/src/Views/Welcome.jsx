import { Box, TextField } from "@mui/material";
import react, { useCallback, useContext, useEffect, useState } from "react";
import { AccountContext, ProductContext } from "../Context";
import AdminView from "./Admin/AdminView";
import UserView from "./User/UserView";
import axios from "axios";

export const Welcome = () => {
    const accountContext = useContext(AccountContext);
    const [userPermissions, setUserPermissions] = useState(new Set());
    const [products, setProducts] = useState(new Set());
    const [ready, setReady] = useState(false);

    useEffect(() => {
        getProductsAsync(prods => {
            for(let prod of prods){
                let imageObjects = [];
                for(let image of prod.imageBytes){
                    imageObjects.push({
                        bytes: image
                    })
                }
                prod.imageBytes = imageObjects;
            }
            setProducts(prods);
            setReady(true);
        })
    },[]);
    
    const getProductsAsync = async (cb) => {
        await productApi.get()
        .then(yup => {
            for(let prod of yup.data){
                let imageObjects = [];
                for(let image of prod.imageBytes){
                    imageObjects.push({
                        bytes: image
                    })
                }
                prod.imageBytes = imageObjects;
            }
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
        productApi.post(`create`,{name,description,price,attributes,credentials:{
            username: localStorage.getItem("username"),
            loginToken: localStorage.getItem("loginToken"),
            adminToken: localStorage.getItem("permissions.admin"),
            userToken: localStorage.getItem("permissions.user")
        }})
            .then(yup => {
                readImagesAsync(images,ready => {
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

    const createItemsAsync = async ({item,quantity, attributes}) => {
        item.credentials = {
            username: localStorage.getItem("username"),
            loginToken: localStorage.getItem("loginToken"),
            adminToken: localStorage.getItem("permissions.admin"),
            userToken: localStorage.getItem("permissions.user")
        }
        item.attributes = attributes;
        item.sku = "";
        const imagesBytes = [];
        for(var imageBytes of item.imageBytes){
            imagesBytes.push(imageBytes.bytes);
        }
        item.imageBytes = imagesBytes;
        productApi.post(`items/create/${quantity}`,item)
        .then(yup => {
            console.info("item created: ", yup.data);
        })
        .catch(nope => console.error(nope));
    }

    const updateItemsAsync = (item,cb) => {
        productApi.put("modify/product",item)
        .then(yup => {
            console.info("updated: ", yup.data);
        })
        .catch(nope => console.error(nope));
        cb(item);
    }

    const purchaseItemAsync = async (item,qty) => {
        productApi.delete("item/buy")
        .then(yup => {
            console.info("purchased: ", yup.data);
        })
        .catch(nope => console.error(nope));
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

    return <ProductContext.Provider value={{products,getProductsAsync,getItemsAsync,createProductAsync,createItemsAsync,getAvailableAttributesAsync, updateItemsAsync, purchaseItemAsync}}>
            <WelcomeCallback />
        </ProductContext.Provider>

}

export default Welcome;