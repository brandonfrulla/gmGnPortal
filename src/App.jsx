import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allGms, setAllGms] = useState([]);
  const [allGns, setAllGns] = useState([]);
  const contractAddress = "0xA94938CfB84149eCb07C88d72F5b0557Ec2a1CCE";
  const contractABI = abi.abi;

  const getAllGms = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const gms = await wavePortalContract.getAllGMs();

        let gmsCleaned = [];
        gms.forEach(gm => {
          gmsCleaned.push({
            address: gm.gmer,
            timestamp: new Date(gm.timestamp * 1000),
            message: gm.message
          });
        });

        setAllGms(gmsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllGns = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const gns = await wavePortalContract.getAllGNs();

        let gnsCleaned = [];
        gns.forEach(gn => {
          gnsCleaned.push({
            address: gn.gner,
            timestamp: new Date(gn.timestamp * 1000),
            message: gn.message
          });
        });

        setAllGns(gnsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const walletConnected = async () => {

    const { ethereum } = window;
    
    try {
      if (!ethereum) {
        console.log("Make sure you have a MetaMask Wallet!");
        return;
      } else {
        console.log("Wallet detected: ", ethereum);
        getAllGms();
        getAllGns();
      }
    } catch (error) {
      console.log(error);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found.");
    }

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Get Metamask.");
        return;
      } 

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Wallet connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch(error) {
      console.log(error);
    }
  }

  const sayGm = async () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gmGnPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await gmGnPortalContract.getTotalGMs();
        console.log("Starting GM Count: ", count.toNumber());

        var message = document.getElementById("message").value;

        if(message === null || message === ""){
          message = "No message provided"
        }

        const gmTxn = await 
        gmGnPortalContract.sayGM(message);
        console.log("Mining -- %s w/ message: %s", gmTxn.hash, message);

        await gmTxn.wait();
        console.log("Mined -- ", gmTxn.hash);

        count = await gmGnPortalContract.getTotalGMs();
        console.log("Retrieved new GM count...", count.toNumber());

      } else {
        console.log("Eth object doesn't exist!");
      }

    } catch(error) { 
      console.log(error);
    }
  }

  const sayGn = async () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const gmGnPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await gmGnPortalContract.getTotalGNs();
        console.log("Starting GN Count: ", count.toNumber());

        var message = document.getElementById("message").value;

        if(message === null || message === ""){
          message = "No message provided"
        }

        const gnTxn = await gmGnPortalContract.sayGN(message);
        console.log("Mining -- %s w/ message: %s", gnTxn.hash, message);

        await gnTxn.wait();
        console.log("Mined -- ", gnTxn.hash);

        count = await gmGnPortalContract.getTotalGNs();
        console.log("Retrieved new GN count...", count.toNumber());

      } else {
        console.log("Eth object doesn't exist!");
      }

    } catch(error) { 
      console.log(error);
    }
  }
  
  useEffect(() => {
    walletConnected()
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        This is Brandon Frulla's first Web3 app, say GM and GN on ETH's Rinkeby network below!
        </div>

        <div className="bio">
         
        </div>

        <div className="form">
        Enter a message (optional):
        <input type="text" id="message" />
        </div>

        <div className="bio">
         
        </div>
        

        <button className="gmButton" onClick={sayGm}>
        Say GM
        </button>
      
        <button className="gnButton" onClick={sayGn}>
        Say GN
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
       
       <div className = "wrapper">
       <div className="dataCol">
        <div className="bio">
         Past GMs
        </div>
     {allGms.map((gm, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {gm.address.substring(0,10)+"..."}</div>
              <div>Time: {gm.timestamp.toString()}</div>
              <div>Message: {gm.message}</div>
            </div>)
        })}
        </div>

    <div className="dataCol">
    <div className="bio">
         Past GNs
        </div>
    {allGns.map((gn, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {gn.address.substring(0,10)+"..."}</div>
              <div>Time: {gn.timestamp.toString()}</div>
              <div>Message: {gn.message}</div>
            </div>)
        })}

      </div>
    </div>
    </div>
    </div>


    
  );
}
