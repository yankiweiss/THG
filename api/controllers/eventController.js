import dataBasePool from "../model/db.js";

const postAEvent = async (req, res) => {
  const { event_date, event_type, event_amount, investor_id, notes } = req.body;

  const postEvent = `
  INSERT INTO events (event_date,event_type, event_amount, investor_id, notes) VALUES($1, $2, $3, $4, $5)`

  await dataBasePool.query(postEvent, [event_date, event_type, event_amount, investor_id, notes])


};

export default postAEvent
