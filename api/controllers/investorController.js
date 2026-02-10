import dataBasePool from "../model/db.js";

const postAInvestor = async (req, res) => {
  const { investor_name, invested_amount, pref_return, property_id } = req.body;

  const postInvestor = `
  INSERT INTO investor (investor_name, invested_amount, pref_return, property_id) VALUES($1, $2, $3, $4)
  RETURNING *`;

  const results = await dataBasePool.query(postInvestor, [
    investor_name,
    invested_amount,
    pref_return,
    property_id,
  ]);

  res.json({ investor: results.rows[0] });
};

const getInvestorByID = async (req, res) => {
  const { propertyId, investorId } = req.params;

  try {
    // Investor info
    const investorResult = await dataBasePool.query(
      `SELECT * FROM investor WHERE id = $1 AND property_id = $2`,
      [investorId, propertyId]
    );

    if (investorResult.rows.length === 0) {
      return res.status(404).json({ message: 'No investor found for this property!' });
    }

    const investor = investorResult.rows[0];

    // Investments for this investor
    const investmentsResult = await dataBasePool.query(
      `SELECT * FROM investments WHERE investor_id = $1 AND property_id = $2 ORDER BY investment_date ASC`,
      [investorId, propertyId]
    );

    // Optional: events (if you still track them separately)
    const eventsResult = await dataBasePool.query(
      `SELECT * FROM events WHERE investor_id = $1 AND property_id = $2 ORDER BY event_date ASC`,
      [investorId, propertyId]
    );

    // Property info
    const propertyResult = await dataBasePool.query(
      `SELECT * FROM properties WHERE id = $1`,
      [propertyId]
    );
    const property = propertyResult.rows[0] || null;

    // Return combined data
    res.json({
      ...investor,
      property,
      investments: investmentsResult.rows,
      events: eventsResult.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
   
  



export {
    postAInvestor, getInvestorByID
}