const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

let arr = [];
let obj = {};

const parse = async() => {
    const getNews = async(url) => {
        const { data } = await axios.get(url);
        return cheerio.load(data, null, false);
    };

    for (let i = 21; i <= 30; i++) {
        const selector = await getNews(`https://www.binance.com/en/news/top?page=${i}`);

        selector(".css-1i9bvdl").each((i, element) => {
            const title = selector(element).find("div.css-yvdj0q").text();
            const link = `https://www.binance.com${selector(element).find("a").attr("href")}`;
            //const description = selector(element).find("div.css-15z93by").text();
            const date = selector(element).find("div.css-9cwl6c").text();

            obj = {title: title, date: date, link: link};
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
        const pageSelector = await getNews(unique[a].link);
        pageSelector("#__ExchangeHeader_DATA").each((i, element) => {
            const description = JSON.parse(pageSelector('script').get()[9].children[0].data);
            unique[a].description = description.pageData.redux.newsDetail.detail.bodyText;
        });
    }
    
    // fs.writeFile("./binance.txt", "", function(){});
    fs.appendFileSync("./binance.txt", JSON.stringify(unique, null, 2) , 'utf-8');
    console.log("Done");
};

parse();