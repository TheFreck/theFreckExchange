import axios from "axios";


const getBaseURL = (cb) => {
    if(process.env.NODE_ENV === "development"){
        cb("https://localhost:7299");
    }
    else if(process.env.NODE_ENV === "production"){
        cb("");
    }
};

export const getConfigurationAsync = async (cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Site"
        });
        await api.get(`config`)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => {
            console.error(nope);
            cb(nope);
        });
    })
};

export const createConfigurationAsync = async (configTemplate,userAcct,cb) => {
    configTemplate.adminAccountId = userAcct.accountId;
    configTemplate.configId = localStorage.getItem("configId");
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Site"
        });
        await api.post("config/set",configTemplate)
        .then(yup => {
            localStorage.setItem("configId", yup.data.configId);
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    })
};

export const updateConfigurationAsync = async (fig,cb) => {
    await getConfigurationAsync(async conf => {
        getBaseURL(async url => {
            const api = axios.create({
                baseURL: url + "/Site"
            })
            await api.put(`config/update`,fig)
                .then(yup => {
                    setConfig(conf)
                    if(conf.siteTitle !== null && conf.siteTitle !== undefined && conf.siteTitle !== "")
                        localStorage.setItem("siteTitle", conf.siteTitle);
                    cb(conf);
                })
                .catch(nope => {
                    console.error(nope)
                    cb(nope);
                });
            });
        }
    );
};

export const deleteConfigurationAsync = async (configId,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Site"
        });
        await api.delete(`config`)
            .then(yup => {
                localStorage.setItem("configId","")
                localStorage.setItem("siteTitle","");
                setConfig(yup.data);
                cb(yup.data);
            })
            .catch(nope => {
                console.error(nope)
                cb(nope);
            }
        );
    });
};

export const getProductsAsync = async (cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Product"
        });
        await api.get()
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => {
            console.error(nope)
            cb(nope);
        });
    });
};

export const createProductAsync = async ({name, description, attributes, price, primaryImageReference, imageReferences},setProducts,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Product"
        })
        api.post(`create`, { name, description, price, attributes, credentials: getCreds(), imageReferences,primaryImageReference})
        .then(yup => {
            getProductsAsync(prods => {
                setProducts(prods);
                cb(yup.data);
            });
        })
        .catch(nope => {
            console.error(nope)
            cb(nope);
        });
    })
};

export const getItemsAsync = async (prod,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Product"
        });
        await api.get(`items/${prod}`)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => {
            console.error(nope);
            cb(nope);
        });
    })
};

export const createItemsAsync = async ({item,quantity,attributes}) => {
    getBaseURL(async url => {
        item.credentials = getCreds();
        item.attributes = attributes;
        item.sku = "";
        const api = axios.create({
            baseURL: url + "/Product"
        });
        api.post(`items/create/${quantity}`, item)
        .then(yup => {
            console.info("item created: ", yup.data);
        })
        .catch(nope => {
            console.error(nope);
            cb(nope);
        });
    })
};

export const updateItemsAsync = async (item,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Product"
        });
        api.put("modify/product", item)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => {
            console.error(nope)
            cb(item);
        });
    })
};

export const purchaseItemsAsync = async (cart,cb) => {
    let purchases = [];
    for(let item of cart){
        purchaseItemAsync(item.item,item.quantity,() => {
            purchases.push(item);
            if(purchases.length===cart.length) cb();
        });
    }
}

export const purchaseItemAsync = async (product,qty,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Product"
        });
        api.post(`item/buy/${qty}`,{
            name: product.name,
            credentials: getCreds(),
            attributes: product.attributes,
            sellerId: ""
        })
        .then(yup => {
            console.info("purchased: ", yup.data);
            cb();
        })
        .catch(nope => console.error(nope));
    })
};

export const getAvailableAttributesAsync = async (product,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Product"
        });
        await api.get(`items/availableAttributes/${product}`)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => {
            console.error(nope);
            cb(nope);
        });
    })
};

const getCreds = () => ({
    username: localStorage.getItem("username"),
    loginToken: localStorage.getItem("loginToken"),
    adminToken: localStorage.getItem("permissions.admin") ?? "notAdmin",
    userToken: localStorage.getItem("permissions.user")
});

export const uploadImagesAsync = async (images,cb) => {
    const blobs = images.map(im => im.blob);
    readImagesAsync(blobs, isReady => {
        let formData = new FormData();
        for (var i = 0; i < isReady.length; i++) {
            let blobby = new Blob([isReady[i]]);
            formData.append("images",blobby,images[i].filename);
        }
        getBaseURL(async url => {
            const api = axios.create({
                baseURL: url + "/Product"
            });
            api.post("images/upload",formData)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => {
                console.error(nope);
                cb(nope);
            });
        })
    });
};

export const getImages = async (e,cb) => {
    let targetImages = [];
    for (var i = 0; i < e.target.files.length; i++) {
        e.target.files[i].filename = e.target.files[i].name;
        targetImages.push(URL.createObjectURL(e.target.files[i]));
    }
    cb(targetImages);
};

export const getImagesFromReferencesAsync = (refs,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Product"
        });
        api.post("imageItems",refs)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    })
};

export const getImagesFromProductAsync = (prodId,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Product"
        });
        api.get(`imageItems/${prodId}`)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    })
};

export const getBackgroundAsync = async (cb) =>{
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Site"
        });
        await api.get(`config/background`)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => {
            console.error(nope);
            cb(nope);
        })
    })
};

export const readImagesAsync = async (images,cb) => {
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
};

export const getAttributesAsync = async (prod, cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Product"
        });
        await api.get(`items/product/${prod}/attributes`)
        .then(yup => {
            for(var att of yup.data){
                att.product = prod;
                att.values = att.value;
                att.value = "";
            }
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    })
};

export const getAttributesFromItems = (itms,cb) => {
    let availableAttributes = {};
    for(let itm of itms){
        for(let i=0; i<itm.attributes.length; i++){
            if(availableAttributes[itm.attributes[i].type] === undefined){
                availableAttributes[itm.attributes[i].type] = new Set([itm.attributes[i].value]);
            }
            else{
                availableAttributes[itm.attributes[i].type].add(itm.attributes[i].value);
            }
        }
    }
    cb(availableAttributes);
};

export const narrowField = (choices,cb) => {
    let narrowed = Array.from(items);
    for(let i=0; i<narrowed.length; i++){
        let attArray = Object.entries(choices);
        let attarraylen = attArray.length;
        for(let j=0; j<attarraylen; j++){
            itemContainsAttribute(narrowed[i],attArray[j], doesContain => {
                if(!doesContain){
                    narrowed.splice(i--,1);
                    attarraylen--;
                }
            })
        }
    }
    cb(narrowed);
};

export const itemContainsAttribute = (item,attribute,cb) => {
    if(attribute[1] === "" || item.attributes.find(a => a.type === attribute[0] && a.value === attribute[1])){
        cb(true);
    }
    else{
        cb(false);
    }
};

export const getSiteImagesAsync = (figs,cb) => {
    if(localStorage.getItem("configId") === null 
        || figs.configId === null 
        || localStorage.getItem("configId") === undefined 
        || localStorage.getItem("configId") === "undefined"
    ) return cb();
    getBaseURL(url => {
        const api = axios.create({
            baseURL: url + "/Product"
        });
        api.get(`images`)
        .then(async yup => {
            let yupReturn = [];
            for (var im of yup.data) {
                im.image = window.atob(im.image);
                let img = await fetch(im.image);
                let blob = await img.blob();
                im.url = URL.createObjectURL(blob);
                yupReturn.push(im);
                cb(yupReturn);
            }
        })
        .catch(nope => cb(nope));
    });
}

export const loginAsync = async (userName,password,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Account"
        });
        api.post(`login/`,{
            email: userName.replace("@", "%40"),
            password: password
        })
        .then(yup => {
            localStorage.setItem("username", yup.data.username)
            localStorage.setItem("loginToken",yup.data.loginToken);
            localStorage.setItem("configId", yup.data.siteConfigId !== "" && yup.data.siteConfig !== "00000000-0000-0000-0000-000000000000" ? yup.data.siteConfigId : "defaultConfig");
            localStorage.setItem("siteTitle", yup.data.siteTitle);
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
        .catch(nope => cb(nope));

    })
}

export const logoutAsync = (userAcct,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Account"
        });
        localStorage.clear();
        api.post(`logout/${userAcct.username}`)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    })
}

export const createAccountAsync = async ({ name,email,username,password,permissions },cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Account"
        });
        await api.post(`createAccount/${name}/${email}`,{username,password,permissions})
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    });
}

export const getAccountAsync = async (username,cb) => {
    getBaseURL(async url => {
        const api = axios.create({
            baseURL: url + "/Account"
        });
        await api.get(username)
        .then(yup => {
            cb(yup.data);
        })
        .catch(nope => console.error(nope));
    });
}

export const calcOrderTotal = (order,cb) => {
    let total = 0;
    for(let itm of order){
        total += itm.item.price * itm.quantity;
    }
    cb(total);
}

export const currencyFormat = new Intl.NumberFormat("en-US",{
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
});

export default {
    getConfigurationAsync,
    createConfigurationAsync,
    updateConfigurationAsync,
    deleteConfigurationAsync,
    getProductsAsync,
    createProductAsync,
    getItemsAsync,
    createItemsAsync,
    updateItemsAsync,
    purchaseItemAsync,
    getAvailableAttributesAsync,
    getCreds,
    uploadImagesAsync,
    getImages,
    getImagesFromReferencesAsync,
    getImagesFromProductAsync,
    getBackgroundAsync,
    readImagesAsync,
    getAttributesAsync,
    getAttributesFromItems,
    narrowField,
    itemContainsAttribute,
    getSiteImagesAsync,
    loginAsync,
    logoutAsync,
    createAccountAsync,
    getAccountAsync,
    calcOrderTotal,
    currencyFormat
};