import { STORAGE_API_KEY } from "./STORAGE_API_KEY.js";
import { NFTStorage, File } from "nft.storage";

export class NFTStorageAccess {
    constructor()
    {
        this.logHello();
        this.logAPIKey();
    }

    logHello()
    {
        console.log("Hello from storage class")
    }

    logAPIKey()
    {
        console.log(STORAGE_API_KEY);
    }
}
