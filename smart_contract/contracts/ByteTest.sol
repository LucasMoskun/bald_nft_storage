pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ByteTest {
    constructor() public {
        console.log("Byte Test Constructor");

        string memory testString1 = "bafyreigsv3ea6ggjwtuwjxj2gr43hb3";
        console.log("TestString1: ",testString1);
        string memory testString2 = "qopqoj6tzoekbce2yzesjyf7wn4";
        console.log("TestString1: ", testString1);
        bytes32 testBytes1 = stringToBytes32(testString1);
        bytes32 testBytes2 = stringToBytes32(testString2);
        bytes memory concatenatedBytes = concatenate(testBytes1,testBytes2);
        string memory result = bytesToString(concatenatedBytes);
        console.log("result: ",result);
    }

    function concatenate(bytes32 x, bytes32 y) public pure returns (bytes memory) {
        return abi.encodePacked(x, y);
    }

    function bytes32ToString(bytes32 data) private pure returns (string memory) {
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

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
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
