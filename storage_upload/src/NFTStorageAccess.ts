import { STORAGE_API_KEY } from "./STORAGE_API_KEY.js";
import { NFTStorage, File } from "nft.storage";
import fetch from "node-fetch";
//jimport PNG from 'png-ts';
//import * as pug from './../src/pug.png'
//const pug = require("pug.png");

export class NFTStorageAccess {
    constructor()
    {
        this.logHello();
        //this.logAPIKey();
        this.uploadNFT();
    }

    logHello()
    {
        console.log("Hello from storage class")
    }

    logAPIKey()
    {
        console.log(STORAGE_API_KEY);
    }

    async uploadNFT()
    {
        const client = new NFTStorage({ token: STORAGE_API_KEY })
        

        const fileUri =  "http://127.0.0.1:8080/demon.gif";

        const httpResponse = await fetch(fileUri);
        const buffer: ArrayBuffer = await httpResponse.arrayBuffer();
        const bytes: Uint8Array = new Uint8Array(buffer);

        const metadata = await client.store({
            name: 'pug_life',
            description: 'A fearless pug',
            image: new File([bytes], 'demon.gif', { type: 'image/gif' }),
            properties: {
                cuteness: 'Off the charts',
                friendlieness: 'limitless'
            }
        })

        console.log('IPFS URL for the metadata:', metadata.url)
        console.log('metadata.json contents:\n', metadata.data)
        console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed())
    }
}
