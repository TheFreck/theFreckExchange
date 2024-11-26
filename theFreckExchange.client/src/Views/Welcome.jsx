import { Box, Button, TextField, Typography } from "@mui/material";
import react, { useCallback, useContext, useEffect, useState } from "react";
import { AccountContext, ProductContext } from "../Context";
import axios from "axios";
import StoreFront from "./StoreFront";
import Store from "./User/Store";
import CreateProduct from "./Product/CreateProduct";
import ModifyProduct from "./Product/ModifyProduct";
import CreateItems from "./Item/CreateItems";
import SiteConfiguration from "./Admin/SiteConfig";

export const Welcome = () => {
    const {userView,setUserView,userEnum} = useContext(AccountContext);
    const [products, setProducts] = useState([]);
    const [ready, setReady] = useState(false);
    const [config,setConfig] = useState({});

    const siteApi = axios.create({
        baseURL: `https://localhost:7299/Site`
    });

    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });

    useEffect(() => {
        getConfigurationAsync(configs => {
            setConfig(configs);
            getProductsAsync(prods => {
                setProducts(prods);
                setReady(true);
            })
        })
    }, []);

    // **********SITE*CONFIG************
    const getConfigurationAsync = async (cb) => {
        await siteApi.get("config")
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const createConfigurationAsync = async (cb) => {
        await siteApi.post("config/set")
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const updateConfigurationAsync = async (cb) => {
        await siteApi.put("config/update")
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    // **********PRODUCT**************
    const getProductsAsync = async (cb) => {
        await productApi.get()
            .then(yup => {
                let prods = [];
                for (let prod of yup.data) {
                    let imageObjects = [];
                    for (let image of prod.imageBytes) {
                        let bytes = image;
                        imageObjects.push({
                            bytes
                        })
                    }
                    prod.imageBytes = imageObjects;
                    prods.push(prod);
                }
                cb(prods);
            })
            .catch(nope => console.error(nope));
    }

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

    // **********ITEM*****************
    const getItemsAsync = async (prod, cb) => {
        await productApi.get(`items/${prod}`)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
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

    // *************ATTRIBUTES*************
    const getAvailableAttributesAsync = async (product, cb) => {
        await productApi.get(`items/availableAttributes/${product}`)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    // *********CREDS**********************
    const getCreds = () => ({
        username: localStorage.getItem("username"),
        loginToken: localStorage.getItem("loginToken"),
        adminToken: localStorage.getItem("permissions.admin"),
        userToken: localStorage.getItem("permissions.user")
    });

    // ***************IMAGES****************
    const uploadImages = (images) => {
        const blobs = images.map(im => im.blob);
        readImagesAsync(blobs, isReady => {
            let formData = new FormData();
            for (var i = 0; i < isReady.length; i++) {
                let blobby = new Blob([isReady[i]]);
                formData.append("images",blobby,images[i].filename);
            }

            productApi.post("images/upload",formData)
            .then(yup => {
                console.log("uploaded: ", yup.data);
            })
            .catch(nope => console.error(nope));
        });
    }
    
    const getImages = async (e,cb) => {
        let targetImages = [];
        for (var i = 0; i < e.target.files.length; i++) {
            e.target.files[i].filename = e.target.files[i].name;
            targetImages.push(URL.createObjectURL(e.target.files[i]));
        }
        cb(targetImages);
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

    const created = () => {
        console.log("created");
    }
    
    const CreateItemsCallback = useCallback(() => <CreateItems products={products} />,[products]);

    const WelcomeCallback = useCallback(() => {
        if (ready) return (
            <>
                {userView !== userEnum.siteConfig && <StoreFront config={config} />}
                {/* {check local storage against server} */}

                {userView === userEnum.createProduct && localStorage.getItem("permissions.admin") !== null && <CreateProduct created={created} />}
                {userView === userEnum.createItems && localStorage.getItem("permissions.admin") !== null && <CreateItemsCallback />}
                {userView === userEnum.updateProduct && localStorage.getItem("permissions.admin") !== null && <ModifyProduct />}
                {userView === userEnum.siteConfig && localStorage.getItem("permissions.admin") !== null && <SiteConfiguration />}
                
                {userView === userEnum.shop && localStorage.getItem("permissions.user") !== null && <Store />}
                {userView === userEnum.viewAccount && localStorage.getItem("permissions.user") !== null && <div>Placeholder for account view</div>}
                
            </>)
        else return;
    }, [products, ready]);

    return <ProductContext.Provider 
        value={{ config, 
                products, 
                ready, 
                setReady, 
                getProductsAsync, 
                getItemsAsync, 
                createProductAsync, 
                createItemsAsync, 
                getAvailableAttributesAsync, 
                updateItemsAsync, 
                purchaseItemAsync,
                getImages,
                uploadImages,
                createConfigurationAsync,
                updateConfigurationAsync
            }}
        >

        <WelcomeCallback />
    </ProductContext.Provider>

}

export default Welcome;