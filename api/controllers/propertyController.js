import express from "express";
import dataBasePool from "../model/db.js";

const postAProperty = async (req, res) => {
  const { property_name, purchase_price, investor_name,  } = req.body;

  const client = await dataBasePool.connect()

  try {
    await client.query('BEGIN');

    const putInPropertyTable = `
  INSERT INTO properties(property_name, purchase_price )
  VALUES($1, $2 ) RETURNING id`;

  const propertyResult = await client.query(putInPropertyTable, [
    property_name, purchase_price,
  ])

  const propertyID = propertyResult.rows[0].id;

  const putInInvestorTable = `
 INSERT INTO investor (investor_name, property_id)
 VALUES($1, $2)`;

 await client.query(putInInvestorTable, [
    investor_name, propertyID
 ])

 await client.query('COMMIT')
  } catch (error) {
    
  }

};

export { postAProperty };
