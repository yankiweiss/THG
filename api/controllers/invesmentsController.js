import dataBasePool from "../model/db.js";


const getAllInvestments = async (req, res) => {

    try {

        const getAllInvestmentsDB = `
   SELECT
  investments.id AS investment_id,
  investments.property_id,
  investments.investor_id,

  properties.property_name AS property_name,
  investors.name AS investor_name,

  COALESCE(
    json_agg(
      json_build_object(
        'id', events.id,
        'type', events.event_type,
        'amount', events.event_amount,
        'date', events.event_date
      )
    ) FILTER (WHERE events.id IS NOT NULL),
    '[]'
  ) AS events

FROM investments

JOIN properties
  ON investments.property_id = properties.id

JOIN investors
  ON investments.investor_id = investors.id

LEFT JOIN events
  ON events.investment_id = investment_id

GROUP BY
  investments.id,
  properties.property_name,
  investors.name;`

  const result = await dataBasePool.query(getAllInvestmentsDB);
  res.json(result.rows);
        
    } catch (error) {
      console.log(error)  
    }
  

  
};


 

export {
getAllInvestments
}