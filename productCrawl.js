const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");

const defaultUrl = 'https://ohora.kr/';

const mkJson = (obj) => {
  if(!fs.existsSync('product.json')) fs.writeFileSync('product.json', JSON.stringify(obj));
}

mkJson({
  product: []
})

async function getProduct(urlRoute) {
  const url = `${defaultUrl}${urlRoute}`;
  request(url, function(err, res, html) {
    if(err) throw err;

    const $ = cheerio.load(html);
    const product = JSON.parse(fs.readFileSync('product.json', 'utf8'));
    const productObj = {};

    $('ul.SP_prdListItemInfo li.xans-record-').each((idx, ele) => {
      const title = $(ele).children('span.title').text()
      const context = $(ele).children('span.SP_detail_content').text();

      if (title === '상품명') productObj.pr_nm = context;

      if (title === '상품간략설명') {
        console.log(context.split());
        const newContext = context.split("").filter(el => {
          if(el === `\n`) return false;

          return true;
        }).join("")

        productObj.simple_desc = String(newContext);
      }

      if (title === '가격') productObj.pr_price = String(context);
    })

    const detailDescSourceBox = [];
    $('div.SP_detailContainer img').each((idx, el) => {
      if ($(el).attr("ec-data-src") && String($(el).attr("ec-data-src")).length < 200) detailDescSourceBox.push(`${defaultUrl}${String($(el).attr("ec-data-src"))}`)
    })

    $('ul.SP_prdList_ul').find('div.SP_thumbHover_wrap a').each((idx, ele) => {
      urls.push(String($(ele).attr('href')));
    })

    const thumbnail = String($('div.SP_thumbnailLink img').attr('src').split("").slice(2).join(""));
    productObj.thumbnail = thumbnail;

    productObj.pr_desc = detailDescSourceBox;
    product.product = [...product.product, productObj];
    

    fs.writeFileSync('product.json', JSON.stringify(product));    
  })
}

const urlArr = JSON.parse(fs.readFileSync('url.json', 'utf8')).url;

let count = 0
for (const urlRoute of urlArr) {
  console.log('insert this item...', urlRoute)
  getProduct(urlRoute);
  count++;

  if (count >= 50) break;
}