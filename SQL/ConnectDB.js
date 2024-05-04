const express = require('express');
const db = require('./DB');

const app = express();

app.get('/:bonds', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const bonds = req.params.bonds;
  
  try {
    const result = await db.query(`
      SELECT public."${bonds}"."Símbolo",
             public."${bonds}"."Fecha",
             public."${bonds}"."Apertura",
             public."${bonds}"."Máximo",
             public."${bonds}"."Mínimo",
             public."${bonds}"."Cierre",
             public."${bonds}"."Monto Negociado"
      FROM "${bonds}"
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3003, () => {
  console.log('Server is running on port 3003');
});
