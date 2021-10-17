const {expect} = require("chai");

describe("Creep Kid Mint Test", function () {
  this.timeout(8000000000)
  it("Minting creep kids", async function () {

    console.log("Getting Signers");
    const owner = await ethers.getSigner(0);

    console.log("Getting token");
    const token = await ethers.getContractFactory("CreepKidsNFT");

    console.log("Connecting to contract");
    const contractAddress = "0x865AAd4689e5aBA7D0610f3e17BAF4439EA059eC"
    const contract = await token.attach(contractAddress);
    await contract.connect(owner.address);

    for(let i = 0; i < 66; i++){
      console.log("Minting NFT count: ", i)
      const mintTx = await contract.createCreepKid(owner.address);
      const receipt = await mintTx.wait();
      console.log("Token ID: ", receipt.events?.filter((x) => {return x.event == "TokenMintEvent"}));
      //console.log("Token URI: ", await contract.getMessage());
    }

    console.log("Finished minting");

  });
});
