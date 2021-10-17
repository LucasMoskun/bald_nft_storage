
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

    for(let i = 0; i < 66; i++){
      console.log("Minting NFT count: ", i)
      const mintTx = await contract.createCreepKid(owner.address);
      const receipt = await mintTx.wait();
      console.log("Token ID: ", receipt.events?.filter((x) => {return x.event == "TokenMintEvent"}));
      console.log("Token URI: ", await contract.getMessage());
    }

    
    console.log("Exiting");

  });    
});
