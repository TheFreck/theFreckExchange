import { useEffect, useState } from 'react';
import './App.css';
import AccountView from './AccountView';
import ProductView from './ProductView';
import StoreFront from './StoreFront';

const viewEnum = {
    home: 0,
    account: 1,
    product: 2,
    storeFront: 3
};

function App() {
    const [view, setView] = useState(viewEnum.home);
    const [userAcct, setUserAcct] = useState({});


    return <div>
        <button id="home" onClick={() => setView(viewEnum.home)} >Home</button>
        {view === viewEnum.home &&
            <div>
                <h1>Welcome</h1>
                <h3>Would you like to access Accounts or Products?</h3>
                <button id="account" onClick={() => setView(viewEnum.account)}>Account</button>
                <button id="product" onClick={() => setView(viewEnum.product)}>Product</button>
                <button id="store" onClick={() => setView(viewEnum.storeFront)}>Store</button>
            </div>
        }
        {view === viewEnum.account &&
            <AccountView userAcct={userAcct} setUserAcct={setUserAcct} />
        }
        {view === viewEnum.product &&
            <ProductView />
        }
        {view === viewEnum.storeFront &&
            <StoreFront userAcct={userAcct} setUserAcct={setUserAcct} />
        }
    </div>
}

export default App;