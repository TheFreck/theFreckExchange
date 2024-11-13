import { Box, Button, TextField, Typography } from "@mui/material";
import react, { useCallback, useContext, useEffect, useState } from "react";
import { AccountContext, ProductContext } from "../Context";
// import AdminView from "./Admin/AdminView";
// import UserView from "./User/UserView";
import axios from "axios";
import StoreFront from "./StoreFront";
// import Helpers from "../helpers";
import Store from "./User/Store";
import CreateProduct from "./Product/CreateProduct";
import ModifyProduct from "./Product/ModifyProduct";
import CreateItems from "./Item/CreateItems";

const viewEnum = {
    none: 0,
    admin: 1,
    user: 2
}

export const Welcome = () => {
    const {adminView, setAdminView, adminEnum,userView,setUserView,userEnum} = useContext(AccountContext);
    const [products, setProducts] = useState(new Set());
    const [ready, setReady] = useState(false);
    const [view, setView] = useState(viewEnum.none);

    useEffect(() => {
        getProductsAsync(prods => {
            for (let prod of prods) {
                let imageObjects = [];
                for (let image of prod.imageBytes) {
                    imageObjects.push({
                        bytes: image
                    })
                }
                prod.imageBytes = imageObjects;
            }
            setProducts(prods);
            setReady(true);
        })
    }, []);

    const getProductsAsync = async (cb) => {
        await productApi.get()
            .then(yup => {
                for (let prod of yup.data) {
                    let imageObjects = [];
                    for (let image of prod.imageBytes) {
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

    const getItemsAsync = async (prod, cb) => {
        await productApi.get(`items/${prod}`)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const getAvailableAttributesAsync = async (product, cb) => {
        await productApi.get(`items/availableAttributes/${product}`)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const getCreds = () => ({
        username: localStorage.getItem("username"),
        loginToken: localStorage.getItem("loginToken"),
        adminToken: localStorage.getItem("permissions.admin"),
        userToken: localStorage.getItem("permissions.user")
    });

    const createProductAsync = async ({ name, description, attributes, price, images }, cb) => {
        readImagesAsync(images, ready => {
            let data = [];
            for (var i = 0; i < ready.length; i++) {
                data.push(window.btoa([ready[i]]));
            }
            productApi.post(`create`, { name, description, price, attributes, credentials: getCreds(), imageBytes:data})
                .then(yup => {
                    getProductsAsync(prods => {
                        setProducts(prods);
                        cb();
                    });
                })
                .catch(nope => console.error(nope));
        })
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

    const createItemsAsync = async ({ item, quantity, attributes }) => {
        item.credentials = getCreds();
        item.attributes = attributes;
        item.sku = "";
        const imagesBytes = [];
        for (var imageBytes of item.imageBytes) {
            imagesBytes.push(imageBytes.bytes);
        }
        item.imageBytes = imagesBytes;
        productApi.post(`items/create/${quantity}`, item)
            .then(yup => {
                console.info("item created: ", yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const updateItemsAsync = (item, cb) => {
        productApi.put("modify/product", item)
            .then(yup => {
                console.info("updated: ", yup.data);
            })
            .catch(nope => console.error(nope));
        cb(item);
    }

    const purchaseItemAsync = async (item, qty) => {
        productApi.delete("item/buy")
            .then(yup => {
                console.info("purchased: ", yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });

    const created = () => {
        console.log("created");
    }
    
    const CreateItemsCallback = useCallback(() => <CreateItems products={products} />,[products]);

    const WelcomeCallback = useCallback(() => {
        if (ready) return (
            <>
                {/* <Typography variant="h1" onClick={() => setView(viewEnum.none)}>Welcome</Typography> */}
                <StoreFront />
                {/* {check local storage against server} */}
                {/* {view === viewEnum.none && localStorage.getItem("permissions.admin") !== null && <Button variant="outlined" onClick={() => setView(viewEnum.admin)}>Admin View</Button>}
                {view === viewEnum.none && localStorage.getItem("permissions.user") !== null && <Button variant="outlined" onClick={() => setView(viewEnum.user)}>User View</Button>} */}
                {/* {adminView !== adminEnum.home && <AdminView />}
                {userView !== userEnum.home && <UserView />} */}

                {userView === userEnum.createProduct && localStorage.getItem("permissions.admin") !== null && <CreateProduct created={created} />}
                {userView === userEnum.createItems && localStorage.getItem("permissions.admin") !== null && <CreateItemsCallback />}
                {userView === userEnum.updateProduct && localStorage.getItem("permissions.admin") !== null && <ModifyProduct products={products} />}
                
                {userView === userEnum.shop && localStorage.getItem("permissions.user") !== null && <Store />}
                {userView === userEnum.viewAccount && localStorage.getItem("permissions.user") !== null && <div>Placeholder for account view</div>}
                
            </>)
        else return;
    }, [products, ready, view]);

    return <ProductContext.Provider value={{ products, getProductsAsync, getItemsAsync, createProductAsync, createItemsAsync, getAvailableAttributesAsync, updateItemsAsync, purchaseItemAsync }}>
        <WelcomeCallback />
    </ProductContext.Provider>

}

export default Welcome;