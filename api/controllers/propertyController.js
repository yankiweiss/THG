import dataBasePool from "../model/db.js";

const postAProperty = async (req, res) => {
  const { property_name, purchase_price, investors, pictures, closing_date } =
    req.body;

  const client = await dataBasePool.connect();

  try {
    await client.query("BEGIN");

    const propertyResult  =  await client.query (`
  INSERT INTO properties(property_name, purchase_price, secure_url, closing_date )
  VALUES($1, $2, $3, $4) RETURNING id`, [
      property_name,
      purchase_price,
      pictures,
      closing_date,
    ] );

    

    for (const entry of investors ) {
        const {
            investor_name,
            invested_amount,
            perf_return,
            role,

        } = entry;
    
    
        const investorResult = await client.query (
            `INSERT INTO investors (name)
            VALUES ($1)
            ON CONFLICT (name)
            DO UPDATE SET name = EXCLUDED.name
            RETURNING id`, [investor_name]
        )
 

    const propertyID = propertyResult.rows[0].id;

    const investorID = investorResult.rows[0].id;

    await client.query(
        `INSERT INTO investments (
         investor_id,
          property_id,
          role,
          invested_amount,
          perf_return)  VALUES ($1, $2, $3, $4, $5)`, [
          investorID,
          propertyID,
          role,
          invested_amount,
          perf_return,
        ]
    )
}

  
    await client.query("COMMIT");

    res.status(201).json({
      message: "Property created successfully",
      property_id: propertyId,
    });
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
  try {
    const { id } = req.params;

    const result = await dataBasePool.query(
      `DELETE FROM properties WHERE id = $1 RETURNING *`,
      [id],
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





export {
  postAProperty,
  getAllProperties,
  getPropertyById,
  deleteProperty,
};
