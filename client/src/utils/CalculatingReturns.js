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
