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
    const {investorID } = req.params;

    const investorResult = await dataBasePool.query(
    `SELECT * FROM investor WHERE id = $1`,
    [investorID],
  );

  const investorIDs = investorResult.rows.map((inv) => inv.id);

  let eventsResult = { rows: [] };

  if (investorIDs.length > 0) {
    eventsResult = await dataBasePool.query(
      `SELECT * FROM events WHERE investor_id = ANY($1)`,
      [investorIDs],
    );
  }

  res.json({
    
    ...investorResult.rows[0],
    events: eventsResult.rows,
  });
};




export {
    postAInvestor, getInvestorByID
}