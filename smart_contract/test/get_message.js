
const {expect} = require("chai");
 
describe("Creep Kid Test", function() {
  this.timeout(800000)
  it("Running tests on creep kids nft", async function () {

    console.log("Getting signers");
    const owner = await ethers.getSigner(0);
    console.log("address: ", owner.address);

    console.log("Getting abi");
    const abi = await ethers.getContractFactory("CreepKidsNFT");
    
    console.log("Connectong to contract");
    const contractAddress = "0x5DD28584D88aa72CF3807502d9F1E5e601DF3CF8"
    const contract = await abi.attach(contractAddress);
    
    console.log("Requesting last message...");
    const message = await contract.getMessage();
    console.log("Message: " + message);
    
    console.log("Exiting");

  });    
});
