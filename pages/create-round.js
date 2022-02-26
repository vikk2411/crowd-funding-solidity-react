import { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers"
import { CrowdFundingAddress } from '../config.js'
import CrowdFunding from "../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json"
import { useRouter } from 'next/router'

export default function createRound() {
  const [formInput, updateFormInput] = useState({
    name: "R1",
    description: "Desc",
    minContri: "0.1",
    target: "10",
    lastDate: new Date()
  })
  const router = useRouter()

  async function create(){
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    // connect to the contract 
    let contract = new ethers.Contract(CrowdFundingAddress, CrowdFunding.abi, signer)

    const deadline = new Date(formInput.lastDate).getTime();
    const transaction = await contract.createRound(
      formInput.name,
      formInput.description,
      ethers.utils.parseEther(formInput.minContri.toString()),
      deadline,
      ethers.utils.parseEther(formInput.target.toString())
    );
    console.log(" transaction",  transaction)
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Title"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          value={formInput.name}
        />
        <input
          placeholder="Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          value={formInput.description}
        />
        <input
          placeholder="Min Contribution in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, minContri: e.target.value })}
          value={formInput.minContri}
        />
        <input
          placeholder="Target in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, target: e.target.value })}
          value={formInput.target}
        />
        <input
          type="date"
          placeholder="Last date"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, lastDate: e.target.value })}
          value={formInput.lastDate}
        />
        <button onClick={create} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Funding Round
        </button>
      </div>
    </div>
  )
}