//j2UBASLX9TL4cmZdSwuqctteHzSaXvsA - мій апі ключ

import './style.css'

const API_KEY = 'j2UBASLX9TL4cmZdSwuqctteHzSaXvsA';
const URL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}`;

function fetchEvents() {
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      const events = data._embedded ? data._embedded.events : [];
      renderCards(events)
    })
    .catch(error => console.error('Помилка:', error))
}

function renderCards(events) {
  const container = document.getElementById('cards-container')
  container.innerHTML = '';

  events.forEach(event => {
    const title = event.name;
    const date = event.dates?.start?.localDate || 'TBA'
    const imageUrl = event.images[0]?.url
    const venue = event._embedded?.venues?.[0]?.name || 'Location unknown'

    const cardHTML = `
      <div class="cards_conteiner--one">
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

    container.insertAdjacentHTML('beforeend', cardHTML)
  })
}
fetchEvents()

