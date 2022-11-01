//1
// form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');
const submitBtn = document.querySelector('button.search-btn');
// results divs
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');

function calculateColor(value) {
    let co2Scale = [0, 150, 600, 750, 800];
    let colors = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];

    let closestNum = co2Scale.sort((a, b) => {
        return Math.abs(a - value) - Math.abs(b - value);
    })[0];
    console.log(value + ' is closest to' + closestNum);

    let num = (element) => element > closestNum;
    let scaleIndex = co2Scale.findIndex(num);

    let closestColor = colors[scaleIndex];
    console.log(scaleIndex, closestColor);

    chrome.runtime.sendMessage({ action: 'updateIcon', value: { color:closestColor } });
}
//6
//call the API
import axios from '../node_modules/axios';
async function displayCarbonUsage(apiKey, region) {
    console.log('display called');
    try {
        console.log('begin try');
        await axios
            .get('https://api.co2signal.com/v1/latest', {
                params: {
                    countryCode: region,
                },
                headers: {
                    'auth-token': apiKey,
                }
            })
            .then((response) => {
                console.info(response);
                let CO2 = Math.floor(response.data.data.carbonIntensity);
                calculateColor(CO2);
                loading.style.display = 'none';
                form.style.display = 'none';
                myregion.textContent = region;
                usage.textContent = CO2 + 'grams';
                fossilfuel.textContent = response.data.data.fossilFuelPercentage.toFixed(2) + '%';
                results.style.display = 'block';
            });
    } catch (error) {
        console.log(error);
        loading.style.display = 'none';
        results.style.display = 'none';
        errors.textContent = 'Sorry, no data for requested region.';
    }
}

//5
//set up user's api key and region
function setUpUser(apiKey, regionName) {
    console.log("setUpUser called");
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    displayCarbonUsage(apiKey, regionName);
}
//4
// handle form submission
function handleSubmit(e) {
    console.log("handleSubmit called");
    e.preventDefault();
    setUpUser(apiKey.value, region.value);
}
//3 initial checks
function init() {
    console.debug();
    console.log("init called");
    //if anything is in localStorage, pick it up
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');
    console.debug(storedApiKey, storedRegion);

    //set icon to be generic green
    //todo
    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: {
            color: 'green',
        },
    });

    if (storedApiKey == null || storedRegion == null) {
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        displayCarbonUsage(storedApiKey, storedRegion);
        results.style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    }
}
function reset(e) {
    console.trace();
    console.log('reset called');
    e.preventDefault();
    localStorage.removeItem('regionName');
    init();
}
//2
// set listeners and start app
// for some reson, adding listener on 'form' object failed, thus adding one on 'submitBtn' for replacement
form.addEventListener('submit', (e) => {console.log(e); handleSubmit(e)});
clearBtn.addEventListener('click', (e) => reset(e));
//submitBtn.addEventListener('click', (e) => {console.log(e); handleSubmit(e)});
init();