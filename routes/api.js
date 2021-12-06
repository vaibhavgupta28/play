const { json } = require('express');
var express = require('express');
var router = express.Router();
var cheerio = require("cheerio");
var axios = require("axios").default;        

/* GET users listing. */
router.get('/', function(req, res, next) {
    var search = req.query.search;
    var page = req.query.page;
     var options = {
        method: 'POST',
        url: 'https://grammarbot.p.rapidapi.com/check?text='+search,
        headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': 'grammarbot.p.rapidapi.com',
        'x-rapidapi-key': '8b9d4a7de3msh4d2abebef735bf3p1359d2jsnd96ecedd78fa'
        },
        data: {text: search, language: 'en-US'}
    };

    const firstRequest = axios.request(options).then(function (response) {
        console.log(response.data);
        if(response.data.matches) {
            console.log(response.data.matches)
            response.data.matches.forEach(function(word) {
                search =  word.replacements[0].value;
            });
        }

        console.log("--->" + search)
        
    }).catch(function (error) {
        console.error(error);
    });

    /* 
    var options = {
        method: 'GET',
        url: 'https://www.amazon.com/s',
        params: {k: search}
      };
       axios.request(options).then(function (res) {
         //console.log(res.data);
         $ = cheerio.load(res.data);
         $('div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20').each((_idx, el) => {
            const shelf = $(el)
            const title = shelf.find('span.a-size-base-plus.a-color-base.a-text-normal').text()
            const image = shelf.find('img.s-image').attr('src')

            const link = shelf.find('a.a-link-normal.a-text-normal').attr('href')
            
            const reviews = shelf.find('div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small').children('span').last().attr('aria-label')
            
            const stars = shelf.find('div.a-section.a-spacing-none.a-spacing-top-micro > div > span').attr('aria-label')
            
            const price = shelf.find('span.a-price > span.a-offscreen').text()
            let element = {
                title,
                image,
                link: `https://amazon.com${link}`,
                price,
            }
        
            if (reviews) {
                element.reviews = reviews
            }
        
            if (stars) {
                element.stars = stars
            }
            console.log(title)
        });
        //const html = res.data;
         //console.log(post)

      }).catch(function (error) {
          console.error(error);
      }); */
   
    var result = [];

    var options = {
      method: 'GET',
      url: 'https://amazon-price1.p.rapidapi.com/search',
      params: {marketplace: 'US', keywords: search, page: page},
      headers: {
        'x-rapidapi-host': 'amazon-price1.p.rapidapi.com',
        'x-rapidapi-key': '8b9d4a7de3msh4d2abebef735bf3p1359d2jsnd96ecedd78fa'
      }
    };
    const secondRequest = axios.request(options).then(function (res) {
       console.log(res.data);
       //let amazonData = require('../amazon.json');
       let amazonData =  res.data;
       amazonData.forEach(function(productData) {
           var title = productData.title;
           var price = productData.price;
           var imageUrl = productData.imageUrl;
           var detailPageURL = productData.detailPageURL;
           var rating = productData.rating;
           var website = "Amazon";
           var hasstock = true;
           result.push({website:website,name: title, price: price,image: imageUrl, url: detailPageURL,rating:rating,hasstock:hasstock});
       });
    }).catch(function (error) {
        console.error(error);
    });

   
    var options = {
    method: 'GET',
    url: 'https://wayfair.p.rapidapi.com/products/search',
    params: {keyword: search, sortby: '0', curpage: page, itemsperpage: '10'},
    headers: {
        'x-rapidapi-host': 'wayfair.p.rapidapi.com',
        'x-rapidapi-key': '8b9d4a7de3msh4d2abebef735bf3p1359d2jsnd96ecedd78fa'
    }
    };

    const thirdRequest = axios.request(options).then(function (response) {
        console.log(response.data);
        let wayfairData = response.data;
        wayfairData.response.superbrowse_object.product_collection.forEach(function(productData) {
        var website = "Wayfair";
        var title = productData.name;
        var price = productData.item_price;
        var imageUrl = productData.image_url;
        var detailPageURL = productData.product_url;
        var rating = productData.average_overall_rating;
        var hasstock = productData.has_stock;
        
        result.push({website:website,name: title, price: price,image: imageUrl, url: detailPageURL,rating:rating,hasstock:hasstock});
        
    });
    }).catch(function (error) {
        console.error(error);
    }); 
   
    Promise.all([firstRequest, secondRequest, thirdRequest])
       .then(() => {
        res.contentType('application/json');
        res.send(JSON.stringify(result)); 
       })
     
     
       
    //res.send(search);
    //res.render('api', { title: 'API Response', content: search });

});

module.exports = router;
