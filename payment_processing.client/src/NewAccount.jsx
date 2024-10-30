import react, { useState } from "react";

export const NewAccount = ({setAccount, setIsNewAccount, createAccount}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [balance, setBalance] = useState(0);

    return <div>
        <label>Name:
            <input type="text" onChange={c => setName(c.target.value)} placeholder="Enter your name" value={name} />
        </label>
        <br/>
        <label>Email:
            <input type="email" onChange={c => setEmail(c.target.value)} placeholder="Enter your email" value={email} />
        </label>
        <br/>
        <label>Balance:
            <input type="number" onChange={c => setBalance(c.target.value)} value={balance} />
        </label>
        <br/>
        <input type="submit" onClick={() => {
            setAccount({ name,email,balance });
            setIsNewAccount(false);
            createAccount({ name,email,balance });
        }} />
    </div>
}

export default NewAccount;