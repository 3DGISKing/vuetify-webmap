import "./APIInterface";
import APIInterface from "./APIInterface";

let theApp: MarineApp;

export class MarineApp {
    readonly apiInterface = new APIInterface();
    private _member1 = 100.0;

    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        theApp = this;
    }
}

export function getMarineApp() {
    return theApp as MarineApp;
}
