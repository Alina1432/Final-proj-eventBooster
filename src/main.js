import './style.css';
import { renderCountrySelect } from './countries.js';
import { openModal } from './modal.js';

const API_KEY = 'kjfUV0VXdQXathzwuuiTSMmuXTNGJHtu';

const countrySelect = document.getElementById('headerInput')
const keywordInput = document.querySelector('.header_input')
const container = document.getElementById('cards-container')
const paginationContainer = document.querySelector('.pagination');

let currentPage = 0;
let timerId;

renderCountrySelect(countrySelect);

function getEvents() {
  container.innerHTML = '<div class="loader">Loading...</div>';

  const country = countrySelect.value
  const keyword = keywordInput.value.trim();

  let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&page=${currentPage}`;

  if (country !== '') {
    url = url + `&countryCode=${country}`;
  }

  if (keyword !== '') {
    url = url + `&keyword=${keyword}`;
  }

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data._embedded && data._embedded.events) {
        showCards(data._embedded.events)
        showPagination(data.page.totalPages)
      } else {
        container.innerHTML = '<div class="loader">No events found.</div>';
        paginationContainer.innerHTML = '';
      }
    })
    .catch(function (error) {
      console.log('Error:', error)
      container.innerHTML = '<div class="loader">Failed to load events.</div>';
    })
}

function showCards(events) {
  container.innerHTML = '';

  events.forEach(function (event) {
    const title = event.name;

    let date = 'TBA';
    if (event.dates && event.dates.start && event.dates.start.localDate) {
      date = event.dates.start.localDate;
    }

    let imageUrl = '';
    if (event.images && event.images[0]) {
      imageUrl = event.images[0].url;
    }

    let venue = 'Location unknown';
    if (event._embedded && event._embedded.venues && event._embedded.venues[0]) {
      venue = event._embedded.venues[0].name;
    }

    const html = `
      <div class="cards_conteiner--one" data-id="${event.id}">
        <div class="cards_conteiner--one--border"></div>
        <img class="card_img" src="${imageUrl}" alt="${title}">
        <h4 class="cards_conteiner--one--title">${title}</h4>
        <p class="cards_conteiner--one--date">${date}</p>
        <div class="cards_conteiner--one--location">
          <img src="./src/img/position.png" alt="position">
          <h5>${venue}</h5>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html)
  })
}

container.addEventListener("click", function (e) {
  const card = e.target.closest('.cards_conteiner--one');
  if (card) {
    const eventId = card.dataset.id;
    openModal(eventId, function (authorName) {
      keywordInput.value = authorName
      currentPage = 0
      getEvents()
    })
  }
})

function showPagination(totalPages) {
  paginationContainer.innerHTML = '';

  let maxPages = totalPages;
  if (maxPages > 50) {
    maxPages = 50
  }

  if (maxPages <= 1) return;

  let startPage = Math.max(0, currentPage - 2)
  let endPage = Math.min(maxPages - 1, startPage + 4)

  if (endPage - startPage < 4) {
    startPage = Math.max(0, endPage - 4)
  }

  if (startPage > 0) {
    const firstButton = document.createElement('button');
    firstButton.classList.add('pagination_item');
    firstButton.textContent = 1
    firstButton.addEventListener('click', function () {
      currentPage = 0
      getEvents()
    })
    paginationContainer.appendChild(firstButton)

    if (startPage > 1) {
      const dotsStart = document.createElement('span')
      dotsStart.classList.add('pagination_dots')
      dotsStart.textContent = '...';
      paginationContainer.appendChild(dotsStart)
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement('button')
    button.classList.add('pagination_item')
    button.textContent = i + 1

    if (i === currentPage) {
      button.classList.add('active')
    }

    button.addEventListener('click', function () {
      currentPage = i;
      getEvents()
    });

    paginationContainer.appendChild(button)
  }

  if (endPage < maxPages - 1) {
    if (endPage < maxPages - 2) {
      const dotsEnd = document.createElement('span')
      dotsEnd.classList.add('pagination_dots')
      dotsEnd.textContent = '...';
      paginationContainer.appendChild(dotsEnd)
    }

    const lastButton = document.createElement('button')
    lastButton.classList.add('pagination_item')
    lastButton.textContent = maxPages

    if (currentPage === maxPages - 1) {
      lastButton.classList.add('active')
    }

    lastButton.addEventListener('click', function () {
      currentPage = maxPages - 1;
      getEvents()
    })

    paginationContainer.appendChild(lastButton)
  }
}

countrySelect.addEventListener('change', function () {
  currentPage = 0
  getEvents()
})

keywordInput.addEventListener("input", function () {
  clearTimeout(timerId)
  timerId = setTimeout(function () {
    currentPage = 0
    getEvents()
  }, 500)
})

getEvents()

