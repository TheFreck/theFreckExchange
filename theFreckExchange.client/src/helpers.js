import axios from "axios";

const productApi = axios.create({
    baseURL: `https://thefreckexchange-cvgkagadbkcedyfm.westus2-01.azurewebsites.net/Product`
});

const accountApi = axios.create({
    baseURL: `https://thefreckexchange-cvgkagadbkcedyfm.westus2-01.azurewebsites.net/Account`
});

export const Helpers = {
    getCreds: () => ({
        username: localStorage.getItem("username"),
        loginToken: localStorage.getItem("loginToken"),
        adminToken: localStorage.getItem("permissions.admin"),
        userToken: localStorage.getItem("permissions.user")
    }),
    getProductsAsync: async (cb) => {
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
    },
    getItemsAsync: async (prod, cb) => {
        await productApi.get(`items/${prod}`)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
    },
    getAvailableAttributesAsync: async (product, cb) => {
        await productApi.get(`items/availableAttributes/${product}`)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
    },
    createProductAsync: async ({ name, description, attributes, price, images }, cb) => {
        this.readImagesAsync(images, ready => {
            let data = [];
            for (var i = 0; i < ready.length; i++) {
                data.push(window.btoa([ready[i]]));
            }
            productApi.post(`create`, { name, description, price, attributes, credentials: this.getCreds(), imageBytes:data})
                .then(yup => {
                    getProductsAsync(prods => {
                        setProducts(prods);
                        cb();
                    });
                })
                .catch(nope => console.error(nope));
        })
    },
    readImagesAsync: async (images, cb) => {
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
    },
    createItemsAsync: async ({ item, quantity, attributes }) => {
        item.credentials = this.getCreds();
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
    },
    updateItemsAsync: (item, cb) => {
        productApi.put("modify/product", item)
            .then(yup => {
                console.info("updated: ", yup.data);
                cb(item);
            })
            .catch(nope => console.error(nope));
    },
    purchaseItemAsync: async (item, qty) => {
        productApi.delete("item/buy")
            .then(yup => {
                console.info("purchased: ", yup.data);
            })
            .catch(nope => console.error(nope));
    },
    login: (userName,password,cb) => {
        accountApi.post(`login/`,{
            email: userName.replace("@", "%40"),
            password: password
        })
        .then(yup => {
            localStorage.setItem("username", yup.data.username)
            localStorage.setItem("loginToken",yup.data.loginToken);
            let admin = yup.data.permissions.find(p => p.type === 0);
            if(admin !== undefined){
                localStorage.setItem("permissions.admin",admin.token);
            }
            let user =  yup.data.permissions.find(p => p.type === 1);
            if(user !== undefined){
                localStorage.setItem("permissions.user",user.token);
            }
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    },
    logout: (cb) => {
        localStorage.clear();
        accountApi.post(`logout/${userAcct.username}`)
        .then(yup => {
            cb();
            // setUserAcct({});
            // setView(viewEnum.home);
        })
        .catch(nope => console.error(nope));
    },
    createAccount: ({ name,email,username,password,permissions }) => {
        accountApi.post(`createAccount/${name}/${email}`,{username,password,permissions})
            .then(yup => {
                console.info("account created: ", yup.data);
            })
            .catch(nope => console.error(nope));
    }
}

export default Helpers;