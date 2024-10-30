import react, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";

export const StoreFront = () => {
    const [products,setProducts] = useState([]);
    const [account, setAccount] = useState({});
    const [email, setEmail] = useState();
    const [purchaseOptions,setPurchaseOptions] = useState(false);
    const [purchaseItem, setPurchaseItem] = useState({});

    const productApi = axios.create({
        baseURL: `https://localhost:7299/Product`
    });

    
    const accountApi = axios.create({
        baseURL: `https://localhost:7299/Account`
    });


    const login = (e) => {
        e.preventDefault();
        const cleanEmail = email.replace("@", "%40");
        accountApi.get(`email/${cleanEmail}`)
            .then(yup => {
                console.log("yup: ", yup.data);
                setAccount(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    useEffect(() => {
        productApi.get()
            .then(yup => {
                console.log("yup: ", yup.data);
                setProducts(yup.data);
                for(var product of yup.data){
                    productApi.get(`items/product/${product.name}/allAttributes`)
                        .then(yep => {
                            console.log("attributes: ", yep.data);
                        })
                        .catch(nope => console.error(nope));
                }
            })
            .catch(nope => console.error(nope));
    },[]);

    const Items = () => <div>
            {products.length > 0 && products.map((p,i) => 
        <div key={i} onClick={p => {
            setPurchaseOptions(true);
            purchaseItem(p);
            }}>
            {console.log("p: ", p)}
            <div>Name: {p.name}</div>
            <div>Price: {p.price}</div>
            <div>Description: {p.productDescription}</div>
            <br/>
        </div>
    )}
    </div>

    const buyItem = (product) => {
    }

    const ChooseAttributes = (attributes) => {
        return <div>
            {attributes.length > 0 &&
                attributes.map((a,i) => (
                    <select name={a.type} id={`att${i}`} key={i}>
                        {a.map((v,j) => (
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                ))
            }
        </div>
    }

    return account.name !== undefined ? <Items /> : <Login login={login} email={email} setEmail={setEmail} setNewAccount={() => {}} />
}

export default StoreFront;