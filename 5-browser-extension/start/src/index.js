//1
// form fields
const form = document.querySelector('.form-data');
const region = document.querySelector('.region-name');
const apiKey = document.querySelector('.api-key');
// results divs
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const usage = document.querySelector('.carbon-usage');
const fossilfuel = document.querySelector('.fossil-fuel');
const myregion = document.querySelector('.my-region');
const clearBtn = document.querySelector('.clear-btn');

//6
//call the API
import axios from '../node_modules/axios';
async function displayCarbonUsage(apiKey, region) {
    try {
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
                let CO2 = Math.floor(response.data.data.carbonItensity);

                loading.style.display = 'none';
                form.style.display = 'none';
                myregion.textContent = region;
                usage.textContent = Math.round(response.data.data.carbonItensity) + 'grams';
                fossilfuel.textContent = response.data.data.fossilfuelPercentage.toFixed(2) + '%';
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
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('regionName', regionName);
    loading.style.display = 'block';
    errors.textContent = '';
    clearBtn.style.display = 'block';
    dispalyCarbonUsage(apiKey, regionName);
}
//4
// handle form submission
function handleSubmint(e) {
    e.preventDefault();
    setUpUser(apiKey.value, region.value);
}
//3 initial checks
function init() {
    //if anything is in localStorage, pick it up
    const storedApiKey = localStorage.getItem('apiKey');
    const storedRegion = localStorage.getItem('regionName');

    //set icon to be generic green
    //todo

    if (storedApiKey == null || storedRegion == null) {
        form.style.display = 'block';
        results.style.display = 'none';
        loading.style.display = 'none';
        clearBtn.style.display = 'none';
        errors.textContent = '';
    } else {
        dispalyCarbonUsage(storedApiKey, storedRegion);
        results.style.display = 'none';
        form.style.display = 'none';
        clearBtn.style.display = 'block';
    }
}
function reset(e) {
    e.preventDefault();
    localStorage.removeItem('regionName');
    init();
}
//2
// set listeners and start app
form.addEventListener('sumbit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => resizeTo(e));
init();