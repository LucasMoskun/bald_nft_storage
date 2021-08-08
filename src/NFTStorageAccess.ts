import { STORAGE_API_KEY } from "./STORAGE_API_KEY.js";

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