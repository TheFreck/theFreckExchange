import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router';
import {AuthContext} from './Context';
import Login from './Views/Login';
import Layout from './Views/Layout';
import StoreFront from './Views/StoreFront';
import SiteConfiguration from './Views/Admin/SiteConfig';
import CreateProduct from './Views/Product/CreateProduct';
import ModifyProduct from './Views/Product/ModifyProduct';
import CreateItems from './Views/Item/CreateItems';
import AccountView from './Views/Account/AccountView';
import { 
    loginAsync,
    logoutAsync,
    getConfigurationAsync
} from './helpers/helpers';
import Store from './Views/User/Store';
import Checkout from './components/Checkout';

function App() {
    const [userAcct, setUserAcct] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin,setIsAdmin] = useState(false);
    const [isUser,setIsUser] = useState(false);
    const [refreshConfig,setRefreshConfig] = useState(false);
    const [config,setConfig] = useState({});
    const [cart,setCart] = useState([]);
    const [selectedProductName,setSelectedProductName] = useState("");
    const [ready,setReady] = useState(false);
    const [isMobile,setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(navigator.maxTouchPoints > 0);
        setIsLoggedIn(localStorage.getItem("loginToken") !== null);
        setIsAdmin(localStorage.getItem("permissions.admin") !== null);
        setIsUser(localStorage.getItem("permissions.user") !== null);
        getConfigurationAsync(figs => {
            setConfig(figs);
            setReady(true);
        });
    },[]);

    const login = (username,password) => {
        loginAsync(username,password,loggedIn => {
            if(loggedIn.loginToken){
                setIsLoggedIn(true);
                getConfigurationAsync(figs => {
                    setConfig(figs);
                    setReady(true);
                });
            }
            if(loggedIn.permissions.find(p => p.type === 0 && p.token)){
                setIsAdmin(true);
            }
            if(loggedIn.permissions.find(p => p.type === 1 && p.token)){
                setIsUser(true);
            }
            setUserAcct(loggedIn);
        });
    }

    const logout = () => {
        logoutAsync(userAcct,loggedOut => {
            setSelectedProductName("");
            setUserAcct({});
            setIsAdmin(false);
            setIsUser(false);
            setIsLoggedIn(false);
        });
    }

    const completed = () => {
        setCart([]);
        setSelectedProductName("");
    }

    const addToCart = async (item,cb) => {
        let amendedCart = [];
        for(let it of cart){
            if(it.item.sku === item.item.sku){
                it.quantity += item.quantity;
                setCart(cart);
                cb(cart);
                return;
            }
        }
        amendedCart = [...cart,item];
        setCart(amendedCart);
        cb(amendedCart);
    }

    const removeFromCart = (item,cb) => {
        let amendedCart = cart.filter(c => c.item.sku !== item.item.sku);
        setCart(amendedCart);
        cb(amendedCart);
    }

    const getShoppingCart = () => cart;

    const getUserAcct = () =>  userAcct;

    const getConfig = () => config;
    
    const LogButtonCallback = useCallback(() => (
        isLoggedIn ? 
        <NavLink style={{color: "black"}} to="/Home" onClick={logout} color="inherit">Logout</NavLink> : 
        <NavLink style={{color: "black"}} to="/Home/Login" end>Login</NavLink>
    ),[isLoggedIn]);

    const HomeRouter = () => <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<StoreFront />} />
    </Routes>

    const AdminRouter = () => <Routes>
        <Route path="/Config" element={<SiteConfiguration />} />
        <Route path="/Products/Create" element={<CreateProduct />} />
        <Route path="/Products/Modify" element={<ModifyProduct />} />
        <Route path="/Items/Create" element={<CreateItems />} />
    </Routes>

    const UserRouter = () => <Routes>
        <Route path="/Account" element={<AccountView />} />
        <Route exact path="/Shopping" element={<Store />} />
        <Route exact path="/Shopping/Checkout" element={<Checkout completed={completed} />} />
    </Routes>

    const LayoutCallback = useCallback(() => <Layout
        LoginButton={LogButtonCallback}
    >
        <Routes>
            <Route path="/Home/*" element={<HomeRouter />} />
            <Route path="/Admin/*" element={isAdmin ? <AdminRouter /> : <Navigate to="/Home/" replace />} />
            <Route path="/User/*" element={isUser ? <UserRouter /> : <Navigate to="/Home/" replace />} />
            <Route path="/*" element={<Navigate to="/Home" replace />} />
        </Routes>
    </Layout>,[isLoggedIn,isAdmin,isUser,config]);

    return (
        <>
            <BrowserRouter>
            {
                ready && 
                <AuthContext.Provider
                    value={{
                        refreshConfig,
                        setRefreshConfig,
                        getConfig,
                        getUserAcct,
                        login,
                        logout,
                        addToCart,
                        selectedProductName,
                        setSelectedProductName,
                        getShoppingCart,
                        isMobile,
                        removeFromCart
                    }}
                >
                    <LayoutCallback />
                </AuthContext.Provider>
            }
            </BrowserRouter>
        </>
    )
}

export default App;