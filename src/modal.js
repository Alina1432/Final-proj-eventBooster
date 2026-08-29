const API_KEY = 'kjfUV0VXdQXathzwuuiTSMmuXTNGJHtu';

const backdrop = document.getElementById('modal--backdrop');
const modalCloseBtn = document.getElementById('modall_close--btnn');
const modalContent = document.getElementById('modall_contentt');

export function openModal(eventId, onAuthorSearch) {
  const url = `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${API_KEY}`;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (event) {
      renderModalContent(event, onAuthorSearch)
      backdrop.classList.remove('is-hidden')
    })
    .catch(function (error) {
      console.log('Error loading modal data:', error)
    })
}

function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function renderModalContent(event, onAuthorSearch) {
  let imageUrl = event.images && event.images[0] ? event.images[0].url : '';
  let info = event.info || event.pleaseNote || 'No additional info available.';
  let date = event.dates && event.dates.start ? event.dates.start.localDate : 'TBA';
  let time = event.dates && event.dates.start && event.dates.start.localTime ? event.dates.start.localTime : '';
  
  let city = event._embedded && event._embedded.venues && event._embedded.venues[0].city ? event._embedded.venues[0].city.name : '';
  let country = event._embedded && event._embedded.venues && event._embedded.venues[0].country ? event._embedded.venues[0].country.name : '';
  let venue = event._embedded && event._embedded.venues && event._embedded.venues[0] ? event._embedded.venues[0].name : 'Location unknown';
  
  let author = event.name;

  let standartPriceText = '';
  let vipPriceText = '';

  if (event.priceRanges && event.priceRanges.length > 0) {
    let min = event.priceRanges[0].min;
    let max = event.priceRanges[0].max;
    let currency = event.priceRanges[0].currency || 'UAH';

    standartPriceText = `Standart ${min}-${max} ${currency}`;
    vipPriceText = `VIP ${min * 2}-${max * 2} ${currency}`;
  } else {
    let minStandart = getRandomPrice(250, 400)
    let maxStandart = getRandomPrice(500, 700)
    let minVip = getRandomPrice(900, 1200)
    let maxVip = getRandomPrice(1300, 1800)

    standartPriceText = `Standart ${minStandart}-${maxStandart} UAH`;
    vipPriceText = `VIP ${minVip}-${maxVip} UAH`;
  }

  const html = `
    <img class="modal_img--small" src="${imageUrl}" alt="${author}">
    <div class="modal_wrapper">
      <img class="modal_img--big" src="${imageUrl}" alt="${author}">
      <div class="modal_info">
        <h5 class="modal_info--title">INFO</h5>
        <p class="modal_info--text">${info}</p>

        <h5 class="modal_info--title">WHEN</h5>
        <p class="modal_info--text">${date}<br>${time} (${city}/${country})</p>

        <h5 class="modal_info--title">WHERE</h5>
        <p class="modal_info--text">${city}, ${country}<br>${venue}</p>

        <h5 class="modal_info--title">WHO</h5>
        <p class="modal_info--text">${author}</p>

        <h5 class="modal_info--title">PRICES</h5>
        <p class="modal_price--text">
          <span class="modal_price--barcode">|||||||||</span> ${standartPriceText}
        </p>
        <button type="button" class="modal_btn">BUY TICKETS</button>

        <p class="modal_price--text">
          <span class="modal_price--barcode">|||||||||</span> ${vipPriceText}
        </p>
        <button type="button" class="modal_btn">BUY TICKETS</button>
      </div>
    </div>
    <button type="button" class="modal_btn--more">MORE FROM THIS AUTHOR</button>
  `;

  modalContent.innerHTML = html;

  const moreBtn = modalContent.querySelector('.modal_btn--more');
  moreBtn.addEventListener('click', function () {
    backdrop.classList.add('is-hidden');
    if (onAuthorSearch) {
      onAuthorSearch(author);
    }
  })
}

modalCloseBtn.addEventListener('click', function () {
  backdrop.classList.add('is-hidden')
})

backdrop.addEventListener('click', function (e) {
  if (e.target === backdrop) {
    backdrop.classList.add('is-hidden');
  }
})
