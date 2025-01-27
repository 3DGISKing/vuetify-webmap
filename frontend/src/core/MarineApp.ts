import "./APIInterface";
import APIInterface from "./APIInterface";
import { NetCDFReader } from "netcdfjs";

let theApp: MarineApp;

export class MarineApp {
    readonly apiInterface = new APIInterface();

    private _mapCount = 0;
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        theApp = this;

        // const p = this.loadData();

        // p.then((data) => {
        //     console.log(data);
        // });

        // Fetch the NetCDF file (replace with your file URL)
        fetch("http://localhost:3000/data/cmems_mod_glo_wav_my_0.2deg-climatology_P1M-m_1737619085988-netcdf.nc")
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => {
                // Read the NetCDF file
                const reader = new NetCDFReader(arrayBuffer);

                console.log(reader);

                // Access variables and attributes
                const VHM0 = reader.getDataVariable("VHM0");
                // const attributeValue = reader.getAttribute("attribute_name");

                console.log(VHM0);
                // console.log(attributeValue);

                // console.log(variableData);

                const lon = reader.getDataVariable("lon");
                const lat = reader.getDataVariable("lat");

                console.log(lon);
                console.log(lat);
            })
            .catch((error) => console.error("Error reading NetCDF file:", error));
    }

    async loadData() {
        const ncFilePath = "http://localhost:3000/data/cmems_mod_glo_wav_my_0.2deg-climatology_P1M-m_1737619085988.nc";
        const data = await loadNetCDF(ncFilePath);

        return data;
    }

    getMapCount() {
        this._mapCount++;

        return this._mapCount;
    }
}

export function getMarineApp() {
    return theApp as MarineApp;
}
