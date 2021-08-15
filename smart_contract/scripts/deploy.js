
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  const contract = await ethers.getContractFactory("CreepKidsNFT");

  const result = await contract.deploy();
  console.log("Contract deployed to address: ", result.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
