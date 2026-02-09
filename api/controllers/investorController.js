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

    try {
        const investorResult = await dataBasePool.query(
    `SELECT * FROM investor WHERE id = $1`,
    [investorID],
        )
        

        if(investorResult.rows.length === 0){
            return res.status(404).json({message: 'no investor was found!'})
        };

        const eventsResults = await dataBasePool.query(
             `SELECT * FROM events WHERE investor_id = $1`,
             [investorID]
        )

        res.json({
            investor : investorResult.rows[0],
            events: eventsResults.rows,
        })
    } catch (err) {
        console.error(err);
    res.status(500).json({ message: "Server error" });
        
    }

   
  
}


export {
    postAInvestor, getInvestorByID
}