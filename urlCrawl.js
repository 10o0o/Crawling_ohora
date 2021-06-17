const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");

// 오호라 
const page = 3;

// 각 아이템들에 대한 Url 긁어오기
async function getItemsUrl(page) {
  const url = `https://ohora.kr/product/list.html?cate_no=160&page=${page}`;
  const urls = []
  await request(url, function(ree, res, html) {
    const $ = cheerio.load(html);
    $('ul.SP_prdList_ul').find('div.SP_thumbHover_wrap a').each((idx, ele) => {
      urls.push(String($(ele,).attr('href')));
    })

    const urlObj = JSON.parse(fs.readFileSync('url.json', 'utf8'));
    urlObj['url'] = [...urlObj.url, ...urls];
    fs.writeFileSync('url.json', JSON.stringify(urlObj));
  })
}

for (let i = 1; i <= page; i++) {
  getItemsUrl(i);
}