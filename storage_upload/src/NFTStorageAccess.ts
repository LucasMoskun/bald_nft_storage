import { STORAGE_API_KEY } from "./STORAGE_API_KEY.js";
import { NFTStorage, File } from "nft.storage";
import nodeFetch, {RequestInit} from "node-fetch";

export class NFTStorageAccess {
    constructor()
    {
        //this.uploadNFT();
        //this.uploadMainList();
        //this.uploadDirectory();
        //this.testMetadataPost();
        
        this.uploadCharacterSet();
        //this.writeMain();
        //this.uploadMainDirectory()
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

    async retrieveImageBytes(imagePath)
    {
        const httpResponse = await nodeFetch(imagePath);
        const buffer: ArrayBuffer = await httpResponse.arrayBuffer();
        const bytes: Uint8Array = new Uint8Array(buffer);
        return bytes;
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

        //assign image and meta data paths
        const pathBase = "http://127.0.0.1:3000/output/v5/" + name 
        const metaPathBase = pathBase + "/meta/"
        const gifPathBase = pathBase + "/gif/"
        const descriptorPath = metaPathBase + name + ".json";

        //get descriptor for asset count
        const descriptor = await this.retreiveJsonData(descriptorPath);
        console.log(descriptor.count);

        //for each item in descriptor
        for(let i = 0; i < descriptor.count; i++) {

            //get image and metada paths
            const metaPath = metaPathBase + i.toString() + ".json"
            const imagePath = gifPathBase + i.toString() + ".gif"

            //Get json properties for image
            const propertiesData = await this.retreiveJsonData(metaPath)
            //console.log(propertiesData.attributes)

            //get image 
            console.log("Image path: " + imagePath);
            const imageResponse = await nodeFetch(imagePath);
            const buffer: ArrayBuffer = await imageResponse.arrayBuffer();
            const bytes: Uint8Array = new Uint8Array(buffer);
            //const imageBytes = await this.retrieveImageBytes(imagePath);
            //console.log(imageBytes.length)

            //upload metadata to nft storage
            const nftDescription = "Wild in the streets"
            const nftName = name + " " + i.toString()
            const nftFileName = name + "_" + i.toString() + ".gif"
            const metadata = await client.store({
                name: nftName,
                description: nftDescription,
                image: new File([bytes], nftFileName, {type: 'image/gif'}),
                attributes: propertiesData.attributes
            })

            //write out storage matadata url
            const pathBase = "nft_storage_uri";
            await this.postMetaData(pathBase, name, metadata.url, i);

            console.log("store: ", pathBase, " ", name, " ", metadata.url, " ", i)

        }

        
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

    async uploadMainDirectory()
    {
        //******************************************
        //Current CID 'bafybeiew577rqzp6bpkbjwej22wjt3qnzz7dpyldpo74yd3wi6z3yrt34y
        //Contract 0xb819D3A13562fC9cc5454776f5d67792773f32d1
        //******************************************
        
        const client = new NFTStorage({ token: STORAGE_API_KEY });
        const pathBase = "http://127.0.0.1:3000/nft_storage_uri/main_storage_uri_list.json" 
        
        const mainResponse = await nodeFetch(pathBase);
        const mainJson = await mainResponse.json();
        //console.log(mainJson)

        const fileArray : File[] = []
        for(var key in mainJson){
            console.log(key)
            //console.log(mainJson[key]

            const httpStart = "https://ipfs.io/ipfs/"
            const ipfsURI = mainJson[key]
            const strippedURI = ipfsURI.substring(7)
            const httpURI = httpStart + strippedURI
            console.log(httpURI)
            const metaResponse = await nodeFetch(httpURI);
            const metaJson = await metaResponse.json();
            const fileData = JSON.stringify(metaJson);
            const newFile : File = new File([fileData],key)
            fileArray.push(newFile);
        }

        const cid = await client.storeDirectory(fileArray)
        
        console.log("Directory cid: ", cid);
        const status = await client.status(cid);
        console.log("Storage status: ", status);

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
