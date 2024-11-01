import react, { useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios';
import NewProduct from "./NewProduct";
import { AccountContext, ProductContext } from "./Context";

const productVeiwEnum = {
    home: 0,
    all: 1,
    new: 2
};

export const ProductView = () => {
    const accountContext = useContext(AccountContext);
    const productContext = useCallback(ProductContext);
    const [view, setView] = useState(productVeiwEnum.home);
    const [products, setProducts] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const api = axios.create({
        baseURL: `https://localhost:7299/Product`
    });

    useEffect(() => {
        api.get()
            .then(yup => {
                console.log("yup: ", yup.data);
                for (var product of yup.data) {
                    product.updateName = false;
                    product.updatePrice = false;
                    product.updateDescription = false;
                }
                setProducts(yup.data);
            })
            .catch(nope => console.error(nope));
    }, [view]);

    useEffect(() => {
        console.log("refresh");
    }, [refresh]);

    useEffect(() => {
        console.log("set product: ", products);
    }, [products]);

    const saveNewProduct = (name, price, description) => {
        api.post("create", { name, price, description })
            .then(yup => {
                console.log("yup: ", yup.data);
                setView(productVeiwEnum.all);
            })
            .catch(nope => console.error(nope));
    }

    const nameUpdate = (oldName, newName) => {
        console.log(oldName, newName);
        api.put(`modify/name/${oldName}/${newName}`)
            .then(yup => {
                setProducts([...products.filter(p => p.productId !== yup.data.productId), yup.data]);
                setRefresh(!refresh);
                console.log("yup: ", yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const priceUpdate = (name, newPrice, oldPrice) => {
        console.log(newPrice, oldPrice);
        api.put(`modify/price/${name}/${newPrice}`)
            .then(yup => {
                setProducts([...products.filter(p => p.productId !== yup.data.productId), yup.data]);
                setRefresh(!refresh);
                console.log("yup: ", yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const descriptionUpdate = (name, newDescription, oldDescription) => {
        console.log(newDescription, oldDescription);
        api.put(`modify/description/${name}`, newDescription)
            .then(yup => {
                setProducts([...products.filter(p => p.productId !== yup.data.productId), yup.data]);
                setRefresh(!refresh);
                console.log("yup: ", yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const ProductListCallback = useCallback(() => <div><ProductContext.Provider value={[
        saveNewProduct,
        nameUpdate,
        priceUpdate,
        descriptionUpdate
    ]}>
        <h1>All Products</h1>
        <ul>
            {products.map((p, i) => (
                <li key={i}>
                    <div>Name: {p.name}</div>
                    <button
                        onClick={() => {
                            console.log("p: ", p);
                            if (p.updateName) nameUpdate(p.name, p.newName);
                            p.updateName = !p.updateName;
                            setRefresh(!refresh)
                        }
                        }>
                        {p.updateName ? "Save Update" : "Update Name"}
                    </button>
                    {p.updateName &&
                        <input type="text" onChange={c => p.newName = c.target.value} placeholder="new name" />
                    }
                    <div>Price: {p.price}</div>
                    <button
                        onClick={() => {
                            if (p.updatePrice) priceUpdate(p.name, p.price, p.newPrice);
                            p.updatePrice = !p.updatePrice;
                            setRefresh(!refresh);
                        }
                        }>
                        {p.updatePrice ? "Save Update" : "Update Price"}
                    </button>
                    {p.updatePrice &&
                        <input type="number" onChange={c => p.newPrice = parseFloat(c.target.value)} placeholder="new price" />
                    }
                    <div>Description: {p.productDescription}</div>
                    <button
                        onClick={() => {
                            if (p.descriptionUpdate) descriptionUpdate(p.name, p.description, p.newDescription);
                            p.updateDescription = !p.updateDescription;
                            setRefresh(!refresh);
                        }
                        }>{p.updateDesription ? "Save Update" : "Update Description"}</button>
                    {p.updateDescription &&
                        <textarea onChange={c => p.newDescription = c.target.value} placeholder="Write a new description" />
                    }
                    <br />
                </li>
            ))}
        </ul>
    </ProductContext.Provider>
    </div>
        , [refresh, products]);

    return <div>
        {view === productVeiwEnum.home &&
            <div>
                <h1>Product</h1>
                <h3>Would you like to access all Products or create new?</h3>
                <button id="allProducts" onClick={() => setView(productVeiwEnum.all)}>View All</button>
                <button id="newProduct" onClick={() => setView(productVeiwEnum.new)}>New Product</button>
            </div>
        }
        {view === productVeiwEnum.all && products.length > 0 &&
            <ProductListCallback />
        }
        {view === productVeiwEnum.new &&
            <NewProduct

                saveNewProduct={saveNewProduct}
            />
        }

    </div>
}

export default ProductView;