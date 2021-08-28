
const {expect} = require("chai");
 
describe("Creep Kid Test", function() {
  this.timeout(800000)
  it("Running tests on creep kids nft", async function () {

    console.log("Getting signers");
    //const [owner, addr1, addr2] = await ethers.getSigners();
    const owner = await ethers.getSigner(0);
    //const addr1 = await ethers.getSigner(1);
    console.log("address: ", owner.address);
    //console.log("address: ", addr1.address);

    console.log("Getting token");
    const token = await ethers.getContractFactory("CreepKidsNFT");
    //await token.connect(addr1);
    
    console.log("Deploying token");
    const contract = await token.deploy();
    console.log("Contract address:" + contract.address);

    //const ownerBalance = await contract.balanceOf(addr1.address);
    //console.log("Owner balance: ", ownerBalance);
    
    //expect(await contract.balanceOf(owner.address)).to.equal(ownerBalance);
    
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

    
    //await contract.transfer(contract.address, .01);

    console.log("Requesting data...");
    const requestID = await contract.MintCreepKid();
    const receipt = await requestID.wait();
    const id = receipt.events[0].topics[1];
    console.log("Request ID: ", id);

    
    await new Promise(resolve => setTimeout(resolve, 60000))
    console.log("Exiting");

  });    
});
