import React, { useState, useEffect } from 'react';
import TodoListContract from "../contracts/TodoList.json";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';


const TodoListCard = (props) => {
  const [ web3, setWeb3 ] = useState(null);
  const [ contract, setContract] = useState(null);
  const [ accounts, setAccounts ] = useState(null);
  const [ item, setItem ] = useState({});

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
        const instance = new web3.eth.Contract(TodoListContract.abi, deployedNetwork.address);
        setWeb3 (web3);
        setContract (instance);
        setAccounts (accounts);

        if(accounts !== null){
          const listItem = await instance.methods.tasks(props.id+1).call({ from: accounts[0] });
          setItem(listItem);
        }

     } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
        console.error(error);
    }
  }

  const changeStatus = async () => {
    try {

      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TodoListContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(
         TodoListContract.abi, 
         deployedNetwork && deployedNetwork.address,
      );
      await contract.methods.toggleCompleted(props.id+1).send({ from: accounts[0] });
      alert('Item is successfully completed');
      window.location.reload();

     } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
        console.error(error);
    }
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload()
  })

  return (
    <div className='taskTemplate'>
      <label>
        <input 
          type="checkbox" 
          checked={!!item.completed}
          onChange={() => changeStatus()}
        />
        <span className='content'>{item.content}</span>
      </label>
    </div>
  ) 
}
export default TodoListCard;