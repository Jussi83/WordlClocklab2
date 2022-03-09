const cityHeader = document.getElementById('current-city');
const selectCity = document.getElementById('city');
const cityListElement = document.getElementsByName('city-list')[0];

let citysList = [];
let thisTimeZone = 'Europe/Paris';
let timeZones = [];

let country;
let addCity = null;

function InputTimezone() {
  let html = '';

  for (let timeZone of timeZones) {
    html += `<option>${timeZone}</option>`;
  }
  inputTimezone.innerHTML = html;
}

function setTime() {
  //update the current time every second
  setInterval(() => {
    let date = new Date();
    let options = {
      timeZone: `${thisTimeZone}`,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    let currentTimeDigital = new Intl.DateTimeFormat('en-US', options).format(date);
    digitalTime.textContent = currentTimeDigital;

    options = {
      timeZone: `${thisTimeZone}`,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    }

    let currentTimeAnalog = new Intl.DateTimeFormat('en-US', options).format(date);

    let hr = currentTimeAnalog.split(':')[0];
    let min = currentTimeAnalog.split(':')[1];
    let sec = currentTimeAnalog.split(':')[2];

    hr_rotation = 30 * hr + min / 2;
    min_rotation = 6 * min;
    sec_rotation = 6 * sec;

    hour.style.transform = `rotate(${hr_rotation}deg)`;
    minute.style.transform = `rotate(${min_rotation}deg)`;
    second.style.transform = `rotate(${sec_rotation}deg)`;


  }, 1);
}

fillDatalist();
setTime();
addButton.addEventListener('click', () => {
  let newCityName = inputCity.value;
  let newCityTimezone = inputTimezone.value;

  addCity = {
    name: newCityName,
    timeZone: newCityTimezone
  };

  saveCity(addCity);
  fillDatalist();

  inputCity.value = '';
})

function saveCity(city) {
  let myCitys = JSON.parse(localStorage.getItem("myCitys")) || [];
  myCitys.push(city);
  localStorage.setItem("myCitys", JSON.stringify(myCitys));
};

//clear inputs tag on users click
cityListElement.addEventListener('click', () => {
  cityListElement.value = '';
})

cityListElement.addEventListener('input', () => {
  let city;
  if (city = citylist.find(x => x.name === cityListElement.value)) {
    cityHeader.innerHTML = cityListElement.value;
    thisTimeZone = city.timeZone;
  }

});
async function fillDatalist() {
  let rawData = await fetch('timezones.json');
  country = await rawData.json();

  for (let i = 0; i < country.length; i++) {
    let name = country[i].WindowsTimeZones[0].Name.split(') ')[1];
    let timeZone = country[i].TimeZones[0];
    timeZones.push(timeZone)
    let city = {
      name: name,
      timeZone: timeZone
    }
    citylist.push(city);
  }

  for (city of citylist) {
    let tempNamesArray = new Array
    let arrayTemp = new Array
    //if one entry contains several citys, splits it into several entries.
    if (city.name.includes(',')) {
      tempNamesArray = city.name.split(', ');

      for (let i = 0; i < tempNamesArray.length; i++) {
        let thisCity = {
          name: tempNamesArray[i],
          timeZone: city.timeZone
        }
        arrayTemp.push(thisCity)
      }

      citylist = citylist.concat(arrayTemp);
      const index = citylist.indexOf(city);
      citylist.splice(index, 1);
    }
  }

  let mycitys;
  if (JSON.parse(localStorage.getItem("myCitys")) !== null) {
    mycitys = JSON.parse(localStorage.getItem("myCitys"));
    citylist = citylist.concat(mycitys);
  }

  //sorts citys in alphabetically order
  citylist.sort((a, b) => {
    let fa = a.name.toLowerCase(),
      fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  //removes duplication
  citylist = Array.from(citylist.reduce((a, o) => a.set(o.name, o), new Map()).values());

  let html = '';

  for (city of citylist) {
    html += '<option>' + city.name + '</option>'
  }

  //fills datalist with citys
  selectCity.innerHTML = html;

  timeZones.sort()
  fillInputTimezone();
}