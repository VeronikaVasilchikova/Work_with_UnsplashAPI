document.addEventListener('DOMContentLoaded', () => {

  // get UI-elements
  const INPUTNAME = document.getElementById('name');
  const SPANGREETING = document.querySelector('.greeting span');
  const TIME = document.querySelector('.time');
  const DATE = document.querySelector('.date');
  const ACCESS_KEY = 'fba8135f9553b5e400ac3627d1cb4593084e8abda6cf5085c1159217ce1714af';
  const INTEREST = document.getElementById('interest');
  const PHOTOBY = document.querySelector('.photoby');
  const QUOTE = document.querySelector('.quote h3');

  // current time
  // update every 10 seconds
  setCurrentTime();
  setInterval(function(){
    setCurrentTime();
  }, 10*1000);

  // show a quote from theysaidso.com
  newQuote()
  .then(data => {
    QUOTE.textContent = data.contents.quotes[0].quote;
  })
  .catch(err => console.log(err));

  //check cookie

  let userName = getCookie('userName');

  if(userName) {
    SPANGREETING.textContent = userName;
    INPUTNAME.style.display = 'none';

    let your_interest = getCookie('your_interest');

    if(your_interest) {
      let picture = getCookie('picture');
      let author = getCookie('author');
      let link_to_author = getCookie('link_to_author');
      if(!picture) {
        newImage(your_interest);
      }
      document.body.style.backgroundImage = `url('${picture}')`;
      PHOTOBY.textContent = author;
      PHOTOBY.setAttribute("href", `${link_to_author}`);
      INTEREST.setAttribute("placeholder", your_interest);
    }
  } else {
    SPANGREETING.textContent = '';
    INPUTNAME.style.display = 'block';
  }

  // add change-event to interest-input
  INTEREST.addEventListener('change', (e) => {
    INTEREST.classList.add('typed-interest');
    let your_interest = e.target.value;
    newImage(your_interest)
    .then(data => {
      let number = getRandomInt(0, 20);
      let dataResult = data.results[`${number}`];
      let picture_url = dataResult.urls.raw;
      let author = dataResult.user.name;
      let link_to_author = dataResult.user.portfolio_url;
      document.body.style.backgroundImage = `url('${picture_url}')`;
      PHOTOBY.textContent = author;
      PHOTOBY.setAttribute("href", `${link_to_author}`);
      setCookie('picture', picture_url);
      setCookie('author', author);
      setCookie('link_to_author', link_to_author);
      setCookie('your_interest', your_interest);
    })
    .catch(err => console.log(err));

  });

  // add input-event to inputname-input
  INPUTNAME.addEventListener('input', () => {
    INPUTNAME.classList.add('typed-name');
    let name = INPUTNAME.value;
    SPANGREETING.textContent = name;
    setCookie('userName', name, {expires: 365});
  });

  // add input-event to inputname-input
  INPUTNAME.addEventListener('change', () =>{
    INPUTNAME.style.display = 'none';
  });


  // Functions

  // create a function which sends query and gets new image from unsplash.com
  async function newImage(query) {
    let url = `https://api.unsplash.com/search/photos?query=${query}&per_page=20&orientation=landscape&client_id=${ACCESS_KEY}`;
		const result = await fetch(url);
		if(!result.ok) {
			throw new Error(`status: ${result.status}`);
		}
		return await result.json();
  }

  // create a function which gets random quotes from theysaidso.com
  async function newQuote() {
    let url = 'http://quotes.rest/qod.json';
		const result = await fetch(url);
		if(!result.ok) {
			throw new Error(`status: ${result.status}`);
		}
		return await result.json();
  }

  // create a function which generate random integers
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // create a function which sets cookie
  function setCookie(name, value, options = {}) {
    options = {
      path: '/',
      ...options
    };
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    document.cookie = updatedCookie;
  }

  // create a function which get cookie
  function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  // create a function which sets current time
  function setCurrentTime(){
    let now = new Date();
    let hours = now.getHours();
    let setHours = hours > 9 ? hours : `0${hours}`
    let minutes = now.getMinutes();
    let setMinutes = minutes > 9 ? minutes : `0${minutes}`;
    TIME.textContent = `${setHours}:${setMinutes}`;
    DATE.textContent = `${now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})}`;
  }

});