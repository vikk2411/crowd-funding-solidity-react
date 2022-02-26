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
  }, []);

  async function loadRounds(){
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(CrowdFundingAddress, CrowdFunding.abi, provider);
    const data = await contract.fetchRounds();
    
    const rounds = await Promise.all(data.map(async(i) => {
      let minContribution = ethers.utils.formatUnits(i.minContribution.toString(), 'ether')
      let targetAmt = ethers.utils.formatUnits(i.targetAmt.toString(), 'ether')
      let raisedAmt = ethers.utils.formatUnits(i.raisedAmt.toString(), 'ether')
      let item = {
        name: i.name,
        description: i.desc,
        roundId: i.roundId,
        minContribution,
        raisedAmt,
        targetAmt
      }
      return item
    }))
    // console.log("rounds..... => ", rounds)
    setRounds(rounds)
  }

  async function transferEth(roundId){
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    let contract = new ethers.Contract(CrowdFundingAddress, CrowdFunding.abi, signer)

    await contract.fundRound(roundId, {value: ethers.utils.parseEther("1.0")})
  }

  async function login(){
    console.log("window.ethereum", window.ethereum)
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner()
  }

  return (
    <div className="mx-10">
      {
        !rounds.length ? 
        <div> No funding rounds are available currently </div>
        : 
        <div className="flex justify-center">
          <div className="px-4" style={{ maxWidth: '1600px' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {
                rounds.map((round, i) => (
                  <div key={i} className="border shadow rounded-xl overflow-hidden">
                    <div className="p-4">
                      <p style={{ height: '64px' }} className="text-2xl font-semibold">{round.name}</p>
                      <div style={{ height: '70px', overflow: 'hidden' }}>
                        <p className="text-gray-400">{round.description}</p>
                        <p className="text-gray-400">Target: {round.targetAmt}</p>
                        <p className="text-blue-400">Min: {round.minContribution}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-black">
                      <p className="text-2xl mb-4 font-bold text-white">Raised: {round.raisedAmt} ETH</p>
                      <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => transferEth(round.roundId)}>Send</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}
