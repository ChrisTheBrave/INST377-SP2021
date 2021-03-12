function mapInit() {
  const mymap = L.map('mapid').setView([38.9805556, -76.9372222], 13);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY2FzaDExIiwiYSI6ImNrbTU2cTRnMDBicmoydnA1cjVoNzkyZDMifQ.J7-dgOlyC6lr_l9ILikSmQ'
  }).addTo(mymap);

  console.log('mymap', mymap);

  return mymap;
}

async function dataHandler(mapObjectFromFunction) {
  const form = document.querySelector('.userform');
  const search = document.querySelector('#search');
  const replyMessage = document.querySelector('.reply-message');
  const suggestions = document.querySelector('.suggestions');

  const request = await fetch('/api');
  const data = await request.json();
  // console.table(data);

  form.addEventListener('submit', async (event) => {
    suggestions.innerText = '';

    event.preventDefault();
    console.log('submit fired', search.value);
    // eslint-disable-next-line max-len
    const filtered = data.filter((record) => record.zip.includes(search.value) && record.geocoded_column_1);
    const topFive = filtered.slice(0, 5);

    if (topFive.length < 1) {
      replyMessage.classList.add('box');
      replyMessage.innerText = 'No matches found';
    } else {
      console.table(topFive);

      topFive.forEach((item) => {
        const longLat = item.geocoded_column_1.coordinates;
        console.log('markerLongLat', longLat[0], longLat[1]);
        const marker = L.marker([longLat[1], longLat[0]]).addTo(mapObjectFromFunction);

        const appendItem = document.createElement('li');
        appendItem.classList.add('block');
        appendItem.classList.add('list-item');
        appendItem.innerHTML = `<div class="list-header is-size-5">${item.name}</div><address class="is-size-6">${item.address_line_1}</address>`;
        suggestions.append(appendItem);
      });

      const {coordinates} = topFive[0]?.geocoded_column_1;
      console.log('viewSet coords', coordinates);
      mapObjectFromFunction.panTo([coordinates[1], coordinates[0]], 0);
    }
  });
  search.addEventListener('input', (event) => {
    console.log('input', (event.target.value));
    if (search.value.length === 0) {
      replyMessage.innerText = '';
      replyMessage.classList.remove('box');
    }
  });
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;
