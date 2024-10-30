import react, { useState } from "react";
import axios from 'axios';
import Login from "./Login";

export const AccountView = () => {
    const [account, setAccount] = useState({});
    const [payment, setPayment] = useState(0);
    const [email, setEmail] = useState();
    const [newAccount, setNewAccount] = useState(false);

    const api = axios.create({
        baseURL: `https://localhost:7299/Account`
    });


    const login = (e) => {
        e.preventDefault();
        const cleanEmail = email.replace("@", "%40");
        api.get(`email/${cleanEmail}`)
            .then(yup => {
                console.log("yup: ", yup.data);
                setAccount(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const submitPayment = (e) => {
        e.preventDefault();
        console.log("submitting payment");
        const cleanEmail = account.email.replace("@", "%40");
        api.put(`make_payment/${cleanEmail}/${payment}`)
            .then(yup => {
                console.log("made payment: ", yup.data);
                setAccount(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    const createAccount = (acct) => {
        console.log("create account: ", acct);
        const cleanEmail = acct.email.replace("@", "%40");
        api.post(`Account/createAccount/${acct.name}/${cleanEmail}/${acct.balance}`)
            .then(yup => {
                console.log("account created: ", yup.data);
                setAccount(yup.data);
            })
            .catch(nope => console.error(nope));
    }

    return <div>
        {newAccount ? <NewAccount account={account} setNewAccount={setNewAccount} setAccount={setAccount} createAccount={createAccount} /> : account.name === undefined ? <Login login={login} email={email} setEmail={setEmail} setNewAccount={setNewAccount} /> : <AccountView account={account} payment={payment} setPayment={setPayment} submit={submitPayment} />}
    </div>
}

export default AccountView;