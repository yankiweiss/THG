import dataBasePool from "../model/db.js";

const postAProperty = async (req, res) => {
  const { property_name, purchase_price, syndicator,  pictures } = req.body;

  const client = await dataBasePool.connect();

  try {
    await client.query("BEGIN");

    const putInPropertyTable = `
  INSERT INTO properties(property_name, purchase_price, secure_url )
  VALUES($1, $2, $3) RETURNING id`;

    const propertyResult = await client.query(putInPropertyTable, [
      property_name,
      purchase_price,
      pictures,
    ]);

    const propertyID = propertyResult.rows[0].id;

    const putInInvestorTable = `
 INSERT INTO investor (investor_name, property_id)
 VALUES($1, $2)`;

    for (let investor of syndicator) {
      await client.query(putInInvestorTable, [
        investor.investor_name,
        propertyID,
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

  const investorIDs = investorResult.rows.map(inv => inv.id);

  let eventsResult = {rows: []}

  if(investorIDs.length > 0){
    eventsResult = await dataBasePool.query(
        `SELECT * FROM events WHERE investor_id = ANY($1)`,[investorIDs]
    )
  }

  res.json({ ...propertyResult.rows[0], investors: investorResult.rows, events: eventsResult.rows });
};

export { postAProperty, getAllProperties, getPropertyById };
