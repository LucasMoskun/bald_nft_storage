import { STORAGE_API_KEY } from "./STORAGE_API_KEY.js";
import { NFTStorage, File } from "nft.storage";
import fetch from "node-fetch";

export class NFTStorageAccess {
    constructor()
    {
        //this.uploadNFT();
        //this.uploadMainList();
        this.uploadDirectory();
    }

    async uploadNFT()
    {
        const client = new NFTStorage({ token: STORAGE_API_KEY })
        
        const fileUri =  "http://127.0.0.1:8080/sea_monster.gif";

        const httpResponse = await fetch(fileUri);
        const buffer: ArrayBuffer = await httpResponse.arrayBuffer();
        const bytes: Uint8Array = new Uint8Array(buffer);

        const metadata = await client.store({
            name: 'sea_monster',
            description: 'cool vibes from the deep',
            image: new File([bytes], 'sea_monster.gif', { type: 'image/gif' }),
            properties: {
                strength: '80',
                evilness: '95',
                intelligencex: '60',
                agility: '85',
                luck: '90',
                charm: '86',
                magic: '79',
                health: '88'
            }
        })

        console.log('IPFS URL for the metadata:', metadata.url)
        console.log('metadata.json contents:\n', metadata.data)
        console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed())
    }

    async uploadMainList()
    {
        const client = new NFTStorage({ token: STORAGE_API_KEY });

        const metaFileUri = "http://127.0.0.1:8080/json/CreepKidsMetadataDict.json";
        const imageUri =  "http://127.0.0.1:8080/gif/devo.gif";

        const metaResponse = await fetch(metaFileUri);
        const metaJson = await metaResponse.json();

        const imageResponse = await fetch(imageUri);
        const buffer: ArrayBuffer = await imageResponse.arrayBuffer();
        const bytes: Uint8Array = new Uint8Array(buffer);

        const metadata = await client.store({
            name: 'main_data',
            description: 'dictionary of id to uri',
            image: new File([bytes], 'devo.gif', { type: 'image/gif' }),
            properties: metaJson
        })

        console.log('IPFS URL for the metadata:', metadata.url)
        console.log('metadata.json contents:\n', metadata.data)
        console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed())

    }

    async uploadDirectory()
    {
        const client = new NFTStorage({ token: STORAGE_API_KEY });
        const url1 = "https://ipfs.io/ipfs/bafyreifca2qxtlddhepns6dwmd3fr7z5slct2kr3kof6s4ai635dymuxfa/metadata.json";
        const url2 = "https://ipfs.io/ipfs/bafyreigsv3ea6ggjwtuwjxj2gr43hb3qopqoj6tzoekbce2yzesjyf7wn4/metadata.json";

        const metaResponse = await fetch(url1);
        const metaJson = await metaResponse.json();
        const fileData = JSON.stringify(metaJson);

        const metaResponse2 = await fetch(url2);
        const metaJson2 = await metaResponse2.json();
        const fileData2 = JSON.stringify(metaJson2);

        console.log("Fetched Data 1: ", metaJson);
        console.log("Fetched Data 2: ", metaJson2);
        const testFile: File = new File([fileData],"0");
        const testFile2: File = new File([fileData2],"1");
        console.log("Created file");

    }
}
