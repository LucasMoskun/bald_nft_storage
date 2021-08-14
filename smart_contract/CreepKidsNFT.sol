pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CreepKidsNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counter.Counter privated TokenIds;

    constructor() public ERC721("CreepKidsNFT", "CK") {}

    function CreateNFT(address receiver, string memory tokenURI)
        public onlyOwner
        returns(uint256)
    {
        TokenIds.increment();

        unit256 newID = _tokenIds.current();
        _mint(receiver, newItemId);
        _setTokenURI(newID, tokenURI);

        return newID;
    }
}
