import { extent, range } from "d3";
import { contours as d3contours } from "d3-contour";
import smooth from "to-smooth";

const colors = [
    {
        color: "#053061",
        point: 0
    },
    {
        color: "#09386d",
        point: 0.032258064516129
    },
    {
        color: "#134c87",
        point: 0.0645161290322581
    },
    {
        color: "#1d5fa2",
        point: 0.0967741935483871
    },
    {
        color: "#276eb0",
        point: 0.129032258064516
    },
    {
        color: "#337eb8",
        point: 0.161290322580645
    },
    {
        color: "#3f8ec0",
        point: 0.193548387096774
    },
    {
        color: "#569fc9",
        point: 0.225806451612903
    },
    {
        color: "#71b0d3",
        point: 0.258064516129032
    },
    {
        color: "#8dc2dc",
        point: 0.290322580645161
    },
    {
        color: "#a2cde3",
        point: 0.32258064516129
    },
    {
        color: "#b8d8e9",
        point: 0.354838709677419
    },
    {
        color: "#cfe4ef",
        point: 0.387096774193548
    },
    {
        color: "#ddebf2",
        point: 0.419354838709677
    },
    {
        color: "#eaf1f5",
        point: 0.451612903225806
    },
    {
        color: "#f7f6f6",
        point: 0.483870967741936
    },
    {
        color: "#f9eee7",
        point: 0.516129032258065
    },
    {
        color: "#fbe4d6",
        point: 0.548387096774194
    },
    {
        color: "#fdd9c4",
        point: 0.580645161290323
    },
    {
        color: "#f9c6ac",
        point: 0.612903225806452
    },
    {
        color: "#f6b394",
        point: 0.645161290322581
    },
    {
        color: "#f2a17f",
        point: 0.67741935483871
    },
    {
        color: "#e8896c",
        point: 0.709677419354839
    },
    {
        color: "#dd7059",
        point: 0.741935483870968
    },
    {
        color: "#d25849",
        point: 0.774193548387097
    },
    {
        color: "#c53e3d",
        point: 0.806451612903226
    },
    {
        color: "#b82531",
        point: 0.838709677419355
    },
    {
        color: "#a81529",
        point: 0.870967741935484
    },
    {
        color: "#8d0c25",
        point: 0.903225806451613
    },
    {
        color: "#730421",
        point: 0.935483870967742
    },
    {
        color: "#67001f",
        point: 1
    }
];

class ContourGenerator {
    // @ts-ignore
    createContours(data, options) {
        // get min max
        const zDomain = extent(
            [].concat.apply([], data.z).filter((f) => {
                return !isNaN(parseFloat(f)) && isFinite(f);
            })
        );

        // @ts-ignore
        // d3.range returns an array of evenly-spaced numbers
        const thresholds = range(zDomain[0], zDomain[1], (zDomain[1] - zDomain[0]) / options.thresholds);

        const values = data.z.flat();
        const contours = d3contours().size([data.z[0].length, data.z.length]).thresholds(thresholds)(values);

        for (let i = 0; i < contours.length; i++) {
            for (let j = 0; j < contours[i].coordinates.length; j++) {
                for (let k = 0; k < contours[i].coordinates[j].length; k++) {
                    for (let l = 0; l < contours[i].coordinates[j][k].length; l++) {
                        contours[i].coordinates[j][k][l] = this.unitToGeographic(
                            data.x,
                            data.y,
                            contours[i].coordinates[j][k][l][1],
                            contours[i].coordinates[j][k][l][0]
                        );
                    }
                }
            }
        }

        const geoJson = {
            type: "FeatureCollection",
            features: []
        };

        for (let i = 0; i < contours.length; i++) {
            for (let j = 0; j < contours[i].coordinates[0].length; j++) {
                const coordinates = contours[i].coordinates[0][j];

                const coordinatesList = this.removeBoundary(coordinates);

                coordinatesList.forEach((coordinates) => {
                    const feature = {
                        type: "Feature",
                        properties: {
                            value: contours[i].value
                        },
                        geometry: {
                            type: "LineString",
                            coordinates: smooth(coordinates, { iteration: 1, factor: 0.75 })
                        }
                    };

                    geoJson.features.push(feature);
                });
            }
        }

        return geoJson;
    }

    isOnBoundary(coord: any) {
        const xMax = 136.09998927559042;
        const yMin = 30.70000104330697;

        if (!coord) {
            debugger;
        }

        const x = coord[0];
        const y = coord[1];

        if (x === xMax) {
            return true;
        }

        if (y === yMin) {
            return true;
        }

        return false;
    }

    exsitBoundaryPoint(coordinates: any) {
        for (let i = 0; i < coordinates.length; i++) {
            const coord = coordinates[i];

            if (this.isOnBoundary(coord)) {
                return true;
            }
        }

        return false;
    }

    removeBoundary(coordinates: any) {
        for (let i = 0; i < coordinates.length; i++) {
            const coord = coordinates[i];

            let prev;
            let next;

            if (i === 0) {
                prev = coordinates[coordinates.length - 1];
            } else {
                prev = coordinates[i - 1];
            }

            if (i === coordinates.length - 1) {
                next = coordinates[0];
            } else {
                next = coordinates[i + 1];
            }

            if (this.isOnBoundary(next) && this.isOnBoundary(prev)) {
                coord.needToRemove = true;
            }
        }

        const coordinateList = [];
        let newCoordinates = [];

        for (let i = 0; i < coordinates.length; i++) {
            const coord = coordinates[i];

            if (coord.needToRemove) {
                coordinateList.push(newCoordinates);

                newCoordinates = [];
            } else {
                newCoordinates.push(coord);
            }
        }

        return coordinateList;
    }

    // @ts-ignore
    unitToGeographic(gridx, gridy, i, j) {
        var ii = Math.floor(i);
        var jj = Math.floor(j);
        var x, y;
        if (
            gridx[ii][jj] !== null &&
            gridx[ii][jj + 1] !== null &&
            gridx[ii + 1][jj] !== null &&
            gridx[ii + 1][jj + 1] !== null
        ) {
            x =
                ((gridx[ii + 1][jj + 1] - gridx[ii + 1][jj]) * (j - jj) +
                    gridx[ii + 1][jj] +
                    ((gridx[ii][jj + 1] - gridx[ii][jj]) * (j - jj) + gridx[ii][jj])) /
                2;
            y =
                ((gridy[ii + 1][jj] - gridy[ii][jj]) * (i - ii) +
                    gridy[ii][jj] +
                    ((gridy[ii + 1][jj + 1] - gridy[ii][jj + 1]) * (i - ii) + gridy[ii][jj + 1])) /
                2;
        } else {
            x = gridx[ii][jj];
            y = gridy[ii][jj];
        }

        return [x, y];
    }

    // @ts-ignore
    getColor(value, min, max) {
        // @ts-ignore
        function hex(c) {
            var s = "0123456789abcdef";
            var i = parseInt(c, 10);
            if (i === 0 || isNaN(c)) return "00";
            i = Math.round(Math.min(Math.max(0, i), 255));
            return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
        }

        // @ts-ignore
        function trim(s) {
            return s.charAt(0) === "#" ? s.substring(1, 7) : s;
        }

        // @ts-ignore
        function convertToRGB(hex) {
            var color = [];
            color[0] = parseInt(trim(hex).substring(0, 2), 16);
            color[1] = parseInt(trim(hex).substring(2, 4), 16);
            color[2] = parseInt(trim(hex).substring(4, 6), 16);
            return color;
        }
        // @ts-ignore
        function convertToHex(rgb) {
            return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
        }

        if (value === null || isNaN(value)) {
            return "#ffffff";
        }
        if (value > max) {
            return colors[colors.length - 1].color;
        }
        if (value < min) {
            return colors[0].color;
        }
        var loc = (value - min) / (max - min);
        if (loc < 0 || loc > 1) {
            return "#fff";
        } else {
            var index = 0;
            for (var i = 0; i < colors.length - 1; i++) {
                if (loc >= colors[i].point && loc <= colors[i + 1].point) {
                    index = i;
                }
            }
            var color1 = convertToRGB(colors[index].color);
            var color2 = convertToRGB(colors[index + 1].color);

            var f = (loc - colors[index].point) / (colors[index + 1].point - colors[index].point);
            var rgb = [
                color1[0] + (color2[0] - color1[0]) * f,
                color1[1] + (color2[1] - color1[1]) * f,
                color1[2] + (color2[2] - color1[2]) * f
            ];

            return `#${convertToHex(rgb)}`;
        }
    }
}

export default ContourGenerator;
