const getReturnEvents = (events = []) => {
  return events?.filter((e) => e.event_type === 'Return')
}


export const calculateQuarterlyReturns = (events, selectedYear) => {

  const returnEvents = getReturnEvents(events);

  let chartPoints = [];

  returnEvents.forEach((event) => {
    const points = splitEventByQuarter(
      event.from_date,
      event.to_date,
      Number(event.event_amount),
      selectedYear
    )

    chartPoints =  chartPoints.concat(points)
  })
  

  return aggregateByQuarter(chartPoints, selectedYear)
}


const msPerDay = 1000 * 60 * 60 * 24;  
  
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

      const portion = (daysInPeriod / totalDays) * Number(amount);

      // Push with the actual start of period (for accurate charting)
      result.push({ x: periodStart, y: portion });

      // Move to the next quarter
      current = new Date(periodEnd);
      current.setDate(current.getDate() + 1);
    }

    return result;
  };

  

  const aggregateByQuarter = (points, selectedYear) => {
    const quarters = [0, 3, 6, 9]; // Jan, Apr, Jul, Oct
    const result = [];

    quarters.forEach((month) => {
      const quarterStart = new Date(selectedYear, month, 1);
      const quarterEnd = new Date(selectedYear, month + 3, 0);

      // sum all actual amounts that belong to this quarter
      const sum = points
        .filter((p) => p.x >= quarterStart && p.x <= quarterEnd)
        .reduce((acc, p) => acc + Number(p.y), 0);
      result.push({ x: quarterStart, y: sum });
    });

    const yearEndTotal = points.reduce((acc, p) => acc + p.y, 0);
    result.push({ x: new Date(selectedYear, 11, 31), y: yearEndTotal });

    return result;
  };

  export const expectedQuarterReturn = (selectedYear, investedAmount , prefReturn) => {
    const amountInvested = investedAmount || 0;
    const percent = prefReturn || 0;

    const perfReturnPercent = percent / 100;
    const quarterReturn = (amountInvested * perfReturnPercent) / 4;

    return [
      { x: new Date(selectedYear, 0, 1), y: quarterReturn }, // Q1
      { x: new Date(selectedYear, 3, 1), y: quarterReturn }, // Q2
      { x: new Date(selectedYear, 6, 1), y: quarterReturn }, // Q3
      { x: new Date(selectedYear, 9, 1), y: quarterReturn }, // Q4
    ];
  };


  

  


