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
    // 1️⃣ Get investor info
    const investorResult = await dataBasePool.query(
      `SELECT * FROM investors WHERE id = $1`,
      [investorId]
    );
    if (investorResult.rows.length === 0) {
      return res.status(404).json({ message: 'Investor not found!' });
    }
    const investor = investorResult.rows[0];

    // 2️⃣ Get all investments for this investor for this property
    const investmentsResult = await dataBasePool.query(
      `SELECT * FROM investments WHERE investor_id = $1 AND property_id = $2`,
      [investorId, propertyId]
    );

    const investments = investmentsResult.rows;

    // 3️⃣ Get all events linked to each investment
    // Map each investment to its events
    const investmentIds = investments.map(inv => inv.id);
    let events = [];
    if (investmentIds.length > 0) {
      const eventsResult = await dataBasePool.query(
        `SELECT * FROM events WHERE investment_id = ANY($1::int[])`,
        [investmentIds]
      );
      events = eventsResult.rows;
    }

    // Attach events to corresponding investment
   

    // 4️⃣ Get property info
    const propertyResult = await dataBasePool.query(
      `SELECT * FROM properties WHERE id = $1`,
      [propertyId]
    );
    const property = propertyResult.rows[0] || null;

    // 5️⃣ Return combined data
    res.json({
      ...investor,
      ...property,
      investments : investments,
      events
      
    });
    

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
   
  



export {
    postAInvestor, getInvestorByID
}