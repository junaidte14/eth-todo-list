import React, { useState, useEffect, useContext } from "react";
import TodoListContract from "../contracts/TodoList.json";
import NftContext from "../contexts/nft";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import TodoListCard from './TodoListCard';

const Home = (props) => {

   const [ web3, setWeb3 ] = useState(null);
   const [ contract, setContract] = useState(null);
   const [ accounts, setAccounts ] = useState(null);
   const [ totalTasks, setTotalTasks ] = useState(null);
   const [ showForm, setShowForm ] = useState(false);
   const [ tldescription, setTlDescription ] = useState('');

   useEffect(() => {
      init();
   }, []);

   const init = async () => {
      try {
          const provider = await detectEthereumProvider();
          const web3 = new Web3(provider);
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = TodoListContract.networks[networkId];
          const accounts = await web3.eth.getAccounts();
          const instance = new web3.eth.Contract(TodoListContract.abi, deployedNetwork && deployedNetwork.address);
          setWeb3 (web3);
          setContract (instance);
          setAccounts (accounts);

          if(accounts !== null){
            let total = await instance.methods.taskCount().call({ from: accounts[0] });
            total = parseInt(total);
            setTotalTasks(total);
          }

       } catch (error) {
          alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
          console.error(error);
      }
  }

  window.ethereum.on('accountsChanged', function (accounts) {
   window.location.reload()
  });

   const handleSubmit = async (event) => {
      event.preventDefault();
      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TodoListContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
         TodoListContract.abi, 
         deployedNetwork && deployedNetwork.address,
      );
      await contract.methods.createTask(tldescription).send({ from: accounts[0] });
      alert('Item is successfully created');
      window.location.reload();
   }

   const displayForm = () => {
      return (
         <form onSubmit={handleSubmit}>
            <label>Enter Text:
            <input 
               type="text" 
               value={tldescription}
               onChange={(e) => setTlDescription(e.target.value)}
            />
            </label>
            <input type="submit" />
         </form>
      );
   }
    
   return (
      <div>
         {(!showForm) &&
            <a href="#" onClick={() => setShowForm(true) }>Add New</a>
         }
         {(showForm) &&
            displayForm()
         }
         {(totalTasks !== null && typeof totalTasks === 'number') &&
            [...Array(totalTasks)].map((e, i) => <TodoListCard id={i} key={i} />)
         }
      </div>
   ) 
}

export default Home;