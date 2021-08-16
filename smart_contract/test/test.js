
const {expect} = require("chai");

describe("Creep Kid Test", function() {
  it("Running tests on creep kids nft", async function () {

    console.log("Getting signers");
    const [owner] = await ethers.getSigners();
    console.log("address: ", owner.address);

    console.log("Getting token");
    const token = await ethers.getContractFactory("CreepKidsNFT");
    
    console.log("Deploying token");
    const hardhatToken = await token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    console.log("Owner balance: ", ownerBalance);
    
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(ownerBalance);
  });    
});
