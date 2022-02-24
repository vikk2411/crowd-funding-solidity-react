// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [deployer] = await hre.ethers.getSigners();
  console.log("deploying contract with the account: ", deployer.address);
  const balance = await deployer.getBalance();
  console.log(`balance is ${balance.toString()}`);

  // We get the contract to deploy
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const cf = await CrowdFunding.deploy();

  await cf.deployed();

  console.log("cf deployed to:", cf.address);
}
// 0x0e2cB3e67024Fe00870C926D21A5C2401db5eB0F // rinkeby deployement address
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
