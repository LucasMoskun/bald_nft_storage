const {expect} = require("chai");

describe("Creep Kid Mint Test", function () {
  this.timeout(8000000000)
  it("Minting creep kids", async function () {

    console.log("Getting Signers");
    const owner = await ethers.getSigner(0);

    console.log("Getting token");
    const token = await ethers.getContractFactory("CreepKidsNFT");

    console.log("Connecting to contract");
    const contractAddress = "0xbD0AE06501843DF64040A8fbf3e0C50A0D24ED73"
    const contract = await token.attach(contractAddress);
    await contract.connect(owner.address);

    console.log("Minting NFT");
    const mintTx = await contract.promoMint(owner.address, 1);
    //console.log("Token ID: ", receipt.events?.filter((x) => {return x.event == "TokenMintEvent"}))
    //console.log("Token URI: ", await contract.getMessage());

    console.log("Finished minting");

  });
});
