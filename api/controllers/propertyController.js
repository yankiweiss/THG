import dataBasePool from "../model/db.js";

const postAProperty = async (req, res) => {
  const { property_name, purchase_price, syndicator, pictures, closing_date } =
    req.body;

  const client = await dataBasePool.connect();

  try {
    await client.query("BEGIN");

    const putInPropertyTable = `
  INSERT INTO properties(property_name, purchase_price, secure_url, closing_date )
  VALUES($1, $2, $3, $4) RETURNING id`;

    const propertyResult = await client.query(putInPropertyTable, [
      property_name,
      purchase_price,
      pictures,
      closing_date,
    ]);

    const propertyID = propertyResult.rows[0].id;

    const putInInvestorTable = `
 INSERT INTO investor (investor_name, property_id, invested_amount, pref_return)
 VALUES($1, $2, $3, $4)`;

    for (let investor of syndicator) {
      await client.query(putInInvestorTable, [
        investor.investor_name,
        propertyID,
        investor.invested_amount,
        investor.pref_return,
      ]);
    }

    await client.query("COMMIT");
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
};

const getAllProperties = async (req, res) => {
  const getAllPropertiesDB = `
    SELECT * FROM properties`;

  const result = await dataBasePool.query(getAllPropertiesDB);

  res.json(result.rows);
};

const getPropertyById = async (req, res) => {
  const { id } = req.params;

  const propertyResult = await dataBasePool.query(
    `SELECT * FROM properties WHERE id = $1`,
    [id],
  );

  const investorResult = await dataBasePool.query(
    `SELECT * FROM investor WHERE property_id = $1`,
    [id],
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
    ...propertyResult.rows[0],
    investors: investorResult.rows,
    events: eventsResult.rows,
  });
};

const deleteProperty = async (req, res) => {

    try{
    const {id } = req.params;

  const result = await dataBasePool.query(
     `DELETE FROM properties WHERE id = $1 RETURNING *`,
      [id]
  );

  res.json({
      message: "Property deleted successfully",
      data: result.rows,
    });

     } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


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





export { postAProperty, getAllProperties, getPropertyById, deleteProperty, postAInvestor };
