const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll('.dropdown select');
const button = document.querySelector('form Button');
const fromCurr = document.querySelector('.from select');
const toCurr = document.querySelector('.to select');
const msg = document.querySelector('.msg')

document.addEventListener("load",() => {});

for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement('option');
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === 'from' && currCode === 'USD') {
            newOption.selected = true;
        } else if (select.name === 'to' && currCode === 'NPR') {
            newOption.selected = true;
        }
        select.append(newOption);
    }
    select.addEventListener('change', (event) => {
        updateFlag(event.target);
    })
}

const updateExchangeRate = async () => {
    let amount = document.querySelector('.amount input');
    let amountValue = amount.value;
    
    // Input validation
    if (amountValue === "" || amountValue < 1) {
        amountValue = 1;
        amount.value = '1';
    }

    // Show loading state
    msg.innerText = "Getting exchange rate...";

    try {
        const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
        const response = await fetch(URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rate');
        }
        
        const data = await response.json();
        const rate = data[toCurr.value.toLowerCase()];
        
        if (rate) {
            const finalAmount = (amountValue * rate).toFixed(2);
            msg.innerText = `${amountValue} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        } else {
            throw new Error('Invalid exchange rate received');
        }
    } catch (error) {
        msg.innerText = `Error: ${error.message}`;
    }
};



const updateFlag = (element) => {
    let currCode = element.value
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;  
}

button.addEventListener('click', (event) => {
    event.preventDefault();
    updateExchangeRate();
});


window.addEventListener('load', updateExchangeRate);