
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
    
    //get LINK contract
    const linkContract = await hre.ethers.getVerifiedContractAt('0x01be23585060835e02b77ef475b0cc51aa1e0709');
    await linkContract.connect(owner.address);
    console.log("link contract established");

    const name = await linkContract.name();
    console.log("name: ", name);

    const linkValue = 0.1 * 10 ** 18;
    console.log(linkValue);
    const linkTransfer = await linkContract.transfer(contract.address, linkValue.toString());
    console.log("Transfer requested");
    await linkTransfer.wait();

    console.log("Requesting data...");
    const requestID = await contract.MintCreepKid();
    const receipt = await requestID.wait();
    const id = receipt.events[0].topics[1];
    console.log("Request ID: ", id);

    
    await new Promise(resolve => setTimeout(resolve, 60000))
    console.log("Exiting");

  });    
});
