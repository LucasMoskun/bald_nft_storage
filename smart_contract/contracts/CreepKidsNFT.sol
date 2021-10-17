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
    uint CurrentMintIndex;
    mapping (uint32 => address) TokenToAddress;
    
    event TokenMintEvent(uint256 newID);
    string private metadataPath;  

    string private Message;

    constructor() public ERC721("Creep Kids_t9", "CKt9") {
        //nft.storage ipfs hash
        metadataPath = "ipfs://bafybeieit72jfqucbzljncdbqxoopf4gqzgdzrv5twpk4enksybmqw26tu";

        //random mint initialization
        CurrentMintIndex = 0;
        InitMinitOrder();
    }

    function InitMinitOrder() private {
       uint count = 89;
       MintOrder = new uint[](count);

       for(uint i = 0; i < count; i++){
           MintOrder[i] = i;
       }
    }

    function ShuffleMintOrder() private {
        for(uint i = CurrentMintIndex; i < MintOrder.length; i++){
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
        string memory randomID = uintToString(MintOrder[CurrentMintIndex]);
        string memory tokenURI = string(abi.encodePacked(metadataPath,'/',randomID));
        _mint(receiver, newID);
        _setTokenURI(newID, tokenURI);

        TokenIds.increment();
        CurrentMintIndex++;
        ShuffleMintOrder();
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
