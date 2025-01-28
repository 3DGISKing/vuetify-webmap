import "./APIInterface";
import APIInterface from "./APIInterface";
import { NetCDFReader } from "netcdfjs";

let theApp: MarineApp;

export class MarineApp {
    readonly apiInterface = new APIInterface();
    private _mapCount = 0;
    private _waveHeightData: any;

    constructor() {
        theApp = this;

        this.prepareWaveHeightData();
    }

    getWaveHeightData() {
        return this._waveHeightData;
    }

    prepareWaveHeightData() {
        fetch("./data/cmems_mod_glo_wav_my_0.2deg-climatology_P1M-m_1737619085988-netcdf.nc")
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => {
                // Read the NetCDF file
                const reader = new NetCDFReader(arrayBuffer);

                const VHM0 = reader.getDataVariable("VHM0");

                for (let i = 0; i < VHM0.length; i++) {
                    if (Number.isNaN(VHM0[i])) {
                        // @ts-ignore
                        VHM0[i] = null;
                    }
                }

                const lon = reader.getDataVariable("lon");
                const lat = reader.getDataVariable("lat");

                const x = [];

                for (let i = 0; i < lat.length; i++) {
                    x.push(lon);
                }

                const y = [];

                for (let i = 0; i < lat.length; i++) {
                    const rowData = [];

                    for (let j = 0; j < lon.length; j++) {
                        rowData.push(lat[i]);
                    }

                    y.push(rowData);
                }

                const z = [];

                for (let i = 0; i < lat.length; i++) {
                    const rowVal = [];

                    for (let j = 0; j < lon.length; j++) {
                        rowVal.push(VHM0[i * lon.length + j]);
                    }

                    z.push(rowVal);
                }

                // the gridded data must include geographic data beyond the real values (this means at least one layer of surrounding null values)

                // top
                for (let i = 0; i < lon.length; i++) {
                    // @ts-ignore
                    z[0][i] = null;
                }

                //right
                for (let i = 0; i < lat.length; i++) {
                    // @ts-ignore
                    z[i][lon.length - 1] = null;
                }

                // bottom
                for (let i = 0; i < lon.length; i++) {
                    // @ts-ignore
                    z[lat.length - 1][i] = null;
                }

                // left
                for (let i = 0; i < lat.length; i++) {
                    // @ts-ignore
                    z[i][0] = null;
                }

                this._waveHeightData = {
                    x,
                    y,
                    z
                };
            })
            .catch((error) => console.error("Error reading NetCDF file:", error));
    }

    getMapCount() {
        this._mapCount++;

        return this._mapCount;
    }
}

export function getMarineApp() {
    return theApp as MarineApp;
}
