import { STORAGE_API_KEY } from "./STORAGE_API_KEY.js";
import { NFTStorage, File } from "nft.storage";
import nodeFetch, {RequestInit} from "node-fetch";
import {FormData} from 'formdata-node'
//import * as FormData from 'form-data';

export class NFTStorageAccess {
    constructor()
    {
        //this.uploadNFT();
        //this.uploadMainList();
        //this.uploadDirectory();
        //this.testMetadataPost();
        this.uploadCharacterSet();
        //this.writeMain();
    }

    async testMetadataPost()
    {
        const nftData = {
            name: 'sea_monster',
            description: 'cool vibes from the deep',
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
        };
         
        const jsonObj = {
            directory: "./public/yaaa/",
            fileName: "yooo.json",
            nftData
        }

        const fileData = JSON.stringify(jsonObj);
        const fileUri =  "http://127.0.0.1:3000/storage_uri/";
        const response = await nodeFetch(fileUri,{
            method: 'POST',
            body: fileData,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        });
    }

    async postMetaData(basePath, characterName, uri, id)
    {
        var storageURI = {};
        storageURI[id] = uri;
        const outBase = "./public/" + basePath + "/" + characterName + "/" 
        const outName =  id + ".json"

        console.log(outName);

        const jsonObj = {
            directory: outBase,
            fileName: outName,
            storageURI
        }
        const data = JSON.stringify(jsonObj);
        const requestURI = "http://127.0.0.1:3000/storage_uri/" 
        const response = await nodeFetch(requestURI, {
            method: 'POST',
            body: data,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        });
        console.log(response.status)

    }
    
    async writeMain()
    {
        const jsonObj = {
            storageURIDir: "./public/nft_storage_uri"
        }

        const data = JSON.stringify(jsonObj);
        const requestURI = "http://127.0.0.1:3000/compile_main/" 
        const response = await nodeFetch(requestURI, {
            method: 'POST',
            body: data,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        });
        console.log(response.status)
    }

    async testWriteOutURI(count)
    {
        for(let i = 0; i < count; i++){
            const pathBase = "nft_storage_uri";
            await this.postMetaData(pathBase, "PUNK", "http://creep-kids.io", i)
        }
    }
    
    async GetCharacterList()
    {
        const metaFileUri = "http://127.0.0.1:3000/output/v5/character_names.json";

        const metaResponse = await nodeFetch(metaFileUri);
        const metaJson = await metaResponse.json();
        return metaJson
    }

    async retreiveJsonData(metaPath)
    {
        const dataResponse = await nodeFetch(metaPath);
        const dataJson = await dataResponse.json();
        return dataJson;
    }

    async listCharacterMetadata(count, metaPathBase)
    {
        for(let i = 0; i < count; i++) {
            const path = metaPathBase + i.toString() + ".json"
            const data = await this.retreiveJsonData(path)
            console.log(data.attributes)
        }
    }

    async uploadCharacterSet()
    {
        const client = new NFTStorage({ token: STORAGE_API_KEY })
        //Get list of file names
        const characters = await this.GetCharacterList()
        console.log(characters)
        console.log(characters.names[0])

        const name = characters.names[0];
        const metaPathBase = "http://127.0.0.1:3000/output/v5/" + name + "/meta/"
        const descriptorPath = metaPathBase + name + ".json";
        const descriptor = await this.retreiveJsonData(descriptorPath);
        console.log(descriptor.count);
        //this.listCharacterMetadata(descriptor.count, metaPathBase)
        await this.testWriteOutURI(descriptor.count)
        await this.writeMain();
        //cycle through all assets
        //get gif
        //get metadata
        //upload asset
        //write out uri link
        
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

        const cid = await client.storeDirectory([
            testFile,
            testFile2
        ])
        console.log("Directory cid: ", cid);
        const status = await client.status(cid);
        console.log("Storage status: ", status);


    }
}
