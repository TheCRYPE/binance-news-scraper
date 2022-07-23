const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

// set the required number of pages
let numbersOfPage = 5;

const parse = async() => {
    let arr = [];
    let obj = {};

    const getPage = async(url) => {
        const { data } = await axios.get(url);
        return cheerio.load(data, null, false);
    };

    for (let i = 1; i <= numbersOfPage; i++) {
        let url = "";

        if (i != 1) {
            url = `https://www.binance.com/en/news/flash?page=${i}`;
        } else {
            url = "https://www.binance.com/en/news/flash";
        }

        const selector = await getPage(url);

        selector(".css-15rktlr").each((i, element) => {
            const title = selector(element).find("div.css-b5absw").text();
            const link = `https://www.binance.com${selector(element).find("a").attr("href")}`;
            obj = {title: title, link: link}; // comment this string if need to scrap short text of news
            // uncomment next strings if need to scrap short text of news 
            // const shortText = selector(element).find("div.css-1tktcmi").text();
            // obj = {title: title, link: link, shortText: shortText};
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
        pageSelector("#__APP_DATA").each(() => {
            const scriptData = JSON.parse(pageSelector('script').get()[9].children[0].data);
            unique[a].fullText = scriptData.pageData.redux.newsDetail.detail.bodyText;
            unique[a].author = scriptData.pageData.redux.newsDetail.detail.author;
            unique[a].keywords = scriptData.pageData.redux.newsDetail.detail.keywords;
            unique[a].date = new Date(scriptData.pageData.redux.newsDetail.detail.createTime).toLocaleString();
        });
    }
    
    fs.writeFile("./binanceFlashNews.txt", "", function(){});
    fs.appendFileSync("./binanceFlashNews.txt", JSON.stringify(unique, null, 2) , 'utf-8');
    console.log("Done");
};

parse();