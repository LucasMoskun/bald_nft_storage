pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract ChainlinkTest is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    bytes32 public requestData;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    string public Message;

    event ConstructorEvent();
    event FulfillEvent();

    constructor() public {
        emit ConstructorEvent();

        setPublicChainlinkToken();
        oracle = 0x2B5c312BC610E27cA9acB0fe5b8Fc41D7DD84456;
        jobId = "43c65516ffbb4da596efd0f73e014133";
        fee = 0.1 * 10 ** 18;
    }

    function requestByteData() public returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("get", "https://ipfs.io/ipfs/bafyreifca2qxtlddhepns6dwmd3fr7z5slct2kr3kof6s4ai635dymuxfa/metadata.json");
        request.add("path", "name");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 requestId, bytes32 data) public recordChainlinkFulfillment(requestId)
    {
        emit FulfillEvent();
        Message = bytes32ToString(data);
    }

    function getMessage() external view returns(string memory){
        return Message;
    }

    function bytes32ToString(bytes32 data) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && data[i] != 0){
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for(i = 0; i < 32 && data[i] != 0; i++) {
            bytesArray[i] = data[i];
        }

        return string(bytesArray);
    }
}


