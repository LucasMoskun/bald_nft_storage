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
    mapping(bytes32 => address) requestToSender;
    mapping(bytes32 => uint256) requestToTokenId;

    constructor() public ERC721("Creep Kids_t2", "CKt2") {
        //Build and shuffle mint order for random minting
       // uint count = 5;
       // MintOrder = new uint[](count);

       // for(uint i = 0; i < count; i++){
       //     MintOrder[i] = i;
       // }
       // ShuffleMintOrder();

        //chainlink
        setPublicChainlinkToken();
        oracle = 0x2B5c312BC610E27cA9acB0fe5b8Fc41D7DD84456;
        jobId = "43c65516ffbb4da596efd0f73e014133";
        fee = 0.1 * 10 ** 18;
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
        string memory requestPath = string(abi.encodePacked("properties.", stringID));
        TokenIds.increment();

        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("get", "https://ipfs.io/ipfs/bafyreihcokiugahvrqayledae2ivmjff5xkq2xsmnvv62lrne6crlhfbey/metadata.json");
        request.add("path", requestPath);

        bytes32 requestID =  sendChainlinkRequestTo(oracle, request, fee);
        requestToSender[requestID] = msg.sender;
        requestToTokenId[requestID] = intID;

        return requestID;
    }

    function fulfill(bytes32 requestId, bytes32 data) public recordChainlinkFulfillment(requestId)
    {
        string memory mintURI = bytes32ToString(data);
        uint256 mintID = requestToTokenId[requestId];
        _mint(requestToSender[requestId], mintID);
        _setTokenURI(mintID,mintURI);
        emit URIFulfillEvent();
        Message = mintURI;
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
}
