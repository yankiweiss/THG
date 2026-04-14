const actualReturns = (events) => {
 return events?.map((event) =>  ({
    y : event.event_amount, x: event.to_date
}))
}

export default actualReturns;