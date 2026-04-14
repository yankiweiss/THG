import { eachQuarterOfInterval } from "date-fns";

const actualReturns = (events) => {
  const result = events?.map((event) => {
    return eachQuarterOfInterval({
      start: new Date(event.from_date),
      end : new Date(event.to_date)
    })
  })

  console.log(result)
}

export default actualReturns;
