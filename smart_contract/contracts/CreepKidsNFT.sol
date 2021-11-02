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
    uint PromoMintCount;
    mapping (uint32 => address) TokenToAddress;
    mapping (address => bool) whitelist;
    bool Unlocked;
    
    
    event TokenMintEvent(uint256 newID);
    
    string private metadataPath;  

    constructor() public ERC721("Creep Kids_t9", "CKt9") {
        //security
        addToWhitelist(msg.sender);
        Unlocked = false;
        PromoMintCount = 50;

        //nft.storage ipfs hash
        metadataPath = "ipfs://QmWbNqmucZvBNGpyP724eCsoMFqdepnnjb6o7u5oLkDdcpi";

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

    function unlock() public onlyOwner {
        Unlocked = true;
    }

    function tokenURI(uint256  tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function createCreepKid(address receiver, uint count)
        public payable
    {
        require(Unlocked, "Creep Kid Minting is still Locked :-/");
        require(count <= 10, "Not allowed to mint more than 10 at once!");
        require(msg.value >= 0.0001 ether * count, "Not enough eth paid! .0666 per creep");
        require((count + CurrentMintIndex + 1) < 1000, "Unable to mint, not enough creep kids left :-(");

        for(uint i = 0; i < count; i++)
        {
            _mintCreepKid(receiver);
        }
    }

    function promoMint(address receiver, uint count)
    public onlyWhitelisted 
    {
        require(PromoMintCount > 0, "Promo mints exhausted :-(");
        require(count <= 10, "Max per mint is 10!");
        require(PromoMintCount - count > 0, "Count exceeds promo count");

        PromoMintCount -= count;

        console.log("Promom count: ", PromoMintCount);
        for(uint i = 0; i < count; i++)
        {
            _mintCreepKid(receiver);
        }

    }

    function _mintCreepKid(address receiver)
    private
    {
        console.log("Minting creep kid");
        uint256 newID = TokenIds.current();
        string memory randomID = uintToString(MintOrder[CurrentMintIndex]);
        string memory tokenURI = string(abi.encodePacked(metadataPath,'/',randomID));
        _safeMint(receiver, newID);
        _setTokenURI(newID, tokenURI);
        console.log(tokenURI);

        TokenIds.increment();
        CurrentMintIndex++;
        ShuffleMintOrder();
        TokenMintEvent(newID);
    }

    //PAYABLE
    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

    function withdraw(uint256 amount)
    public onlyOwner
    {
        require(amount =< address(this).balance, "Amount requested is too much");
        payable(msg.sender).transfer(amount);
    }

    //WHITELIST
    modifier onlyWhitelisted() {
        require (isWhitelisted(msg.sender));
        _;
    }

    function isWhitelisted(address _address) public view returns(bool){
        return whitelist[_address];
    }

    function addToWhitelist(address _address) public onlyOwner {
        whitelist[_address] = true;
    }

    function removeFromWhitelist(address _address) public onlyOwner {
        whitelist[_address] = false;
    }

    //ENCODING
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
