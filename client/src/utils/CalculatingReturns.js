// function helpers

const msInDays = 24 * 60 * 60 * 1000;

// Return divided Annually

// check which quarter date is going into.
// below is not finish yet.

const now = new Date();
const thisYear = now.getFullYear();

const quarters = {};

let i = 1;

for (let m = 0; m < 12; m += 3) {
  const startDate = new Date(thisYear, m, 1);
  const endDate = new Date(thisYear, m + 3, 0);

  quarters[`Q${i}`] = {
    startDate,
    endDate,
  };

  i++;
}

const checkQuarter = (date) => {
  const month = date.getMonth();
  console.log(month);

  for (let i = 1; i <= 4; i++) {
    const getQuarterDate = quarters[`Q${i}`].startDate.getMonth();
    if (getQuarterDate === month) {
      console.log(quarters[`Q${i}`].startDate, month);
    }
  }
  // how can i get the m value in the start date, its going into that quarter i think i will need to extract the key.
};

checkQuarter(new Date(2026, 0, 3));

// given two dates it will see the different in days

const checkDateDifference = (firstDate) => {
  const today = new Date().getTime();

  const msDifferenceFromDays = today - firstDate;

  const totalDays = Math.ceil(msDifferenceFromDays / msInDays);

  return totalDays;
};

// below is creating a quarters object with live dates;

// calculate amount invested;

export const investmentAmount = (events, investments, property) => {
  
  let expectedReturn = 0;

  const initialInvestment = {
    event_date: property?.closing_date,
    event_amount: investments?.invested_amount,
    event_type: "Initial Investment",
  };

  const allEvents = [...events, initialInvestment];

  for (let i = 0; i < allEvents.length; i++) {
    const currentEvent = allEvents[i];
    if (
      currentEvent?.event_type === "Investment" ||
      currentEvent?.event_type === "Capital Call" ||
      currentEvent?.event_type === "Initial Investment"
    ) {
      let eventAmount = Number(currentEvent.event_amount);
      let totalDays = checkDateDifference(
        new Date(currentEvent.event_date).getTime()
      );
      let investorRate = investments?.perf_return / 100;
      const perfReturn = eventAmount * investorRate;
      let annualRate = Number(perfReturn) / 365;
      expectedReturn += totalDays * Number(annualRate);
    }
  }
  console.log(Number(expectedReturn).toFixed(2));
  // this sounds all good now i need it should communicate with chart.js 
};

// expected return function;

// when havering over a graph in the chart.js it should show the event that its associated with it and go to that event as well

export const calculateQuarterlyReturns = () => {
  console.log("ok");
};
export const years = (events = []) => {
  const allYears = new Set();

  events.forEach((e) => {
    if (!e.from_date || !e.to_date) return;
    const from = new Date(e.from_date).getFullYear();
    const to = new Date(e.to_date).getFullYear();

    for (let y = from; y <= to; y++) {
      allYears.add(y);
    }
  });
  return [...allYears].sort();
};

// 1. i want to accomplish that all of the calculations should be bind with the same quarter dates,
// 2. all missing expecting return functions should be in one function.
