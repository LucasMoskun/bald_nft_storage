pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

    constructor() public ERC721("Creep Kids_t12", "CKtX") {
        //security
        Unlocked = false;
        PromoMintCount = 50;

        //nft.storage ipfs hash
        metadataPath = "ipfs://QmWbNqmucZvBNGpyP724eCsoMFqdepnnjb6o7u5oLkDdcp";

        //random mint initialization
        CurrentMintIndex = 0;
    }

    function initMinitOrder() 
    public onlyOwner
    {
       uint count = 1000;
       MintOrder = new uint[](count);

       for(uint i = 0; i < count; i++){
           MintOrder[i] = i;
       }
    }

    function _shuffleMintOrder(uint shuffleNum) private {
        uint cap;
        if(MintOrder.length - CurrentMintIndex > 150)
        {
            cap = CurrentMintIndex + shuffleNum;
        }
        else
        {
            cap = MintOrder.length;
        }
        for(uint i = CurrentMintIndex; i < cap; i++){
            uint randIndex = 
                i + uint256(keccak256(abi.encodePacked(block.timestamp))) %
                (cap - i);
            uint holder = MintOrder[randIndex];
            MintOrder[randIndex] = MintOrder[i];
            MintOrder[i] = holder;
        }
    }

    function fullShuffle()
    public onlyOwner
    {
        _shuffleMintOrder(MintOrder.length);
    }

    function unlock() public onlyOwner {
        Unlocked = true;
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
        _shuffleMintOrder(100);
    }

    function promoMint(address receiver, uint count)
    public onlyOwner 
    {
        require(PromoMintCount > 0, "Promo mints exhausted :-(");
        require(count <= 10, "Max per mint is 10!");
        require(PromoMintCount - count > 0, "Count exceeds promo count");

        PromoMintCount -= count;

        for(uint i = 0; i < count; i++)
        {
            _mintCreepKid(receiver);
        }
        _shuffleMintOrder(100);
    }

    function _mintCreepKid(address receiver)
    private
    {
        uint256 newID = TokenIds.current();
        string memory randomID = uintToString(MintOrder[CurrentMintIndex]);
        string memory tokenURI = string(abi.encodePacked(metadataPath,'/',randomID));
        _safeMint(receiver, newID);
        _setTokenURI(newID, tokenURI);

        TokenIds.increment();
        CurrentMintIndex++;
        TokenMintEvent(newID);
    }

    //PAYABLE
    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

    function withdraw(uint256 amount)
    public onlyOwner
    {
        require(amount <= address(this).balance, "Amount requested is too much");
        payable(msg.sender).transfer(amount);
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
