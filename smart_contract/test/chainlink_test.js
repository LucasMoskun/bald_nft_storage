const {expect} = require("chai");

describe("Chainlink Test", function () {
  this.timeout(40000)
  it("Running chainlink test", async function () {
    const owner = await ethers.getSigner(0);
    console.log("Signer address: ", owner.address);

    const abi = await ethers.getContractFactory("ChainlinkTest");
    const contract = await abi.deploy();
    console.log("Contract Deployed");

    await expect(contract.deployTransaction).to.emit(contract, "ConstructorEvent");
    console.log("after await event");
  });
});
