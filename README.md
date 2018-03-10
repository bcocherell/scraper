# snopes scraper

Created for a coding bootcamp assignment, it's a simple app with a clean ui that scrapes articles from [snopes](https://www.snopes.com/) while letting users comment on them, persisting all data in a MongoDB database and using mongoose as an orm.

## Before You Begin

If running locally...

- Run `npm install` as the app makes use of several npm packages.

- Run `mongod` to get your local MongoDB up and running (data is saved to a "mongoHeadlines" database). 

- Run `node server.js` and open a browser to `localhost:3000`

- Click on 'scrape new articles' to get current article list from snopes

## Instructions

- Click on 'scrape new articles' to get the latest information from snopes
- Click on a particular article title to go to the corresponding site on snopes
- Click on 'view comments' to see what other users are saying and add your own comment
- You may delete any comment on the site, have fun!

![Sample Output](public/assets/img/screenshot1.png?raw=true "Sample output")
![Sample Output](public/assets/img/screenshot2.png?raw=true "Sample output")