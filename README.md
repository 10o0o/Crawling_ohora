# Task_Crawling ohora

## 목적

- 오호라 사이트에 존재하는 품목을 크롤링을 통해 가져온다.

## 방법

1. 오호라 페이지에서 품목들 리스트가 보이는 경로로 이동한다.
2. 해당 경로에서 각 리스트에 대한 URL을 크롤링을 통해 가져온다.(urlCrawl.js)
3. 가져온 URL을 url.json파일에 저장한다.
4. 품목 상세 페이지에서 가져와야 할 정보들을 크롤링하는 로직을 생성한다.
5. url.json파일에 있는 url들에 대해 4번에서 생성한 로직으로 크롤링을 한다. (productCrawl.js)
6. 상품에 대한 정보를 product.json파일에 저장한다.
7. 상품 상세정보에 대한 이미지 파일들을 `sku/{상품이름}/{번호}.jpg`로 저장한다.
8. 상품 썸네일 이미지 또한 `sku/{상품이름}/thumbnail.jpg`로 저장한다.
9. product.json 파일을 info.csv 파일로 변환하여 `sku/info.csv`로 저장한다.


## 겪었던 문제점

1. 크롤링 파일 실행 시, 실행은 계속 되고 있으나 오류가 난건지 처리할 항목이 많아 실행이 오래 걸리는 건지 알수 없었다.

  - 해결방안
      + `console.log`를 통해 현재 상황을 계속 찍는다
      + 에러처리를 한다.
      + `request`로 받아오는 부분이 비동기이므로 Promise등으로 처리를 해야한다.(그렇지 않으면 js가 undefined에 대해 로직을 실행하게 된다.)


2. 만들어진 csv파일이 엑셀에서 열 때, 글자가 깨졌다.
  - 해결방안
      + 처음 encoding할 때, `ANSI`로 인코딩을 한다.
      + 엑셀에서 파일 오픈 시, 인코딩방식으로 `UTF-8`을 선택한다(fs.writeFileSync의 디폴트 설정이기 때문)


## 추가로 알아본 것.

1. Cli에서 commander을 이용한 변수 할당하기

  - 예를들어 `node index.js -u user -p password arguments...`와 같이 cli에서 파일을 node로 실행 시 옵션을 넣는 것

  
  + `commander`라이브러리를 사용하기 위해 `npm install commander`을 한다.

cammander을 쓰는 방법은 다음과 같다.


```
const commander = require('commander');

commander
    .arguments('<count>')
    .option('-u, --username <username>', 'Your Github name')
    .option('-e, --email <email>', 'Your Email Address')
    .action(function(count, option){

        for(let i=0;i<count;i++){
            console.log('user: %s, email: %s, print count: %s', option.username, option.email, count);
        }

    })
    .parse(process.argv);
```

