import React, { useState, useEffect } from "react";
import TodoListContract from "./contracts/TodoList.json";
import getWeb3 from "./utils/getWeb3"; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NFTProvider } from "./contexts/nft";
import "./App.css";

import Home from './components/Home';

const App = () => {

  const [ web3, setWeb3 ] = useState(null);
  const [ contract, setContract] = useState(null);
  const [ accounts, setAccounts ] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async() => {
    try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = TodoListContract.networks[networkId];
        const accounts = await web3.eth.getAccounts();
        const instance = new web3.eth.Contract(
            TodoListContract.abi, deployedNetwork && deployedNetwork.address,
        );
        setWeb3(web3);
        setContract(instance);
        setAccounts(accounts);

    } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
        console.error(error);
    }
  }

  return(
    <NFTProvider value={{web3, contract, accounts}}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home/>} />
          </Routes>
        </BrowserRouter>
      </div>
    </NFTProvider>
  ); 
}

export default App;