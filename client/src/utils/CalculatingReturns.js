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
        (start = addQuarters(new Date(start), 1));
    }
  });

  const chartData = Object.values(combined);

  return chartData;
};

const returnHelper = (initialInvestment, events, perfRate) => {

  const amountAtClosing = initialInvestment;
  const rate = perfRate;
  const allEvents = events;

  events?.forEach((evt) =>   {


  })

  console.log(allEvents)

 

  return amountAtClosing * (rate / 100)

}


const expectedReturn = (initialInvestment,  events, perfRate) =>  {

  const returnOnAmount = returnHelper(initialInvestment, events, perfRate);

  console.log(returnOnAmount)


// data will need to import 
  // initial investment's,
  // investments events,
  // perf return rate

}





export { actualReturns, expectedReturn};
