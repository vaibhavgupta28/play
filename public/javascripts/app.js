(function () {

    const quotesEl = document.querySelector('.quotes');
    const loaderEl = document.querySelector('.loader');
  
    // get the quotes from API
    const getQuotes = async (keyword, page, limit) => {
  
      console.log('page, limit', page, limit)
        const API_URL = `https://api.javascripttutorial.net/v1/quotes/?page=${page}&limit=${limit}`;
        //const API_URL = `api/?search=${keyword}&page=${page}&limit=${limit}`;
        const response = await fetch(API_URL);
        // handle 404
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    }


  
    // show the quotes
    const showQuotes = (quotes) => {
        quotes.forEach(quote => {
            const quoteEl = document.createElement('div');
            quoteEl.classList.add('quote');
  
            quoteEl.innerHTML = `
            <div class="col-12 col-md-12 col-xl-12">
                <div class="contact-item">
                  <div class="contact-icon" style="flex:0.2">
                    <img src="${quote.image}">
                  </div>
                  <div class="contact-content" style="flex:0.8">
                    <a href='${quote.url}'><h4>${quote.website}</h4>
                    <p>${quote.name}</p>
                    <p>${quote.price}</p>
                    <p>${quote.rating}</p>
                    <p>${quote.hasstock}</p></a>
                  </div>
                </div>
              </div>
        `;
  
            quotesEl.appendChild(quoteEl);
        });
    };
  
    const hideLoader = () => {
        loaderEl.classList.remove('d-flex');
        loaderEl.classList.add('d-none');
    };
  
    const showLoader = () => {
        loaderEl.classList.add('d-flex');
        loaderEl.classList.remove('d-none');
    };
  
    const hasMoreQuotes = (keyword, page, limit, total) => {
        const startIndex = (page - 1) * limit + 1;
        return true;
        //return total === 0 || startIndex < total;
    };
  
    // load quotes
    const loadQuotes = async (keyword, page, limit) => {
  
        // show the loader
        showLoader();
  
        // 0.5 second later
        setTimeout(async () => {
            try {
                // if having more quotes to fetch
                if (hasMoreQuotes(keyword, page, limit, total)) {
                    // call the API to get quotes
                    //const response = await getQuotes(keyword,page, limit);

                    var options = {
                        method: 'GET',
                        url: `api/?search=${keyword}&page=${page}&limit=${limit}`,
                        params: {marketplace: 'US', keywords: search, page: page},
                      };
                    var out = ""
                       axios.request(options).then(function (res) {
                         console.log(res.data);
                         hideLoader();
                         showQuotes(res.data);
                         
                         //total = response.total;
                      }).catch(function (error) {
                          console.error(error);
                      });

                    // show quotes
                    //console.log("Responseee" + response.data)
                    
                    // update the total
                    
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                //hideLoader();
            }
        }, 200);
  
    };
  
    // control variables
    let currentPage = 1;
    const limit = 60;
    let total = 0;
  
    var scrollwait = false;
  
    window.addEventListener('scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        //console.log('scrollTop + clientHeight >= scrollHeight - 5', scrollTop, clientHeight,  scrollHeight-10)
        if (scrollTop + clientHeight >= scrollHeight - 8 &&
            hasMoreQuotes(currentPage, limit, total)) {
            currentPage++;
            let name = document.getElementById("name");
            if(name.value != '') {
                if(scrollwait == false)
                {
                    scrollwait = true;
                    loadQuotes(name.value, currentPage, limit);
                    sleep(5000);
                    scrollwait = false;
                }
            }
        }
    }, {
        passive: true
    });

    function sleep(ms) {
        setTimeout(ms);
      }
    
      document.getElementById("search").addEventListener("click", function() {
      quotesEl.innerHTML = '';
      let name = document.getElementById("name");
      if(name.value != '') {
        loadQuotes(name.value, currentPage, limit);
      }
    });
  
  })();