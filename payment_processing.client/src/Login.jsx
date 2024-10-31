import react, { useState, useEffect } from "react";

export const Login = ({login, email, setEmail, setNewAccount}) => {
    return (
        <div>
            <h1>Log into your account</h1>
            <form>
                <input type="text" className='emailField' onChange={e => setEmail(e.target.value.trim())} placeholder='enter your email' value={email} />
                <input type="submit" onClick={(e) => login(e)} className='emailSubmit' />
                <br/>
                <button onClick={() => setNewAccount(true)}>New Account</button>
            </form>
        </div>
    );
}

export default Login;