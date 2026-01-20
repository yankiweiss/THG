import dataBasePool from "../model/db.js";

const postAEvent = async (req, res) => {
  const { event_date, event_type, event_amount, investor_id } = req.body;

  const postEvent = `
  INSERT INTO events (event_date,event_type, event_type, investor_id) VALUES($1, $2, $3, $4)`

  await dataBasePool.query(postEvent, [event_date, event_type, event_amount, investor_id])


};

export default postAEvent
