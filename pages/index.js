import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { CrowdFundingAddress } from '../config.js'
import CrowdFunding from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json"

export default function Home() {
  const [rounds, setRounds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    login();
    loadRounds();
  });

  async function loadRounds(){
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(CrowdFundingAddress, CrowdFunding.abi, provider);
    const rounds = await contract.fetchRounds();
    console.log("rounds..... => ", rounds)
  }

  async function login(){
    console.log("window.ethereum", window.ethereum)
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner()
    console.log("signer", signer)
    // const contract = new ethers.Contract(CrowdFundingAddress, CrowdFunding.abi, signer);
  }

  return (
    <div className="anc">
      
    </div>
  )
}
