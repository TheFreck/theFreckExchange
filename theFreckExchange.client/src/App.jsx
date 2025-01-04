import './App.css';
import { useCallback, useEffect, useState } from 'react';
import {AccountContext} from './Context';
import Welcome from './Views/Welcome';
import Login from './Views/Login';
import Layout from './Views/Layout';
import {
    loginAsync,
    logoutAsync,
    createAccountAsync
} from "./helpers/helpersApp";

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

    const login = (username,password) => {
        loginAsync(username,password,loggedIn => {
            setUserAcct(loggedIn);
            setView(homeViewEnum.login);
        });
    }

    const logout = () => {
        logoutAsync(userAcct,loggedOut => {
            setUserAcct({});
            setView(homeViewEnum.home);
        });
    }

    const getUserAcct = () =>  userAcct;

    const AppCallback = useCallback(() => <AccountContext.Provider value={{
        login,
        getUserAcct,
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
    </AccountContext.Provider>,[userAcct,view,userView,refreshConfig]);
    return <AppCallback />
}

export default App;