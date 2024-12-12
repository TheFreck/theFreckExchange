import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import {AccountContext, ProductContext} from './Context';
import Welcome from './Views/Welcome';
import Login from './Views/Login';
import Layout from './Views/Layout';

const homeViewEnum = {
    home: 0,
    account: 1,
    product: 2,
    storeFront: 3,
    login: 4
};

const userEnum = {
    home: 0,
    createProduct: 1,
    createItems: 2,
    updateProduct: 3,
    siteConfig: 4,
    shop: 5,
    viewAccount: 6
};


function App() {
    const [view, setView] = useState(homeViewEnum.home);
    const [userView, setUserView] = useState(userEnum.home);
    const [userAcct, setUserAcct] = useState({});
    const [refreshConfig,setRefreshConfig] = useState(false);
    const [baseUrl,setBaseUrl] = useState("");
    
    const accountApi = axios.create({
        baseURL: `${baseUrl}/Account`
    });
    
    useEffect(() => {
        if(process.env.NODE_ENV === "development"){
            setBaseUrl("https://localhost:7299");
        }
        else if(process.env.NODE_ENV === "production"){
            setBaseUrl("");
        }
    }, []);

    const login = (userName,password) => {
        accountApi.post(`login/`,{
            email: userName.replace("@", "%40"),
            password: password
        })
        .then(yup => {
            setUserAcct(yup.data);
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
            setView(0);
        })
        .catch(nope => console.error(nope));
    }

    const logout = () => {
        localStorage.clear();
        accountApi.post(`logout/${userAcct.username}`)
        .then(yup => {
            setUserAcct({});
            setView(homeViewEnum.home);
        })
        .catch(nope => console.error(nope));
    }

    const createAccount = ({ name,email,username,password,permissions }) => {
        accountApi.post(`createAccount/${name}/${email}`,{username,password,permissions})
            .then(yup => {
                console.info("account created: ", yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const AppCallback = useCallback(() => <AccountContext.Provider value={{
        login,
        userAcct,
        createAccount,
        userView,
        setUserView,
        userEnum,
        refreshConfig,
        setRefreshConfig
        }}>
        <Layout login={() => setView(homeViewEnum.login)} logout={logout}>
            {view === homeViewEnum.login && localStorage.getItem("loginToken") === null && 
                <Login />
            }
                <Welcome />
        </Layout>
    </AccountContext.Provider>,[userAcct,view,userView,baseUrl,refreshConfig]);
    return <AppCallback />
}

export default App;