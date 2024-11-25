const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DeployModule = buildModule("UploadModule", (m) => {
  const uploadContract = m.contract("Voting");
  return uploadContract;
});

module.exports = DeployModule;


//////////////------------------------

// const { ethers } = require('hardhat')
// const fs = require('fs')

// const toWei = (num) => ethers.utils.parseEther(num.toString())

// async function main() {
//   const contract_name = 'Voting'
//   const Contract = await ethers.getContractFactory(contract_name)
//   const contract = await Contract.deploy()

//   await contract.deployed()

//   const address = JSON.stringify({ address: contract.address }, null, 4)
//   fs.writeFile('./artifacts/contractAddress.json', address, 'utf8', (err) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     console.log('Deployed contract address', contract.address)
//   })
// }

// main().catch((error) => {
//   console.error(error)
//   process.exitCode = 1
// })