import { STORAGE_API_KEY } from "./STORAGE_API_KEY.js";
import { NFTStorage, File } from "nft.storage";
import fetch from "node-fetch";

export class NFTStorageAccess {
    constructor()
    {
        //this.uploadNFT();
        this.uploadMainList();
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
}
