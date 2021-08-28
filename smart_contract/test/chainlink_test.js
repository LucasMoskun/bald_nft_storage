const {expect} = require("chai");
const helper = require("@chainlink/test-helpers");

describe("Chainlink Test", function () {
  this.timeout(80000)
  it("Running chainlink test", async function () {
    const owner = await ethers.getSigner(0);
    console.log("Signer address: ", owner.address);

    const abi = await ethers.getContractFactory("ChainlinkTest");
    //const contract = await abi.deploy();
    //await contract.deployed();
    console.log("Contract Deployed");

    const contract = await abi.attach("0x61deCd3932af42e8CDF5C78926FD61BeFdfB058F");
    await contract.connect(owner.address);

    console.log("Contract address: ", contract.address);

    //await expect(contract.deployTransaction).to.emit(contract, "ConstructorEvent");
    //console.log("after await event");


    //get LINK contract
    const linkContract = await hre.ethers.getVerifiedContractAt('0x01be23585060835e02b77ef475b0cc51aa1e0709');
    await linkContract.connect(owner.address);
    console.log("link contract established");

    const name = await linkContract.name();
    console.log("name: ", name);

    const linkValue = 0.1 * 10 ** 18;
    console.log(linkValue);
    const testValue = 1000000;
    //const linkBig = BigNumber.from(linkValue);
    const linkTransfer = await linkContract.transfer(contract.address, linkValue.toString());
    console.log("Transfer requested");
    await linkTransfer.wait();

    console.log("Requesting data...");
    const requestID = await contract.requestByteData();
    const receipt = await requestID.wait();
    const id = helper.decodeRunRequest(receipt.rawLogs[3]);
    console.log("Request ID done waiting: ", requestID);
    console.log("Request ID: ", id);

    const message = await contract.getMessage();
    console.log("message: ", message);
    //await expect(contract).to.emit(contract, "FulfillEvent");
  });
});
