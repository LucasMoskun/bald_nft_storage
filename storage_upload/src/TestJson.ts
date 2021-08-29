import fetch from "node-fetch";

export class TestJson {

    constructor()
    {
        this.parseJson();
    }

    async parseJson()
    {
        const fileUri = "http://127.0.0.1:8080/json/TestJson.json"

        const httpResponse = await fetch(fileUri);
        const body = await httpResponse.json();
        console.log(body);
    }
}
