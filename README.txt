Binance news scraper / parser

This parser is used to extract Top and Flash news from Binance.

Data received includes:
- Title;
- Link to the news;
- Link to a picture from the news (only for Top news);
- Short news text (need to uncomment 2 and comment 1 string in the code)
- Full text of the news;
- Author;
- Keywords;
- Date of publication.

The number of pages to extract is set manually in the code via the numbersOfPage variable because it is not possible to extract the entire number of pages.

To start, you need to enter the command in the terminal:
node .\newsFlashParser.js
node .\newsTopParser.js

After execution, appropriate text files will be created with news content in the form of an array of objects.

Data extraction time for 5 pages is about 10-15 seconds (in my device).