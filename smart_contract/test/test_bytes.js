
describe("Byte Test", function(){
  this.timeout(800000)
  it("running byte test", async function () {

    const abi = await ethers.getContractFactory("ByteTest");
    const contract = await abi.deploy();
    console.log("Contract Deployed");

  });
});
