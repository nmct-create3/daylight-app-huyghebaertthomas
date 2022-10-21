let sunriseElement;
let sunsetElement;
let locationElement;
let sunElement;
let timeLeftElement;
let totalTime = new Date();

//PLACE SUN ON LEFT AND BOTTOM POSTION
//BASED ON TOTAL TIME AND CURRENT TIME

const DegToRads = function (degrees) {
  return (degrees * Math.PI) / 180.0;
};

const placeSun = (totalTimeMinutes, minutesLeft) => {
  const minutesPassed = totalTimeMinutes - minutesLeft;
  const percentage = minutesPassed / totalTimeMinutes;
  console.log(`${percentage * 100}%`);

  const degrees = percentage * 180;
  const radians = DegToRads(degrees);
  const leftPercent = percentage;
  const bottomPercent = Math.sin(radians).toFixed(2);
  if (bottomPercent < 0) bottomPercent = 0;

  console.log(`left: ${leftPercent * 100}%`);
  console.log(`right: ${bottomPercent * 100}%`);

  const sunLeftPosition = percentage * 100; //volledige width gebruiken
  const sunBottomPosition = bottomPercent * 50 + 6; //zon laten uitsteken en helft van volledige height gebruiken

  sunElement.style.left = `${sunLeftPosition}%`;
  sunElement.style.bottom = `${sunBottomPosition}%`;
};

const setDOMElements = () => {
  sunsetElement = document.querySelector(".js-sunset");
  sunriseElement = document.querySelector(".js-sunrise");
  locationElement = document.querySelector(".js-location");
  sunElement = document.querySelector(".js-sun");
  timeLeftElement = document.querySelector(".js-time-left");
  if (!sunriseElement || !sunsetElement || !locationElement || !timeLeftElement || !sunElement) {
    console.error("DOM elements not found");
  }
};

const setLocationData = (city) => {
  sunriseElement.innerText = makeReadableTimeFormatFromTimestamp(city.sunrise); //Unix to HH:MM
  sunsetElement.innerText = makeReadableTimeFormatFromTimestamp(city.sunset); //Unix to HH:MM
  locationElement.innerText = `${city.name}, ${city.country}`;
};

//Unix to HH:MM
const makeReadableTimeFormatFromTimestamp = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const updateTimeAndTimeLeft = (strMinutesLeft) => {
  //Current Date As HH:MM
  sunElement.dataset.time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  //Time Left
  timeLeftElement.innerText = strMinutesLeft;
};

const getData = (endpoint) => {
  return fetch(endpoint)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
};

const getCurrentUnixTimestamp = function () {
  return Math.round(new Date().getTime() / 1000);
};

document.addEventListener("DOMContentLoaded", async function () {
  // 1 We will query the API with longitude and latitude.
  let lat = 50.858009;
  let lon = 3.31269;
  const endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=af88b3c12c5766ea9a2b95c43c7e9de8&units=metric&lang=nl&cnt=1`;
  setDOMElements();
  const { city } = await getData(endpoint);
  console.log(city);

  setLocationData(city);
  let secondsLeft = city.sunset - getCurrentUnixTimestamp(); //Time left in seconds
  console.log(secondsLeft);
  if (secondsLeft < 0) secondsLeft = 0;
  const minutesLeft = secondsLeft / 60; //Time left in minutes
  const totalTimeMinutes = (city.sunset - city.sunrise) / 60; //Total time in minutes
  console.log(`Total: ${totalTimeMinutes}`);
  console.log(`Left: ${minutesLeft}`);
  updateTimeAndTimeLeft(minutesLeft);
  placeSun(totalTimeMinutes, minutesLeft);
});
