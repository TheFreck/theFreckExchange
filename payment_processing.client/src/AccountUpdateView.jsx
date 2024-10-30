import react, {useEffect, useState} from "react";

export const AccountUpdateView = ({account, payment, setPayment, submit}) => {

    useEffect(() => {
        console.log("account: ", account);
    },[]);

    return <div>
        <h1>Account</h1>
        <div>{account.name}</div>
        <div>{account.email}</div>
        <div>{account.balance}</div>
        <label>How much would you like to pay toward your balance?</label>
        <br />
        <input type="number" onChange={e => setPayment(e.target.value)} value={payment} />
        <input type="submit" onClick={submit} />
    </div>
}

export default AccountUpdateView;