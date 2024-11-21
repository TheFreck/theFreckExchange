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
    uploadImages: 4,
    shop: 5,
    viewAccount: 6
};

function App() {
    const [view, setView] = useState(homeViewEnum.home);
    const [userView, setUserView] = useState(userEnum.home);
    const [userAcct, setUserAcct] = useState({});
    
    const accountApi = axios.create({
        baseURL: `/Account`
    });

    const login = (userName,password) => {
        accountApi.post(`login/`,{
            email: userName.replace("@", "%40"),
            password: password
        })
        .then(yup => {
            setUserAcct(yup.data);
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
        userEnum
        }}>
        <Layout login={() => setView(homeViewEnum.login)} logout={logout}>
            {view === homeViewEnum.login && localStorage.getItem("loginToken") === null && 
                <Login />
            }
                <Welcome />
        </Layout>
    </AccountContext.Provider>,[userAcct,view,userView]);
    return <AppCallback />
}

export default App;