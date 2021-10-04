pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract CreepKidsNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private TokenIds;
    uint[] MintOrder;
    mapping (uint32 => address) TokenToAddress;
    
    event TokenMintEvent(uint256 newID);
    string private metadataPath;  

    string private Message;

    constructor() public ERC721("Creep Kids_t7", "CKt7") {
        //chainlink
        metadataPath = "ipfs://bafybeihef7shrdfoc366rq4l7u7womdzazk3tsrlcstvupmiv2imsyrkqq";
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

    function createCreepKid(address receiver)
        public onlyOwner
        returns(uint256)
    {
        
        uint256 newID = TokenIds.current();
        string memory stringID = uintToString(newID);
        string memory tokenURI = string(abi.encodePacked(metadataPath,'/',stringID));
        _mint(receiver, newID);
        _setTokenURI(newID, tokenURI);
        console.log("Minted new nft");

        TokenIds.increment();
        TokenMintEvent(newID);
        Message = tokenURI;
        return newID;
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

}
