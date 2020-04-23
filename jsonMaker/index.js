var fs = require("fs");

fsPromises = fs.promises;
const result = {};

async function main() {
    try {
        const files = fs.readdirSync('input')
        fs.rmdirSync("../json", { recursive: true });
        fs.mkdirSync("../json");
        for (let i in files) {
            const json = await fsPromises.readFile("input/" + files[i], "utf8");
            const originalData = JSON.parse(json);
            const datas = originalData.filter(
                (x) => x.REFINE_WGS84_LOGT !== "" || x.REFINE_WGS84_LAT !== ""
            );

            function getCategory(x) {
                if (
                    x.INDUTYPE_NM.indexOf("유통업영") > -1 ||
                    x.INDUTYPE_NM.indexOf("음료식품") > -1
                ) {
                    return "basket";
                } else if (x.INDUTYPE_NM.indexOf("학원") > -1) {
                    return "note";
                } else if (
                    x.INDUTYPE_NM.indexOf("의원") > -1 ||
                    x.INDUTYPE_NM.indexOf("병원") > -1 ||
                    x.INDUTYPE_NM.indexOf("약국") > -1
                ) {
                    return "hospital";
                } else if (x.INDUTYPE_NM.indexOf("미용원") > -1) {
                    return "hair";
                } else if (x.INDUTYPE_NM.indexOf("일반휴게음식") > -1) {
                    return "restaurant";
                } else {
                    return "other";
                }
            }

            var report = {};

            function getURLencodedAddr(x) {
                let arr = (x.addr || "").split(" ");

                // if (arr.length == 1) {
                //     arr = (x.REFINE_ROADNM_ADDR || "").split(" ");
                // }
                if (arr.length == 0) return undefined;

                // if (!arr[0]) console.log(x);
                let key = ''
                if (arr[2] === undefined) return undefined;

                if (arr[2].replace(/.*동/, '').length == 0) {
                    key = arr[0] + arr[1] + arr[2];
                } else {
                    key = arr[0] + arr[1] + arr[2] + arr[3];
                }

                if (key.length !== key.replace(/\d+/, '').length || key.length !== key.replace(/\(/, '').length) {
                    // console.log(key)
                    return undefined;
                }

                report[key] =
                    (report[key] || 1) + 1;
                return key;
            }

            function convertData(x) {
                return {
                    lat: x.REFINE_WGS84_LAT,
                    long: x.REFINE_WGS84_LOGT,
                    name: x.CMPNM_NM,
                    tel: x.TELNO,
                    addr: x.REFINE_LOTNO_ADDR,
                    category: x.INDUTYPE_NM,
                };
            }

            for (let i = 0; i < datas.length; i++) {
                const d = convertData(datas[i]);
                const fileName = getURLencodedAddr(d);

                if (fileName === undefined) continue;

                const r = result[fileName] || [];
                r.push(d)
                result[fileName] = r;
                // const c = result[fileName] || [];
                // result[fileName] = [...c, convertData(d)];
            }

            for (let k in result) {
                const r = result[k];
                try {
                    console.log(`created ${k}.json`)
                    await fsPromises.writeFile(
                        `../json/${k}.json`,
                        JSON.stringify(convertDataSingleToArray(r)));

                    console.log(`created ${k}.json`);
                } catch (e) {
                    console.error(e);
                }
            }

            console.log(report);
        }
    } catch (e) {
        console.error(e);
    }
}


function convertDataSingleToArray(arr) {
    const result = {}
    for (let i = 0; i < arr.length; i++) {
        const o = arr[i]

        if (o.lat == undefined || o.long == undefined) {
            console.log('lat, logt undefined', o)
            continue;
        }

        const key = o.lat.toString() + '/' + o.long.toString()
        try {
            result[key] = [...(result[key] || []), o]
        } catch (e) {
            console.error(e)
        }
    }

    const resultArr = []
    for (let i in result) {
        const a = result[i]
        try {
            const o = {
                lat: a[0].lat,
                long: a[0].long,
            }
            o.items = a.map(x => ({
                name: x.name,
                tel: x.tel,
                addr: x.addr,
                category: x.category
            }))
            resultArr.push(o)
        } catch (e) {
            console.error('REFINE_WGS84_LAT', a)
        }
    }

    return resultArr

}


main();