import {
  addQuarters,
  eachDayOfInterval,
  endOfQuarter,
  startOfQuarter,
} from "date-fns";

const actualReturns = (events, year) => {
  // only getting the Return events.
  const returnEvents = events?.filter((event) => event.event_type === "Return");

  const rawQuartersData = [];

  let combined = 0;

  returnEvents?.forEach((event) => {
    const fromDate = new Date(event.from_date);
    const endDate = new Date(event.to_date);
    const eventAmount = event.event_amount;

    // getting total of days per event.

    const startYear = new Date(year, 0, 1);
    const yearEnd = new Date(year, 12, 0);

    const clampSYear = fromDate > startYear ? fromDate : startYear;
    const clampEYear = endDate < yearEnd ? endDate : yearEnd;

    const days = eachDayOfInterval({
      start: fromDate,
      end: endDate,
    }).length;

    const eventAmountByDays = eventAmount / days;

    let start = startOfQuarter(clampSYear);

    let totalDays = 0;

    while (start <= clampEYear) {
      const qEnd = endOfQuarter(start);
      const qStart = startOfQuarter(start);
      const startDays = fromDate > qStart ? fromDate : qStart;
      const endDays = endDate < qEnd ? endDate : qEnd;

      if (startDays <= endDays) {
        totalDays = eachDayOfInterval({
          start: startDays,
          end: endDays,
        }).length;
      }

      const totalAmountPerQuarter = totalDays * eventAmountByDays;
      const quarter = startOfQuarter(new Date(start));
      rawQuartersData.push({ y: quarter, x: totalAmountPerQuarter.toFixed(2) });

      combined = rawQuartersData.reduce((acc, item) => {
        if (!acc[item.y]) {
          acc[item.y] = { x: item.y, y: 0 };
        }
        acc[item.y].y += Number(item.x);

        return acc;
      }, {});
      start = addQuarters(new Date(start), 1);
    }
  });

  const chartData = Object.values(combined);

  return chartData;
};

let totalAmountInvested;

const returnHelper = (initialInvestment, events, perfReturn) => {
  const amountAtClosing = initialInvestment;

  const rate = perfReturn;

  const allEvents = events;

  totalAmountInvested = amountAtClosing;

  allEvents?.forEach((evt) => {
    if (evt.event_type === "Capital Call") {
      totalAmountInvested += Number(evt.event_amount);
    } else if (
      evt.event_type === "Investment" ||
      evt.event_type === "Return to Capital"
    ) {
      totalAmountInvested -= Number(evt.event_amount);
    }
  });

  return totalAmountInvested * (rate / 100);
};

const investmentToDate = (initialInvestment, events) => {
  const amountAtClosing = initialInvestment;
  const allEvents = events;

  totalAmountInvested = amountAtClosing;

  allEvents?.forEach((evt) => {
    if (evt.event_type === "Capital Call") {
      totalAmountInvested += Number(evt.event_amount);
    } else if (
      evt.event_type === "Investment" ||
      evt.event_type === "Return to Capital"
    ) {
      totalAmountInvested -= Number(evt.event_amount);
    }
  });

  return totalAmountInvested;
};

const investmentActualReturn = (events) => {
  const returnEvents = events?.filter((event) => event.event_type === "Return");

  const totalReturn = returnEvents?.reduce((acc, evt) => {
    return acc + Number(evt.event_amount);
  }, 0);

  return totalReturn;
};

const expectedReturn = (initialInvestment, events, perfRate, year) => {
  
  const returnOnAmount = returnHelper(initialInvestment, events, perfRate);

  let expectedAmount = [];

  const dividedIntoQuarters = returnOnAmount / 4;

  for (let i = 0; i <= 11; i += 3) {
    const quarter = new Date( year, i, 1);

    const amount = Number(dividedIntoQuarters);

    expectedAmount.push({ x: quarter, y: amount });
  }
  console.log(expectedAmount)

  return expectedAmount;
};

export {
  actualReturns,
  expectedReturn,
  returnHelper,
  investmentToDate,
  investmentActualReturn,
};
