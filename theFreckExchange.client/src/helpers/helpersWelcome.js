import axios from "axios";

export const helpersWelcome = {
    getBaseURL: (cb) => {
        if(process.env.NODE_ENV === "development"){
            cb("https://localhost:7299");
        }
        else if(process.env.NODE_ENV === "production"){
            cb("");
        }
    },
    getConfigurationAsync: async (cb) => {
        helpersWelcome.getBaseURL(async url => {
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
    },
    createConfigurationAsync: async (configTemplate,cb) => {
        configTemplate.adminAccountId = userAcct.accountId;
        configTemplate.configId = localStorage.getItem("configId");
        helpersWelcome.getBaseURL(async url => {
            const api = axios.create({
                baseURL: url + "/Site"
            });
            await api.post("config/set",configTemplate)
            .then(yup => {
                localStorage.setItem("configId", yup.data.configId);
                setConfig(yup.data);
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
        })
    },
    updateConfigurationAsync: async (fig,cb) => {
        await helpersWelcome.getConfigurationAsync(async conf => {
            helpersWelcome.getBaseURL(async url => {
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
    },
    deleteConfigurationAsync: async (configId,cb) => {
        helpersWelcome.getBaseURL(async url => {
            const api = axios.create({
                baseURL: url + "/Site"
            });
            await api.delete(`config`)
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
                }
            );
        });
    },
    getProductsAsync: async (cb) => {
        helpersWelcome.getBaseURL(async url => {
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
    },
    createProductAsync: async ({name, description, attributes, price, images},setProducts) => {
        helpersWelcome.getBaseURL(async url => {
            const api = axios.create({
                baseURL: url + "/Product"
            })
            api.post(`create`, { name, description, price, attributes, credentials: getCreds(), imageReferences: images})
            .then(yup => {
                helpersWelcome.getProductsAsync(prods => {
                    setProducts(prods);
                    cb(yup.data);
                });
            })
            .catch(nope => {
                console.error(nope)
                cb(nope);
            });
        })
    },
    getItemsAsync: async (prod,cb) => {
        helpersWelcome.getBaseURL(async url => {
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
    },
    createItemsAsync: async ({item,quantity,attributes}) => {
        helpersWelcome.getBaseURL(async url => {
            item.credentials = helpersWelcome.getCreds();
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
    },
    updateItemsAsync: async (item,cb) => {
        helpersWelcome.getBaseURL(async url => {
            const api = axios.create({
                baseURL: url + "/Product"
            });
            api.put("modify/product", item)
            .then(yup => {
                console.info("updated: ", yup.data);
                cb(item);
            })
            .catch(nope => {
                console.error(nope)
                cb(item);
            });
        })
    },
    purchaseItemAsync: async (product,qty) => {
        helpersWelcome.getBaseURL(async url => {
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
            })
            .catch(nope => console.error(nope));
        })
    },
    getAvailableAttributesAsync: async (product,cb) => {
        helpersWelcome.getBaseURL(async url => {
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
    },
    getCreds: () => ({
        username: localStorage.getItem("username"),
        loginToken: localStorage.getItem("loginToken"),
        adminToken: localStorage.getItem("permissions.admin"),
        userToken: localStorage.getItem("permissions.user")
    }),
    uploadImagesAsync: async (images,cb) => {
        const blobs = images.map(im => im.blob);
        helpersWelcome.readImagesAsync(blobs, isReady => {
            let formData = new FormData();
            for (var i = 0; i < isReady.length; i++) {
                let blobby = new Blob([isReady[i]]);
                formData.append("images",blobby,images[i].filename);
            }
            helpersWelcome.getBaseURL(async url => {
                axios.create({
                    baseURL: url + "Product"
                });
                api.post("images/upload",formData)
                .then(yup => {
                    // console.log("uploaded: ", yup.data);
                    cb(yup.data);
                })
                .catch(nope => {
                    console.error(nope);
                    cb(nope);
                });
            })
        });
    },
    getImages: async (e,cb) => {
        let targetImages = [];
        for (var i = 0; i < e.target.files.length; i++) {
            e.target.files[i].filename = e.target.files[i].name;
            targetImages.push(URL.createObjectURL(e.target.files[i]));
        }
        cb(targetImages);
    },
    getImagesFromReferencesAsync: (refs,cb) => {
        helpersWelcome.getBaseURL(async url => {
            const api = axios.create({
                baseURL: url + "/Product"
            });
            api.post("imageItems",refs)
            .then(yup => {
                cb(yup.data);
            })
            .catch(nope => console.error(nope));
        })
    },
    getBackgroundAsync: async (cb) =>{
        helpersWelcome.getBaseURL(async url => {
            const api = axios.create({
                baseURL: url = "/Site"
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
    },
    readImagesAsync: async (images,cb) => {
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
    getAttributesAsync: async (prod, cb) => {
        helpersWelcome.getBaseURL(async url => {
            const api = axios.create({
                baseURL: url + "/Product"
            });
            await productApi.get(`items/product/${prod}/attributes`)
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
    },
    getAttributesFromItems: (itms,cb) => {
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
    },
    narrowField: (choices,cb) => {
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
    },
    itemContainsAttribute: (item,attribute,cb) => {
        if(attribute[1] === "" || item.attributes.find(a => a.type === attribute[0] && a.value === attribute[1])){
            cb(true);
        }
        else{
            cb(false);
        }
    },
    getSiteImagesAsync: (figs,cb) => {
        if(localStorage.getItem("configId") === null || figs.configId === null || localStorage.getItem("configId") === undefined || localStorage.getItem("configId") === "undefined") return cb();
        helpersWelcome.getBaseURL(url => {
            const api = axios.create({
                baseURL: url + "/Product"
            });
            api.get(`images/site`)
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
}

export default helpersWelcome;