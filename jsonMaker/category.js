var fs = require("fs");

fsPromises = fs.promises;
const result = {};

async function main() {
    try {
        const files = fs.readdirSync("input");
        // fs.rmdirSync("../json", { recursive: true });
        // fs.mkdirSync("../json");
        var result = {};
        for (let i in files) {
            console.log("input/" + files[i]);
            const json = await fsPromises.readFile("input/" + files[i], "utf8");
            const datas = JSON.parse(json);

            for (let i = 0; i < datas.length; i++) {
                const d = datas[i];

                result[d.INDUTYPE_NM] = (result[d.INDUTYPE_NM] || 0) + 1;
            }
        }
        var resultArr = [];
        var resultTxt = "";
        for (let key in result) {
            // console.log(key);
            let obj = {};
            obj[key] = result[key];
            resultArr.push(obj);
        }

        resultArr.sort((a, b) => (Object.keys(a)[0] < Object.keys(b)[0] ? -1 : 1));

        resultTxt += "";

        const { EOL } = require("os");

        for (let i = 0; i < resultArr.length; i++) {
            const obj = resultArr[i];
            const key = Object.keys(obj)[0];
            resultTxt += `${key} : ${obj[key]}\n`;
        }

        await fsPromises.writeFile(`category_name.txt`, resultTxt);

        resultArr.forEach((a) => console.log(Object.values(a)[0]));

        resultArr = resultArr.sort((a, b) =>
            Object.values(a)[0] > Object.values(b)[0] ? -1 : 1
        );

        // console.log(resultArr);

        resultTxt = "";

        for (let i = 0; i < resultArr.length; i++) {
            const obj = resultArr[i];
            const key = Object.keys(obj)[0];
            resultTxt += `${key} : ${obj[key]}\n`;
        }

        await fsPromises.writeFile(`category_count.txt`, resultTxt);
    } catch (e) {
        console.error(e);
    }
}

main();