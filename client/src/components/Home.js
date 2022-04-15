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
      <div className="home">
         <div className="col left">
            <div className="topbanner">
               <div class="flex justify-between items-center bg-black min-h-20">
                  <a href="https://www.kiwisnkangaroos.com/" target="_blank" rel="noopener noreferrer">
                     NFTKING
                  </a>
                  <div class="flex items-center justify-center">
                     <a class="pr-6" href="https://www.instagram.com/kiwisnkangaroos" target="_blank" rel="noopener noreferrer">
                        Instagram
                     </a>
                     <a class="pr-6" href="https://opensea.io/collection/official-kiwisnkangaroos" target="_blank" rel="noopener noreferrer">
                        Opensea
                     </a>
                     <a class="pr-6" href="https://twitter.com/KiwisnKangaroos" target="_blank" rel="noopener noreferrer">
                        Twitter
                     </a>
                     <a href="https://discord.com/invite/kiwisnkangaroos" target="_blank" rel="noopener noreferrer">
                        Discord
                     </a>
                  </div>
               </div>
            </div>

            <div class="pt-20">
               <h1 class="font-header text-white text-6xl uppercase">SALE LIVE</h1>
               <p class="font-header text-white text-2xl uppercase pt-4">Price: <span class="text-green">0.20 eth + gas</span> / mint</p>
               <p class="font-header text-white text-2xl uppercase">Total supply: <span class="text-green">6,666</span></p>
               <p class="font-body text-gray text-sm pt-4">Prices and supply are fetched every five minutes.</p>
            </div>

            <div class="pt-16">
               <h1 class="font-header text-white text-2xl uppercase tracking-wider">Phase 1</h1>
               <h2 class="font-header text-white text-4xl uppercase tracking-wider pt-2">Whitelist presale</h2>
               <p class="font-body text-white text-lg max-w-xl pt-6">Listed at 0.09ETH+GAS, the whitelist presale will open on the 9th of April at 10am NZST and will run until 10pm NZST.</p>
            </div>

            <div class="pt-16">
               <h1 class="font-header text-white text-2xl uppercase tracking-wider">Phase 2</h1>
               <h2 class="font-header text-white text-4xl uppercase tracking-wider pt-2">Public Sale</h2>
               <p class="font-body text-white text-lg max-w-xl pt-6">In the case that there are any KNK NFTs leftover, we will allow for the public to mint them at 0.2ETH+GAS on the 10th of April from 10am NZST until full sold out.</p>
            </div>

            <div class="pt-20 pb-20 flex flex-col md:flex-row">
               <a href="https://www.kiwisnkangaroos.com/privacy-policy" target="_blank" rel="noopener noreferrer" class="font-header text-green text-StrictMode underline mr-4 hover:text-white">Privacy Policy</a>
               <a href="https://etherscan.io/address/0xdacc39631baeeea322d5bd905d1d453898cb0278" target="_blank" rel="noopener noreferrer" class="font-header text-green text-StrictMode underline mr-4 hover:text-white">Smart Contract</a>
               <a href="https://opensea.io/collection/official-kiwisnkangaroos" target="_blank" rel="noopener noreferrer" class="font-header text-green text-StrictMode underline mr-4 hover:text-white">OpenSea</a>
            </div>

         </div>
         <div className="col right">
            <div class="flex flex-wrap justify-between items-center min-h-20">
               <div></div>
               <button type="button" class="border-2 border-b-4 border-black rounded-full px-3 flex items-center">
                  <div class="w-2 h-2 rounded-full bg-orange"></div>
                  <span class="font-header text-black text-base px-3">Not connected</span>
               </button>
            </div>

            <div class="flex items-center pt-12 justify-center"><img class="translate-x-20 h-52 sm:64 md:h-80" src="/assets/exampleNft2.a65f74ff.png" alt="" /><img class="z-10 h-60 sm:72 md:h-96" src="/assets/exampleNft1.345df405.png" alt="" /><img class="-translate-x-20 h-52 sm:64 md:h-80" src="/assets/exampleNft3.37cc928a.png" alt="" /></div>

            <div class="flex flex-col items-center pt-16 z-10"><p class="font-header text-black text-xl px-8 border-2 border-black rounded-full uppercase"><button aria-label="decrease mint amount" class="px-4 py-1 text-gray" type="button">-</button>1<button aria-label="increase mint amount" class="px-4 py-1" type="button">+</button></p><p class="font-header text-black text-2xl font-header uppercase py-4">Total: <span class=" text-green">0.20 ETH + Gas</span></p><button type="button" class="bg-green font-header text-black text-3xl px-4 py-2 shadow-box min-w-10 flex justify-center items-center">Connect MetaMask<img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAD8SURBVHgB7dwhCsAwEAXRpPe/c2trSkQJQ+A9u3JY++c41724z3GAa5ASICZATICYADEBYgLEBIgJEBMgJkBMgJgAMQFiAsQEiAkQEyAmQEyAmAAxAWICxASICRATICZATICYADEBYgLEBIgJEBMgJkBMgJgAMQFiAsQEiAkQEyAmQOy9p7DaXmADHxATICZATICYADEBYgLEjthV+2Azjv8EiAkQEyAmQEyAmAAxAWICxASICRATICZATICYADEBYgLEBIgJEBMgJkBMgJgAMQFiAsQEiAkQEyAmQEyAmAAxAWICxASICRATICZATICYADEBYgLEBIgJEHsAJZMDvXBiqMUAAAAASUVORK5CYII=" class="w-5 ml-2" /></button></div>

         </div>
      </div>
   ) 
}

export default Home;