const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

let numbersOfPage = 5;

let arr = [];
let obj = {};

const parse = async() => {
    const getPage = async(url) => {
        const { data } = await axios.get(url);
        return cheerio.load(data, null, false);
    };

    for (let i = 1; i <= numbersOfPage; i++) {
        let url = "";

        if (i != 1) {
            url = `https://www.binance.com/en/news/top?page=${i}`;
        } else {
            url = "https://www.binance.com/en/news/top";
        }

        const selector = await getPage(url);

        selector(".css-1i9bvdl").each((i, element) => {
            const title = selector(element).find("div.css-yvdj0q").text();
            const link = `https://www.binance.com${selector(element).find("a").attr("href")}`;
            //const shortText = selector(element).find("div.css-15z93by").text();

            obj = {title: title, date: "", link: link};
            arr.push(obj);
        });
    }

    const uniqueData = [];
  
    const unique = arr.filter(element => {
        const isDuplicate = uniqueData.includes(element.link);
        
        if (!isDuplicate) {
            uniqueData.push(element.link);
            return true;
        }
        return false;
    });

    for (let a = 0; a < unique.length; a++) {
        const pageSelector = await getPage(unique[a].link);
        pageSelector("#__ExchangeHeader_DATA").each(() => {
            const scriptData = JSON.parse(pageSelector('script').get()[9].children[0].data);
            unique[a].date = new Date(scriptData.pageData.redux.newsDetail.detail.createTime).toLocaleString();
            unique[a].fullText = scriptData.pageData.redux.newsDetail.detail.bodyText;
        });
    }
    
    fs.writeFile("./binanceTopNews.txt", "", function(){});
    fs.appendFileSync("./binanceTopNews.txt", JSON.stringify(unique, null, 2) , 'utf-8');
    console.log("Done");
};

parse();