
const {expect} = require("chai");

describe("Creep Kid Test", function() {
  it("Running tests on creep kids nft", async function () {

    console.log("Getting signers");
    //const [owner, addr1, addr2] = await ethers.getSigners();
    const owner = await ethers.getSigner(0);
    const addr1 = await ethers.getSigner(1);
    console.log("address: ", owner.address);
    console.log("address: ", addr1.address);

    console.log("Getting token");
    const token = await ethers.getContractFactory("CreepKidsNFT");
    await token.connect(addr1);
    
    console.log("Deploying token");
    const hardhatToken = await token.deploy();

    const ownerBalance = await hardhatToken.balanceOf(addr1.address);
    console.log("Owner balance: ", ownerBalance);
    
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(ownerBalance);
    hardhatToken.testLog();
  });    
});
