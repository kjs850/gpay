var fs = require("fs");

fsPromises = fs.promises;

async function main() {
    try {
        const files = fs.readdirSync('input')
        // fs.rmdirSync("../json", { recursive: true });
        // fs.mkdirSync("../json");
        for (let i in files) {
            const json = await fsPromises.readFile("input/" + files[i], "utf8");
            const originalData = JSON.parse(json);
            const datas = originalData.filter(
                (x) => x.REFINE_WGS84_LOGT !== "" || x.REFINE_WGS84_LAT !== ""
            );

            var report = {};

            function getURLencodedAddr(x, filePrefix) {

                let arr = (x.addr || "").split(" ");


                if (arr.length == 0) return undefined;

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

                if(key.startsWith(filePrefix) === false) return undefined;

                report[key] = (report[key] || 1) + 1;
                return key;
            }

            function convertData(x) {
                let category = 'other'
                let nm = x.INDUTYPE_NM
                let imageIndex = 17


                if (isContain(nm, ['음식'])) {
                    category = 'restaurant'
                    imageIndex = 4
                }

                if (isContain(nm, ['주유', '연료'])) {
                    category = 'oil'
                    imageIndex = 9
                }

                if (isContain(nm, ['슈퍼', '마트'])) {
                    category = 'mart'
                    imageIndex = 7
                }

                if (isContain(nm, ['자동차', '정비'])) {
                    category = 'car'
                    imageIndex = 0
                }

                if (isContain(nm, ['숙박'])) {
                    category = 'hotel'
                    imageIndex = 5
                }

                if (isContain(nm, ['병원', '약국', '의원'])) {
                    category = 'medical'
                    imageIndex = 8
                }

                if (isContain(nm, ['학원'])) {
                    category = 'study'
                    imageIndex = 16
                }

                if (isContain(nm, ['식품'])) {
                    category = 'food'
                    imageIndex = 7
                }

                if (isContain(nm, ['레저'])) {
                    category = 'leisure'
                    imageIndex = 13
                }

                if (isContain(nm, ['보건위생', '미용'])) {
                    category = 'beauty'
                    imageIndex = 13
                }




                return {
                    lat: x.REFINE_WGS84_LAT,
                    long: x.REFINE_WGS84_LOGT,
                    name: x.CMPNM_NM,
                    tel: x.TELNO,
                    addr: x.REFINE_LOTNO_ADDR,
                    category: category,
                    indutype: x.INDUTYPE_NM,
                    imageIndex: imageIndex
                };
            }

            function isContain(type, arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (type.search(arr[i]) >= 0) return true;
                }

                return false;
            }

            const result = {};

            let filePrefix = ''
            for (let i = 0; i < datas.length; i++) {

                const d = convertData(datas[i]);
                const category = d.category
                const fileName = getURLencodedAddr(d, filePrefix);

                if (fileName === undefined) continue;

                if(filePrefix === '') {
                    const addr = d.addr.split(" ")
                    filePrefix = addr[0] + addr[1];
                }
                if(fileName.startsWith(filePrefix) === false) {
                    continue;
                };


                const r = result[fileName] || {};
                result[fileName] = {...r };
                const c = result[fileName][category] || [];
                result[fileName][category] = [...c, d];
            }

            //  파싱

            // 저장

            for (let k in result) {

                const r = result[k];
                let total = []
                for (let l in r) {
                    try {
                        const converted = convertDataSingleToArray(r[l])
                        await fsPromises.writeFile(
                            `../json/${k}_${l}.json`,
                            JSON.stringify(converted)
                        );
                        console.log(`created ${k}_${l}.json`);
                        total = [...total, ...converted]
                    } catch (e) {
                        console.error(e);
                    }
                    await fsPromises.writeFile(
                        `../json/${k}_total.json`,
                        JSON.stringify(total))
                    console.log(`created ${k}_total.json`);
                }
            }

            console.log('report', report);
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
                imageIndex: a[0].imageIndex
            }
            o.items = a.map(x => ({
                name: x.name,
                tel: x.tel,
                addr: x.addr,
                indutype: x.indutype,
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