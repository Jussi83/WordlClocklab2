const selectedCity = document.getElementById('city');
const listElement = document.getElementsByName('city-list')[0];
const cityHead = document.getElementById('current-city');
const ipCity = document.getElementById('inputcity');
const ipTimezone = document.getElementById('inputtimezone');
const buttonAdd = document.getElementById('addbutton');

let cityList = [];
let thisTimeZone = 'Europe/Paris';
let timeZones = [];

let country;
let addedCity = null;

function inputTimezone() {
  let html = '';

  for (let timeZone of timeZones) {
    html += `<option>${timeZone}</option>`;
  }
  ipTimezone.innerHTML = html;
}

function setTime() {
  //updates time every second.
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

dataList();
setTime();

buttonAdd.addEventListener('click', () => {
  let newCity = ipCity.value;
  let cityTimezoneUpdate = ipTimezone.value;

  addedCity = {
    name: newCity,
    timeZone: cityTimezoneUpdate
  };

  saveCity(addedCity);
  dataList();

  ipCity.value = '';
})

function saveCity(city) {
  let citys = JSON.parse(localStorage.getItem("myCitys")) || [];
  citys.push(city);
  localStorage.setItem("myCitys", JSON.stringify(citys));
};

//clears input tags on users click
listElement.addEventListener('click', () => {
  listElement.value = '';
})

listElement.addEventListener('input', () => {
  let city;
  if (city = cityList.find(x => x.name === listElement.value)) {
    cityHead.innerHTML = listElement.value;
    thisTimeZone = city.timeZone;


  }

});
//Can change diffrent backgrounds but has no function!
/*async function changeBackgroundImg(url) {
  let imageExist = await fetch(url);

  if (imageExist.ok) {
    document.body.style.backgroundImage = `url('${url}')`;
  } else {
    document.body.style.backgroundImage = `url('City.jpeg')`;
  }
}*/
//fills a list with data.
async function dataList() {
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
    cityList.push(city);
  }

  for (city of cityList) {
    let arrayNames = new Array
    let tempArray = new Array
    //if one entry contains several citys, This splits into several entries
    if (city.name.includes(',')) {
      arrayNames = city.name.split(', ');

      for (let i = 0; i < arrayNames.length; i++) {
        let thisCity = {
          name: arrayNames[i],
          timeZone: city.timeZone
        }
        tempArray.push(thisCity)
      }

      cityList = cityList.concat(tempArray);
      const index = cityList.indexOf(city);
      cityList.splice(index, 1);
    }
  }
  //get citys from localstorage
  let myCitys;
  if (JSON.parse(localStorage.getItem("myCitys")) !== null) {
    myCitys = JSON.parse(localStorage.getItem("myCitys"));
    cityList = cityList.concat(myCitys);
  }

  //sort citys in a alphabetic order!
  cityList.sort((a, b) => {
    let sa = a.name.toLowerCase(),
      sb = b.name.toLowerCase();

    if (sa < sb) {
      return -1;
    }
    if (sa > sb) {
      return 1;
    }
    return 0;
  });

  //remove duplicates
  cityList = Array.from(cityList.reduce((a, o) => a.set(o.name, o), new Map()).values());

  let html = '';

  for (city of cityList) {
    html += '<option>' + city.name + '</option>'
  }

  //fills datalist with citys.
  selectedCity.innerHTML = html;

  timeZones.sort()
  inputTimezone();
}
