import axios from "axios";

export const getBaseURL = (cb) => {
    if(process.env.NODE_ENV === "development"){
        cb("https://localhost:7299");
    }
    else if(process.env.NODE_ENV === "production"){
        cb("");
    }
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

export default {
    loginAsync,
    logoutAsync,
    createAccountAsync,
    getAccountAsync
}