const Web3 = require("web3");
require('dotenv').config();

const WS_API_URL = process.env.WS_API_URL;
const API_URL = process.env.API_URL;
const METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;

let web3 = new Web3(
  new Web3.providers.WebsocketProvider(WS_API_URL)
);

const contractJson = require("../artifacts/contracts/CreepKidsNFT.sol/CreepKidsNFT.json")
const contractAddress = "0x2f583Fa91ef74DACfFeadA0F47C60bB1c19AEAF3";
const contract = new web3.eth.Contract(contractJson.abi, contractAddress);

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(METAMASK_PUBLIC_KEY, 'latest');
  const tx = {
    from: METAMASK_PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 1000000,
    data: contract.methods
      .CreateNFT(METAMASK_PUBLIC_KEY, tokenURI)
      .encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(
    tx,
    METAMASK_PRIVATE_KEY
  );
  
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function(err, hash) {
          if(!err) {
            console.log(
              "Transaction hash: ", hash
            );
          }
          else{
            console.log("Transaction error: ", err);
          }
        }
      );
    })
}

mintNFT("https://ipfs.io/ipfs/bafyreigsv3ea6ggjwtuwjxj2gr43hb3qopqoj6tzoekbce2yzesjyf7wn4/metadata.json");

