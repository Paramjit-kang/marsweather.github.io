// api key for nasa WxDNvhmev1tdoRDdy9yC3V7PxwsHob51Jn0ea6QU

const api_key = "mHpYSm8PJLa9FWZFdq4vew7NMB1A4nnnuXiKzHt7";
const api_url = `https://api.nasa.gov/insight_weather/?api_key=${api_key}&feedtype=json&ver=1.0`;
const currentSolElement = document.querySelector("[data-current-sol]");
const currentDateElement = document.querySelector("[data-current-date]");
const currentTempHigh = document.querySelector("[data-temp-high]");
const currentTempLow = document.querySelector("[data-temp-low]");
const windSpeedElement = document.querySelector("[data-wind-speed]");
const windDirectionText = document.querySelector("[data-wind-direction-text]");
const windDirectionArrow = document.querySelector(
  "[data-wind-direction-arrow]"
);
const unitToggle = document.querySelector("[data-unit-toggle]");
const metricRadio = document.getElementById("cel");
const imperialRadio = document.getElementById("fah");

let selectedSolIndex;

getWeather().then((sols) => {
  selectedSolIndex = sols.length - 1;
  displaySelectedSol(sols);
  updateUnits();

  unitToggle.addEventListener("click", () => {
    let metricUnit = !isMetric();
    metricRadio.checked = metricUnit;
    imperialRadio.checked = !metricUnit;

    updateUnits();
    displaySelectedSol(sols);
  });

  metricRadio.addEventListener("change", () => {
    updateUnits();
    displaySelectedSol(sols);
  });

  imperialRadio.addEventListener("change", () => {
    updateUnits();
    displaySelectedSol(sols);
  });
});

function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIndex];
  currentSolElement.innerHTML = selectedSol.sol;
  currentDateElement.innerHTML = displayDate(selectedSol.date);
  currentTempHigh.innerHTML = displayTemperature(selectedSol.maxTemp);
  currentTempLow.innerHTML = displayTemperature(selectedSol.minTemp);
  windSpeedElement.innerHTML = displaySpeed(selectedSol.windSpeed);
  windDirectionText.innerHTML = selectedSol.windDirectionCardinal;
  windDirectionArrow.style.setProperty(
    "--direction",
    `${selectedSol.windDirectionDegrees}deg`
  );
}

function displayDate(date) {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
}

function displayTemperature(temp) {
  let returnTemp = temp;

  if (!isMetric()) {
    returnTemp = (temp - 32) * (5 / 9);
  }
  return Math.round(returnTemp);
}

function displaySpeed(speed) {
  let returnSpeed = speed;

  if (!isMetric()) {
    returnSpeed = speed / 1.609;
  }

  return Math.round(returnSpeed);
}

function getWeather() {
  return fetch(api_url)
    .then((res) => res.json())
    .then((data) => {
      const { sol_keys, validity_checks, ...solData } = data;
      return Object.entries(solData).map(([sol, data]) => {
        return {
          sol: sol,
          maxTemp: data.AT.mx,
          minTemp: data.AT.mn,
          windSpeed: data.HWS?.av,
          windDirectionDegrees: data.WD.most_common?.compass_degrees,
          windDirectionCardinal: data.WD.most_common?.compass_point,
          date: new Date(data.First_UTC),
        };
      });
    });
}

function updateUnits() {
  const windUnit = document.querySelector("[data-wind-unit]");
  const tempUnit = document.querySelectorAll("[data-temp-unit]");

  windUnit.innerHTML = isMetric() ? "kph" : "mph";
  tempUnit.forEach((unit) => (unit.innerHTML = isMetric() ? "C" : "F"));
}

function isMetric() {
  return metricRadio.checked;
}

// ---------------------- Animation main page ------------------------- //

let tl = gsap.timeline();
tl.from(".weather", {
  opacity: 0,
  duration: 3.5,
  ease: "slow",
})
  .from(
    ".mars-current-weather",
    {
      opacity: 0,
      duration: 1.5,
      scale: 0.2,
      x: 600,
      y: -150,
      ease: "rough",
    },
    "-=2.2"
  )
  .from(".one", { opacity: 0, scale: 0.5, stagger: 0.5 }, "-=1");

// ------------------------- Skew gallery -------------------------- //

let proxy = { skew: 0 },
  skewSetter = gsap.quickSetter(".skewElem", "skewY", "deg"),
  clamp = gsap.utils.clamp(-20, 20);

ScrollTrigger.create({
  onUpdate: (self) => {
    let skew = clamp(self.getVelocity() / -300);
    if (Math.abs(skew) > Math.abs(proxy.skew)) {
      proxy.skew = skew;
      gsap.to(proxy, {
        skew: 0,
        duration: 0.8,
        ease: "power3",
        overwrite: true,
        onUpdate: () => skewSetter(proxy.skew),
      });
    }
  },
});

gsap.set(".skewElem", { transformOrigin: "right center", force3D: true });
