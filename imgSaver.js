const fs = require('fs');
const request = require('request');
const commander = require('commander');
const converter = require('json-2-csv');
const clonedeep = require('lodash.clonedeep')
const json2xlsx = require('node-json-xlsx');

const rawJsonData = JSON.parse(fs.readFileSync('product.json', 'utf-8')).product



rawJsonData.map(el => {
  const newEl = el.simple_desc.split("").filter(el2 => {
    if (el2 === '-' || el2 === '_' || el2 === `"` || el2 === `'`) return false;

    return true;
  }).join("");
  
  el.simple_desc = newEl;
  return el;
})

commander
  .arguments('<count>')
  .option('-u, --username <name>', 'Your name')
  .option('-e, --useremail <email>', 'Your email')
  .action(function(count, option) {
    console.log('your name is', option.username, option.useremail);
    const download = function(uri, filename, callback){
      return new Promise((resolve, reject) => {
        request.head(encodeURI(uri), function(err, res, body){
          if (err) {
            console.log(uri);
            console.error(err);
            return resolve();
          }  
          request(encodeURI(uri)).pipe(fs.createWriteStream(filename)).on('close', ()=> resolve()).on('error', e => {
            reject(e)
          });
        });
      })
    };
    
    const mkdir = (dir) => {
      if(!fs.existsSync(dir)) fs.mkdirSync(dir);
    }
    
    mkdir('sku')

  // const xlsx = json2xlsx(rawJsonData);
  // fs.writeFileSync('/sku/info.xlsx', xlsx, 'binary')
    
    
    
    const json = clonedeep(rawJsonData);
    
    json.map(el => {
      delete el.pr_desc;
      return el;
    })
    
    converter.json2csv(json, (err, csv) => {
      if (err) throw err;
    
      fs.writeFileSync(`sku/info.csv`, `\uFEFF` + csv, {encoding: 'utf-8'});
    })
    
    
    async function run() {
      let k =1;
      for (const onePrd of rawJsonData) {
        const name = String(onePrd.pr_nm.split("").filter(el => {
          if (el !== ' ') return true;
        }).join(""));
      
        mkdir(`sku/${name}sku`);
        console.log('download ready', onePrd.pr_desc.length);
        console.log(onePrd.thumbnail);
    
        await download(`https://${onePrd.thumbnail}`, `sku/${name}sku/thumbnail.jpg`)
    
        for (let i = 0; i < onePrd.pr_desc.length; i++) {
          console.log(`${i + 1} /${onePrd.pr_desc.length}`)
          await download(onePrd.pr_desc[i], `sku/${name}sku/${i}.jpg`);
        }

        onePrd.pr_desc = String(onePrd.pr_desc)
    
        if (k >= count) {
          console.log('end!')
          break;
        }
        k++;
      }
    }
    run();
  })
.parse(process.argv)




