
describe("Creep Kid Deploy", function() {
  this.timeout(800000)
  it("Deploying Creep Kid Contract", async function() {
    console.log("Starting...")

    const owner = await ethers.getSigner(0);
    console.log("Getting token");
    const token = await ethers.getContractFactory("CreepKidsNFT");

    console.log("Deploying contract...");
    const contract = await token.deploy({
      gasLimit:6660666
    });
    console.log("Contract address: " + contract.address);
    console.log("transaction hash: " + contract.deployTransaction.hash);
    await contract.deployed();

    console.log("Deployed");

  });
});
