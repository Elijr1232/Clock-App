const month = document.getElementById("month");
const dayEl = document.getElementById("day");
const year = document.getElementById("year");
const season = document.getElementById("season");
let hours = document.getElementById("hours");
let minutes = document.getElementById("minutes");
let ampm = document.getElementById("am-pm");
let mainTime = document.getElementById("main-time");
const loader = document.getElementById("loader");
const timeZoneSelect = document.getElementById("timezone");
let timezoneOptions = Array.from(document.querySelectorAll(".timezone-option"));
const locationModal = document.getElementById("location-modal");
const locationBtn = document.getElementById("location-btn");
const locationEl = document.getElementById("location");
const locationCloseBtn = document.getElementById("location-close-btn");
const locationForm = document.getElementById("loc-form");

const date = new Date();
let hourData = +date.getHours();
let minuteData = +date.getMinutes();
let day = date.getDay();

//Open Location Interface
function openLocation() {
  locationModal.classList.remove("closed");
  locationModal.classList.add("show");
  locationCloseBtn.classList.add("show");
}

function closeLocation() {
  locationModal.classList.add("closed");
  locationModal.classList.remove("show");
  locationCloseBtn.classList.remove("show");
}

//Submit Location Input
function locationSubmit(e) {
  e.preventDefault();
  const locationInput = document.getElementById("location-input");
  const userLocation = locationInput.value;
  locationInput.value = "";
  locationEl.innerHTML = userLocation;
  localStorage.setItem("location", `${userLocation}`);
  closeLocation();
}

//Check Local Storage for Initial Location
function setLocation() {
  if (localStorage.getItem("location")) {
    locationEl.innerHTML = localStorage.getItem("location");
  }
}

//Set initial timezone
function setTimeZone() {
  timezoneOptions.forEach((option) => {
    option.selected = false;
    let diff = date.getTimezoneOffset() / 60;
    if (diff === +option.value) {
      option.selected = true;
    }
  });
}

//Calculate new time on timezone change
function timeZoneChange() {
  let uniTime = date.getUTCHours();

  timezoneOptions.forEach((option) => {
    if (option.selected === true) {
      let diff = uniTime - option.value;
      if (diff < 0) {
        diff += 24;
      }
      let minuteData = minutes.innerHTML;
      getTime(diff, minuteData);
    }
  });
}

//Manage Time Data
function getTime(hour = hourData, minute = minuteData) {
  let hourLength;
  let minuteLength = minute.toString().length;
  var hourText = hour;
  let minuteText = minute;

  //AM PM
  if (hour <= 11) {
    ampm.innerHTML = "A";
  } else if (hour >= 12) {
    ampm.innerHTML = "P";
  }

  //Adjust 0-23 to midnight
  if (hour === 0) {
    var hourText = 12;
  }

  //Adjust 0-23 to 1-12
  if (hour > 12) {
    hourText = hour - 12;
  }

  //Add Zeros to single digit
  hourLength = hourText.toString().length;
  if (minuteLength === 1) {
    minuteText = `0${minuteText}`;
  } else {
    minuteText = minute;
  }

  if (hourLength === 1) {
    hourText = `0${hourText}`;
  }

  dayEl.innerHTML = date.getDate();
  year.innerHTML = date.getFullYear();
  month.innerHTML = date.getMonth() + 1;
  hours.innerHTML = hourText;
  minutes.innerHTML = minuteText;
}

//Loader
setTimeout(function () {
  mainTime.style.display = "flex";
  loader.style.display = "none";
}, 3000);

//Get and Start Second Count
window.setInterval(
  (function () {
    var secondsData = date.getSeconds();
    var secondsCount = document.createTextNode("");
    document.getElementById("seconds").appendChild(secondsCount);
    return function () {
      secondsCount.data = secondsData += 1;
      if (secondsData < 10 && secondsData >= 1) {
        secondsCount.data = `0${secondsData}`;
      }
      //Reset seconds At 60
      if (secondsCount.data >= 60) {
        secondsCount.data = "00";
        secondsData = 0;
        minute();
      }
    };
  })(),
  1000
);

//Push Minutes after 60 seconds
function minute() {
  let minuteData = +minutes.innerHTML + 1;
  let hourData = +hours.innerHTML;

  //account for AM PM Hours
  if (ampm.innerHTML === "P") {
    hourData += 12;
  }

  //Pushing minute at 59
  if (minuteData === 60) {
    minuteData = 0;
    hourData += 1;
  }
  getTime(hourData, minuteData);
}

//Get Weekday
function getWeekDay(dayNum = day) {
  switch (dayNum) {
    case 0:
      dayNum = "Sunday";
      break;
    case 1:
      dayNum = "Monday";
      break;
    case 2:
      dayNum = "Tuesday";
      break;
    case 3:
      dayNum = "Wednesday";
      break;
    case 4:
      dayNum = "Thursday";
      break;
    case 5:
      dayNum = "Friday";
      break;
    case 6:
      dayNum = "Saturday";
  }

  document.getElementById("weekday").innerHTML = dayNum;
}

//Get Season
function getSeason() {
  let monthNum = date.getMonth() + 1;
  if (monthNum >= 2 && monthNum <= 5) {
    season.src = "./img/spring.png";
  } else if (monthNum >= 6 && monthNum <= 8) {
    season.src = "./img/summer.png";
  } else if (monthNum >= 8 && monthNum <= 10) {
    season.src = "./img/fall.png";
  } else if (monthNum === 11 || (monthNum >= 0 && monthNum <= 2)) {
    season.src = "./img/winter.png";
  }
}

//Event Listeners
locationBtn.addEventListener("click", openLocation);
locationCloseBtn.addEventListener("click", closeLocation);
locationForm.addEventListener("submit", locationSubmit);

//Initial Calls
setLocation();
getWeekDay();
getSeason();
getTime(hourData, minuteData);
setTimeZone();
