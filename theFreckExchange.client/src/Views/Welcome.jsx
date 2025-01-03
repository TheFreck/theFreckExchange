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
            getBackgroundAsync(async backgrnd => {
                setConfig(figs);
                if (backgrnd) {
                    let img = await fetch(window.atob(backgrnd.image));
                    let blob = await img.blob();
                    let url = URL.createObjectURL(blob);
                    setBackground(url);
                }
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
        });
    }, []);

    const deleteConfigurationAsync = async (configId,cb) => {
        await siteApi.delete(`config`)
            .then(yup => {
                console.log("deleted: ", yup.data);
                localStorage.setItem("configId","")
                localStorage.setItem("siteTitle","");
                setConfig(yup.data);
                cb(yup.data);
            })
            .catch(nope => {
                console.error(nope)
                cb(nope);
            });
    }

    const createProductAsync = async ({ name, description, attributes, price, images }, cb) => {
        productApi.post(`create`, { name, description, price, attributes, credentials: getCreds(), imageReferences: images})
            .then(yup => {
                getProductsAsync(prods => {
                    setProducts(prods);
                    cb();
                });
            })
            .catch(nope => {
                console.error(nope)
                cb(nope);
            });
    }

    // **********ITEM*****************
    const getItemsAsync = async (prod, cb) => {
        await productApi.get(`items/${prod}`)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => {
                console.error(nope);
                cb(nope);
            });
    }

    const createItemsAsync = async ({ item, quantity, attributes }) => {
        item.credentials = getCreds();
        item.attributes = attributes;
        item.sku = "";
        
        productApi.post(`items/create/${quantity}`, item)
            .then(yup => {
                console.info("item created: ", yup.data);
            })
            .catch(nope => {
                console.error(nope);
                cb(nope);
            });
    }

    const updateItemsAsync = (item, cb) => {
        productApi.put("modify/product", item)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
        cb(item);
    }

    const purchaseItemAsync = async (product, qty) => {
        let item = {
            name: product.name,
            credentials: getCreds(),
            attributes: product.attributes,
            sellerId: ""
        }
        console.log("item: ", item);
        productApi.post(`item/buy/${qty}`,{
            name: product.name,
            credentials: getCreds(),
            attributes: product.attributes,
            sellerId: ""
        })
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
            .catch(nope => {
                console.error(nope);
                cb(nope);
            });
    }

    // *********CREDS**********************
    const getCreds = () => ({
        username: localStorage.getItem("username"),
        loginToken: localStorage.getItem("loginToken"),
        adminToken: localStorage.getItem("permissions.admin"),
        userToken: localStorage.getItem("permissions.user")
    });

    // ***************IMAGES****************
    const uploadImagesAsync = (images,cb) => {
        const blobs = images.map(im => im.blob);
        readImagesAsync(blobs, isReady => {
            let formData = new FormData();
            for (var i = 0; i < isReady.length; i++) {
                let blobby = new Blob([isReady[i]]);
                formData.append("images",blobby,images[i].filename);
            }

            productApi.post("images/upload",formData)
            .then(yup => {
                // console.log("uploaded: ", yup.data);
                cb(yup.data);
            })
            .catch(nope => {
                console.error(nope);
                cb(nope);
            });
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

    const getImagesFromReferencesAsync = (refs,cb) => {
        productApi.post("imageItems",refs)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    }

    // const getBackground = async (cb) => {
    //     await siteApi.get(`config/background`)
    //         .then(yup => {
    //             cb(yup.data);
    //         })
    //         .catch(nope => {
    //             console.error(nope);
    //             cb(nope);
    //         })
    // }

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
        console.info("created");
    }

    useEffect(() => {
        setReady(true);
    },[userView]);

    const WelcomeCallback = useCallback(() => {
        if (ready) return (
            <Box
                sx={{
                    backgroundImage: `url(${background})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundColor: "rgba(255,255,255,.2)",
                    backgroundBlendMode: "lighten",
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
                setReady, 
                getProductsAsync, 
                getItemsAsync, 
                createProductAsync, 
                createItemsAsync, 
                getAvailableAttributesAsync, 
                updateItemsAsync, 
                purchaseItemAsync,
                getImages,
                uploadImagesAsync,
                readImagesAsync,
                getConfigurationAsync,
                deleteConfigurationAsync,
                getImagesFromReferencesAsync
            }}
        >
        <WelcomeCallback />
    </ProductContext.Provider>

}

export default Welcome;