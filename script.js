// ===================================================
// FinanceOrbit v2 - Final Combined
// ===================================================


// --- UTILITY FUNCTIONS ---

let exchangeRate = 1;


function formatMoney(value, currency) {

    const usd = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value);


    if (currency === "USD") {

        return `<span class="usd-text">${usd}</span>`;

    }


    const converted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency
    }).format(value * exchangeRate);


    return `
    <span class="usd-text">${usd}</span>
    /
    <span class="cur-text">${converted}</span>
    `;

}





async function updateExchangeRate() {


    const currency = document.getElementById("currency").value;


    if (currency === "USD") {

        exchangeRate = 1;
        return;

    }



    try {


        const response = await fetch(
            "https://open.er-api.com/v6/latest/USD"
        );


        const data = await response.json();


        exchangeRate = data.rates[currency];


    } catch(error) {


        console.log(error);

        exchangeRate = 1;

    }

}







function validateInputs(total) {


    if (isNaN(total) || total <= 0) {


        alert("Please enter a valid Total Amount.");

        return false;


    }


    return true;

}







function getFincoInterest(months, flight) {


    if (flight === "yes") {


        return months <= 6 ? 3.99 : 6.99;


    }


    return months <= 6 ? 5.99 : 8.99;


}








function loanPayment(principal, annualRate, months) {


    if (principal <= 0) return 0;



    const monthlyRate = (annualRate / 100) / 12;



    if (monthlyRate === 0) {


        return principal / months;


    }



    return (
        principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)
    )
    /
    (
        Math.pow(1 + monthlyRate, months) - 1
    );


}








// --- CORE LOGIC ---


async function calculate() {


    await updateExchangeRate();



    const currency = document.getElementById("currency").value;


    const total = Number(
        document.getElementById("total").value
    );



    if (!validateInputs(total)) return;



    const investmentPercent =
        Number(document.getElementById("investmentPercent").value);



    const adminCost =
        Number(document.getElementById("admin").value);



    const flightOption =
        document.getElementById("fly").value;



    const flightValue =
        Number(document.getElementById("flyValue").value);



    const flightQty =
        Number(document.getElementById("flyQty").value);



    const fincoMonths =
        Number(document.getElementById("months").value);



    const balanceMonths =
        Number(document.getElementById("balanceMonths").value);



    const balanceRate =
        Number(document.getElementById("balanceRate").value);





    // Calculations


    const initialInvestment =
        total * investmentPercent;



    const todayPercentage =
        initialInvestment * 0.25;



    const paymentToday =
        todayPercentage + adminCost;



    const fincoBase =
        initialInvestment * 0.75;



    const flightTotal =
        flightOption === "yes"
        ? flightValue * flightQty
        : 0;



    const fincoAmount =
        fincoBase + flightTotal;



    const fincoInterest =
        getFincoInterest(
            fincoMonths,
            flightOption
        );



    const fincoMonthly =
        loanPayment(
            fincoAmount,
            fincoInterest,
            fincoMonths
        );



    const balanceAmount =
        total * 0.60;



    const balanceMonthly =
        loanPayment(
            balanceAmount,
            balanceRate,
            balanceMonths
        );



    const totalMonthly =
        fincoMonthly + balanceMonthly;







    // OUTPUT


    document.getElementById("output").innerHTML = `


    <h3>Sale Summary</h3>


    <strong>Total Amount</strong><br>
    ${formatMoney(total,currency)}
    <br><br>


    <strong>Initial Investment (${investmentPercent * 100}%)</strong><br>
    ${formatMoney(initialInvestment,currency)}
    <br><br>



    <strong>25% Due Today</strong><br>
    ${formatMoney(todayPercentage,currency)}
    <br><br>



    <strong>Administration Cost</strong><br>
    ${formatMoney(adminCost,currency)}
    <br><br>



    <strong>Payment Today</strong><br>
    ${formatMoney(paymentToday,currency)}



    <hr>



    <h3>Finco Financing</h3>



    <strong>Finco Base (75%)</strong><br>
    ${formatMoney(fincoBase,currency)}
    <br><br>



    <strong>Flight Absorber</strong><br>


    ${
        flightOption === "yes"

        ?

        `${flightQty} × ${formatMoney(flightValue,currency)}
        <br>
        Added:
        ${formatMoney(flightTotal,currency)}`


        :

        "Without Flight Absorber"

    }


    <br><br>



    <strong>Total Finco Amount</strong><br>
    ${formatMoney(fincoAmount,currency)}
    <br><br>



    <strong>Finco Interest</strong><br>
    ${fincoInterest}% 
    <br>
    ${fincoMonths} Payments


    <br><br>


    <strong>Finco Monthly Payment</strong><br>
    ${formatMoney(fincoMonthly,currency)}




    <hr>




    <h3>Balance Financing</h3>



    <strong>Balance Amount (60%)</strong><br>
    ${formatMoney(balanceAmount,currency)}


    <br><br>



    <strong>Interest</strong><br>
    ${balanceRate}%


    <br>


    ${balanceMonths} Months



    <br><br>



    <strong>Balance Monthly Payment</strong><br>
    ${formatMoney(balanceMonthly,currency)}




    <hr>




    <h2>Total Monthly Payment</h2>


    ${formatMoney(totalMonthly,currency)}



    `;



}