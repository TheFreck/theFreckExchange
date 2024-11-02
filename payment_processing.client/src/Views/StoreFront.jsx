import react, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Login from "../Login";

export const StoreFront = ({userAcct,setUserAcct}) => {
    const [products,setProducts] = useState([]);
    const [items, setItems] = useState([]);
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
                setUserAcct(yup.data)
            })
            .catch(nope => console.error(nope));
    }

    useEffect(() => {
        var prods = [];
        var prodCount = 0;
        productApi.get()
            .then(yup => {
                prodCount = yup.data.length;
                for(var product of yup.data){
                    getAttributes(product);
                }
            })
            .catch(nope => console.error(nope));

        const getAttributes = async (product) => {
            productApi.get(`items/product/${product.name}/allAttributes`)
            .then(yep => {
                product.attributes = yep.data;
                prods.push(product);
                if(prods.length === prodCount){
                    setProducts(prods);
                }
            })
            .catch(nope => console.error(nope));
        }
    },[]);


    const ItemsCallback = useCallback(() => <>
    
    <div>
        {products.length > 0 && products.map((p,i) => 
            <div style={{display:"flex", flexDirection: "row", textAlign: "left"}} key={i} onClick={() => {
            }}>
                <div style={{display:"flex",flexDirection: "column", float: "left", textJustify: "left",width: "20vw"}}>
                    <h2>{p.name}</h2>
                    <div>Price: {p.price}</div>
                    <div>Description: {p.productDescription}</div>
                </div>
                <div style={{display:"flex",flexDirection: "column"}}>
                    <ChooseAttributes item={p} />
                </div>
            </div>
        )}
    </div>
    </>,[purchaseOptions,userAcct]);

    const ChooseAttributes = ({item}) => <div>
            { <ul style={{alignItems: "start"}}>
                {item.attributes.map((a,i) => (
                    <li key={i}>
                        {a.type}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <select>
                            {
                                a.value.map((t,j) => (
                                    <option  name={t} id={`att${j}`} key={j} >
                                        {t}
                                    </option>
                                ))
                            }
                        </select>
                        <br/>
                        <br/>
                    </li>
                ))}
            </ul>}
            {item.attributes.length > 0 && <button style={{display:'flex'}}>Buy</button>}
        </div>

    return userAcct.accountId !== undefined ? <ItemsCallback purchaseOptions={purchaseOptions} /> : <Login login={login} email={email} setEmail={setEmail} setNewAccount={() => {}} />
}

export default StoreFront;