
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

    console.log("Init Mint order")
    const orderTx = await contract.initMinitOrder();

    //fullShuffle
    console.log("Shuffling...");
    const shuffleTx = await contract.fullShuffle();

    //test promo mint
    bestAddress = "0xFe21cD83736FA6CAc6336689342778A3663fFB45"
    console.log("Promo Mint...");
    const promoTx = await contract.promoMint(bestAddress, 10);

    //test unlock
    console.log("Unlocking...")
    const unlockTx = await contract.unlock();

    //Test mint and owner withdraw
    console.log("Owner balance: " +  await owner.getBalance());
    console.log("Requesting data...");
    const mintTx = await contract.createCreepKid(owner.address, 1, 
      {value: ethers.utils.parseEther("0.001")});
    const receipt = await mintTx.wait();
    console.log("Token ID: ", receipt.events?.filter((x) => {return x.event == "TokenMintEvent"}));
    console.log("contract balance " + await contract.getBalance());
    console.log("Owner balance: " +  await owner.getBalance());
    await contract.withdraw(await contract.getBalance());
    console.log("Owner balance: " +  await owner.getBalance());


    console.log("Requesting data...");
    const mintTx2 = await contract.createCreepKid(owner.address, 4);
    const receipt2 = await mintTx2.wait();
    console.log("Token ID: ", receipt2.events?.filter((x) => {return x.event == "TokenMintEvent"}));
    console.log("Token URI: ", await contract.getMessage());
    
    console.log("Exiting");

  });    
});
