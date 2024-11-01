import react, { useState, useEffect, useContext } from "react";
import AccountContext from "./Context";

export const Login = ({email, setEmail, setNewAccount}) => {
    const context = useContext(AccountContext);
    return (
        <div>
            <h1>Log into your account</h1>
            <form>
                <input type="text" className='emailField' onChange={e => setEmail(e.target.value.trim())} placeholder='enter your email' value={email} />
                <input type="submit" onClick={(e) => context.login(e)} className='emailSubmit' />
                <br/>
                <button onClick={() => setNewAccount(true)}>New Account</button>
            </form>
        </div>
    );
}

export default Login;