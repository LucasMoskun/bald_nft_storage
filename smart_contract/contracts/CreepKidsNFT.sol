pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

import "hardhat/console.sol";

contract CreepKidsNFT is ERC721, ERC721URIStorage, Ownable, ChainlinkClient {
    using Counters for Counters.Counter;
    using Chainlink for Chainlink.Request;

    Counters.Counter private TokenIds;
    uint[] MintOrder;
    mapping (uint32 => address) TokenToAddress;
    
    //chainlink
    event URIFulfillEvent();
    bytes32 public requestData;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    string public Message;
    mapping(bytes32 => address) private requestToSender;
    mapping(bytes32 => uint256) private requestToTokenId;
    mapping(bytes32 => bytes32) private requestToPrimary;
    mapping(bytes32 => bytes32) private requestToSecond;
    mapping(bytes32 => bytes32) private requestToFirstArrival;
    string private metadataPath;  

    constructor() public ERC721("Creep Kids_t2", "CKt2") {
        //chainlink
        setPublicChainlinkToken();
        oracle = 0x2B5c312BC610E27cA9acB0fe5b8Fc41D7DD84456;
        jobId = "43c65516ffbb4da596efd0f73e014133";
        fee = 0.1 * 10 ** 18;
        metadataPath = "https://ipfs.io/ipfs/bafyreig5abkcdx2urgtl7fmor5fwb64ywurxxoj7syys42r65vkpsirgqi/metadata.json";
    }

    function InitMinitOrder() private {
       uint count = 5;
       MintOrder = new uint[](count);

       for(uint i = 0; i < count; i++){
           MintOrder[i] = i;
       }
    }

    function ShuffleMintOrder() private {
        for(uint i = 0; i < MintOrder.length; i++){
            uint randIndex = 
                i + uint256(keccak256(abi.encodePacked(block.timestamp))) %
                (MintOrder.length - i);
            uint holder = MintOrder[randIndex];
            MintOrder[randIndex] = MintOrder[i];
            MintOrder[i] = holder;
        }
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256  tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function CreateNFT(address receiver, string memory tokenURI)
        public onlyOwner
        returns(uint256)
    {
        TokenIds.increment();

        uint256 newID = TokenIds.current();
        _mint(receiver, newID);
        _setTokenURI(newID, tokenURI);
        console.log("Minted new nft");

        return newID;
    }

    //Chainlink ********************************
    function requestByteData() public returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("get", "https://ipfs.io/ipfs/bafyreifca2qxtlddhepns6dwmd3fr7z5slct2kr3kof6s4ai635dymuxfa/metadata.json");
        request.add("path", "name");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function MintCreepKid() public returns (bytes32 requestId)
    {
        console.log("mint sender: ", msg.sender);
        uint256 intID = TokenIds.current();
        string memory stringID = uintToString(intID);
        string memory pathBase =  string(abi.encodePacked("properties.", stringID));
        string memory primaryRequestPath = string(abi.encodePacked(pathBase, ".1"));
        string memory secondRequestPath = string(abi.encodePacked(pathBase, ".2"));
        TokenIds.increment();

        Chainlink.Request memory primaryRequest = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        Chainlink.Request memory secondRequest = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        primaryRequest.add("get", metadataPath);
        primaryRequest.add("path", primaryRequestPath);

        secondRequest.add("get", metadataPath);
        secondRequest.add("path", secondRequestPath);

        bytes32 primaryRequestID = sendChainlinkRequestTo(oracle, primaryRequest, fee);
        bytes32 secondRequestID = sendChainlinkRequestTo(oracle, secondRequest, fee);

        requestToPrimary[secondRequestID] = primaryRequestID;
        requestToSecond[primaryRequestID] = secondRequestID;
        requestToSender[primaryRequestID] = msg.sender;
        requestToTokenId[primaryRequestID] = intID;
        
        return primaryRequestID;
    }

    function fulfill(bytes32 requestId, bytes32 data) public recordChainlinkFulfillment(requestId)
    {
        //make sure this is a request we want
        require(
            requestToPrimary[requestId] != 0 ||
            requestToSecond[requestId] != 0,
            "invalid request ID");

        //check if  primary address
        bool isPrimary = (requestToPrimary[requestId] == 0);
        
        //Get primary requestID if secondary
        bytes32 primaryID;
        if(!isPrimary){
            primaryID = requestToPrimary[requestId];
        } else {
            primaryID = requestId;
        }

        //check if we've received data for this pair
        bytes32 receivedBytes = requestToFirstArrival[primaryID];
        if(receivedBytes == 0){
            //first data received
            requestToFirstArrival[primaryID] = data;
            //wait for second request to arrive
            return;
        }

        bytes memory fullData;
        //if primary add passed data first
        if(isPrimary){
            fullData =  concatenate(data, receivedBytes);
        } else {
            fullData = concatenate(receivedBytes, data);
        }
        
        string memory pathStart = "https://ipfs.io/ipfs/";
        string memory pathFinish = "/metadata.json";
        string memory body = bytesToString(fullData); 
        string memory mintURI = string(abi.encodePacked(pathStart, body, pathFinish));

        uint256 mintID = requestToTokenId[requestId];
        _mint(requestToSender[requestId], mintID);
        _setTokenURI(mintID,mintURI);
        emit URIFulfillEvent();
        Message = mintURI;
    }

    function getMessage() external view returns(string memory){
        return Message;
    }

    function concatenate(bytes32 x, bytes32 y) public pure returns (bytes memory) {
        return abi.encodePacked(x, y);
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

    function uintToString(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function bytesToString(bytes memory byteCode) public pure returns(string memory stringData)
    {
        uint256 blank = 0; //blank 32 byte value
        uint256 length = byteCode.length;

        uint cycles = byteCode.length / 0x20;
        uint requiredAlloc = length;

        if (length % 0x20 > 0) //optimise copying the final part of the bytes - to avoid looping with single byte writes
            {
                cycles++;
                requiredAlloc += 0x20; //expand memory to allow end blank, so we don't smack the next stack entry
            }

            stringData = new string(requiredAlloc);

            //copy data in 32 byte blocks
            assembly {
                let cycle := 0

                for
                    {
                        let mc := add(stringData, 0x20) //pointer into bytes we're writing to
                        let cc := add(byteCode, 0x20)   //pointer to where we're reading from
                    } lt(cycle, cycles) {
                        mc := add(mc, 0x20)
                        cc := add(cc, 0x20)
                        cycle := add(cycle, 0x01)
                    } {
                        mstore(mc, mload(cc))
                    }
            }

            //finally blank final bytes and shrink size (part of the optimisation to avoid looping adding blank bytes1)
            if (length % 0x20 > 0)
                {
                    uint offsetStart = 0x20 + length;
                    assembly
                    {
                        let mc := add(stringData, offsetStart)
                        mstore(mc, mload(add(blank, 0x20)))
                        //now shrink the memory back so the returned object is the correct size
                        mstore(stringData, length)
                    }
                }
    }
}
