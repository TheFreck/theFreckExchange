import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import {AccountContext, ProductContext} from './Context';
import Welcome from './Views/Welcome';
import Login from './Views/Login';
import Layout from './Views/Layout';
import {getBaseURL,
    loginAsync,
    logoutAsync,
    createAccountAsync} from "./helpers/helpersApp";

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
        getBaseURL(url => setBaseUrl(url));
    }, []);

    const login = (username,password) => {
        loginAsync(username,password,loggedIn => {
            console.log("loggedIn: ", loggedIn);
            setUserAcct(loggedIn);
            setView(0);
        })
        .then(yup => {
        })
        .catch(nope => console.error(nope));
    }

    const logout = () => {
        logoutAsync(userAcct,loggedOut => {
            setUserAcct({});
            setView(homeViewEnum.home);
        });
    }

    // const createAccount = ({ name,email,username,password,permissions }) => {
    //     accountApi.post(`createAccount/${name}/${email}`,{username,password,permissions})
    //         .then(yup => {
    //             console.info("account created: ", yup.data);
    //         })
    //         .catch(nope => console.error(nope));
    // }

    const AppCallback = useCallback(() => <AccountContext.Provider value={{
        login,
        userAcct,
        createAccountAsync,
        userView,
        setUserView,
        userEnum,
        refreshConfig,
        setRefreshConfig
        }}>
        <Layout login={() => setView(homeViewEnum.login)} logout={() => logout(userAcct)}>
            {view === homeViewEnum.login && localStorage.getItem("loginToken") === null && 
                <Login />
            }
                <Welcome />
        </Layout>
    </AccountContext.Provider>,[userAcct,view,userView,baseUrl,refreshConfig]);
    return <AppCallback />
}

export default App;