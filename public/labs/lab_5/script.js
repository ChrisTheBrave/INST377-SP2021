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
//   // use your assignment 1 data handling code here
//   // and target mapObjectFromFunction to attach markers
  const form = document.querySelector('.userform');
  const search = document.querySelector('#search');
  const targetList = document.querySelector('.target-list');
  const replyMessage = document.querySelector('.reply-message');
  // const suggestions = document.querySelector('.suggestions');

  const request = await fetch('/api');
  const data = await request.json();
  // console.table(data);

  form.addEventListener('submit', async (event) => {
    // targetList,innerText = '';

    event.preventDefault();
    console.log('submit fired', search.value);
    // eslint-disable-next-line max-len
    const filtered = data.filter((record) => record.zip.includes(search.value) && record.geocoded_column_1);
    const topFive = filtered.slice(0, 5);
  });
}

async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;
