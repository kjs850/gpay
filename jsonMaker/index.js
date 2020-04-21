var fs = require("fs");

fsPromises = fs.promises;
const result = {};

async function main() {
    try {
        const files = fs.readdirSync('input')
            // fs.rmdirSync("../json", { recursive: true });
            // fs.mkdirSync("../json");
        for (let i in files) {
            console.log("input/" + files[i])
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
                let arr = (x.REFINE_LOTNO_ADDR || "").split(" ");

                // if (arr.length == 1) {
                //     arr = (x.REFINE_ROADNM_ADDR || "").split(" ");
                // }
                if (arr.length == 0) return undefined;

                if (!arr[0]) console.log(x);
                let key = ''
                if (arr[2] === undefined) return undefined;

                if (arr[2].replace(/.*동/, '').length == 0) {
                    key = arr[0] + arr[1] + arr[2];
                } else {
                    key = arr[0] + arr[1] + arr[2] + arr[3];
                }

                if (key.length !== key.replace(/\d+/, '').length || key.length !== key.replace(/\(/, '').length) {
                    console.log(key)
                    return undefined;
                }

                report[key] =
                    (report[key] || 1) + 1;
                return key;
            }

            function convertData(x) {
                return {
                    REFINE_WGS84_LAT: x.REFINE_WGS84_LAT,
                    REFINE_WGS84_LOGT: x.REFINE_WGS84_LOGT,
                    CMPNM_NM: x.CMPNM_NM,
                    TELNO: x.TELNO,
                    REFINE_LOTNO_ADDR: x.REFINE_LOTNO_ADDR,
                    INDUTYPE_NM: x.INDUTYPE_NM,
                };
            }

            for (let i = 0; i < datas.length; i++) {
                const d = datas[i];
                const category = getCategory(d);
                const fileName = getURLencodedAddr(d);
                if (fileName === undefined) continue;

                const r = result[fileName] || {};
                result[fileName] = {...r };
                const c = result[fileName][category] || [];
                result[fileName][category] = [...c, convertData(d)];
            }

            for (let k in result) {
                const r = result[k];
                for (let l in r) {
                    try {
                        if (l === "other") continue;
                        await fsPromises.writeFile(
                            `../json/${k}_${l}.json`,
                            JSON.stringify(r[l])
                        );
                        console.log(`created ${k}_${l}.json`);
                    } catch (e) {
                        console.error(err);
                    }
                }
            }

            console.log(report);
        }
    } catch (e) {
        console.error(e);
    }
}

main();