export function newCal(events, year) {
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  const  returnedEvents = events.filter((e) => e.type === 'Return')

  const total = returnedEvents
    .map((e) => {
        
      const from = new Date(e.from);
      const to = new Date(e.to);

      const eventStartMoreThenYear = from > yearStart ? from : yearStart;
      const toIsMoreOrLessThenYearEnd = to <= yearEnd ? to : yearEnd;
      if (eventStartMoreThenYear > toIsMoreOrLessThenYearEnd) return 0;

      const eventTotalDays = to - from;

      const thisYearDuration =
        toIsMoreOrLessThenYearEnd - eventStartMoreThenYear;

      return (e.amount || 0) * (thisYearDuration / eventTotalDays);
    })
    .reduce((sum, val) => sum + val, 0);

  return Number(total.toFixed(2));
}


 const msPerDay = 1000 * 60 * 60 * 24;
  // CHART.js functions
  // getting all Return events
  const returnEvents = events?.filter((e) => e.event_type === "Return");

  // defining all quarters and start date and end date.
  const getQuarterRange = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month <= 2)
      return { start: new Date(year, 0, 1), end: new Date(year, 3, 0) };
    if (month <= 5)
      return { start: new Date(year, 3, 1), end: new Date(year, 6, 0) };
    if (month <= 8)
      return { start: new Date(year, 6, 1), end: new Date(year, 9, 0) };
    return { start: new Date(year, 9, 1), end: new Date(year, 12, 0) };
  };

  const splitEventByQuarter = (startDate, endDate, amount, selectedYear) => {
    const result = [];

    const originalStart = new Date(startDate);

    const originalEnd = new Date(endDate);

    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear, 11, 31);

    const overlapStart = originalStart > yearStart ? originalStart : yearStart;
    const overlapEnd = originalEnd < yearEnd ? originalEnd : yearEnd;

    if (overlapStart > overlapEnd) return [];

    const totalDays = Math.round((originalEnd - originalStart) / msPerDay) + 1;

    let current = new Date(overlapStart);

    while (current <= overlapEnd) {
      let { start: quarterStart, end: quarterEnd } = getQuarterRange(current);

      // Clamp quarter to event range
      const periodStart = current > quarterStart ? current : quarterStart;
      const periodEnd = overlapEnd < quarterEnd ? overlapEnd : quarterEnd;

      const daysInPeriod = Math.round((periodEnd - periodStart) / msPerDay) + 1;

      const portion = (daysInPeriod / totalDays) * amount;

      // Push with the actual start of period (for accurate charting)
      result.push({ x: periodStart, y: portion });

      // Move to the next quarter
      current = new Date(periodEnd);
      current.setDate(current.getDate() + 1);
    }

    return result;
  };

  let chartPoints = [];

  returnEvents.forEach((event) => {
    const points = splitEventByQuarter(
      new Date(event.from_date),
      new Date(event.to_date),
      event.event_amount,
      selectedYear,
    );

    chartPoints = chartPoints.concat(points);
  });

  const aggregateByQuarter = (points, selectedYear) => {
    const quarters = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct
    const result = [];

    quarters.forEach((month) => {
      const quarterStart = new Date(selectedYear, month, 1);
      const quarterEnd = new Date(selectedYear, month + 3, 0);

      // sum all actual amounts that belong to this quarter
      const sum = points
        .filter((p) => p.x >= quarterStart && p.x <= quarterEnd)
        .reduce((acc, p) => acc + p.y, 0);
      result.push({ x: quarterStart, y: sum });
    });

    const yearEndTotal = points.reduce((acc, p) => acc + p.y, 0);
    result.push({ x: new Date(selectedYear, 11, 31), y: yearEndTotal });

    return result;
  };

  const actualPerQuarter = aggregateByQuarter(chartPoints, selectedYear);

  // Expected Return per Quarter for Char.js,

  const expectedQuarterReturn = (selectedYear) => {
    const amountInvested = investments?.invested_amount || 0;
    const prefReturn = investments?.perf_return || 0;

    const perfReturnPercent = prefReturn / 100;
    const quarterReturn = (amountInvested * perfReturnPercent) / 4;

    return [
      { x: new Date(selectedYear, 0, 1), y: quarterReturn }, // Q1
      { x: new Date(selectedYear, 3, 1), y: quarterReturn }, // Q2
      { x: new Date(selectedYear, 6, 1), y: quarterReturn }, // Q3
      { x: new Date(selectedYear, 9, 1), y: quarterReturn }, // Q4
    ];
  };


// function getQuarter(date){
//    const month = new Date(date).getMonth() + 1;
//    const year = new Date(date).getFullYear();
//
//    if(year === year ){
//        console.log()
//    }
//
//    if(month <= 3) return 'Q1';
//    if(month <= 6) return 'Q2';
//    if(month <= 9) return 'Q3';
//    return 'Q4';
//}
//
//
//
// function calculateActualReturn (events) {
//    const sum =
//      events?.reduce((result, e) => {
//        if (e.type === "Return") {
//          return result + Number(e.amount);
//        }
//        return result;
//      }, 0) || 0;
//
//    return Number(sum.toFixed(2));
//  };
