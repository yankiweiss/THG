import dataBasePool from "../model/db.js";

const postAEvent = async (req, res) => {
  const {
    event_date,
    event_type,
    event_amount,
    notes,
    propertyId,
    investorId,
  } = req.body;

  const selectInvestmentID = await dataBasePool.query(
    `
      SELECT id
FROM investments
WHERE investor_id = $1 AND property_id = $2;`,
    [investorId,
    propertyId]
  );

  const investmentID = selectInvestmentID.rows[0].id;

  const postEvent = `
  INSERT INTO events (event_date, event_type, event_amount, notes, investment_id) VALUES($1, $2, $3, $4, $5)
  RETURNING *`;

  const results = await dataBasePool.query(postEvent, [
    event_date,
    event_type,
    event_amount,
    notes,
    investmentID,
  ]);

  res.json({ event: results.rows[0] });
};

export default postAEvent;
