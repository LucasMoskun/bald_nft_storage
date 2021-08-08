import {NFTStorage} from "./NFTStorage.js"

console.log("hello world");

async function hello() {
    return 'world'
}

void async function main()
{
    var result = await hello();
    console.log(result + " world async")
}()

let nftStorage = new NFTStorage();

