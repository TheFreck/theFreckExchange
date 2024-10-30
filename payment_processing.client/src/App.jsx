import { useEffect, useState } from 'react';
import './App.css';
import AccountView from './AccountView';
import ProductView from './ProductView';

const viewEnum = {
    home: 0,
    account: 1,
    product: 2
};

function App() {
    const [view,setView] = useState(viewEnum.home);



    return <div>
        {view === viewEnum.home &&
            <div>
                <h1>Welcome</h1>
                <h3>Would you like to access Accounts or Products?</h3>
                <button id="account" onClick={() => setView(viewEnum.account)}>Account</button>
                <button id="product" onClick={() => setView(viewEnum.product)}>Product</button>
            </div>
        }
        {view === viewEnum.account &&
            <AccountView />
        }
        {view === viewEnum.product &&
            <ProductView />
        }
    </div>
}

export default App;