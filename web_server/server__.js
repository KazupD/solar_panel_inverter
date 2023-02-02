const express = require('express');
const path = require('path');
const mysql = require('mysql');

const db = mysql.createConnection({
  host:'localhost',
  user:'pi',
  password:'raspberry',
  database:'solar_panel_inverter'
});

db.connect((err)=>{
  if(err){
    throw err;
  }
  console.log('MySQL Connected');
})

const app = express();
const port = process.env.PORT || 8080;
app.use(express.static(__dirname));

const record_num = 20;
const sql_query_conti = "SELECT south_east_plant_voltage, south_east_plant_current, south_west_plant_voltage, south_west_plant_current, grid_connected_power, dt FROM inverter_data WHERE id>(SELECT max(id) FROM inverter_data)-"+record_num+";";
const sql_query_moment = "SELECT total_generated, total_running_time, today_generated, today_running_time, dt FROM inverter_data WHERE id=(SELECT max(id) FROM inverter_data);";


app.get('/inverter_conti', (req, res) => {
    let record_num = "10"
    db.query(sql_query_conti,
    (err, result)=>{
      if(err) throw err;
      console.log(result)
      res.json(result);
    });
});

app.get('/inverter_moment', (req, res) => {
    db.query(sql_query_moment,
    (err, result)=>{
      if(err) throw err;
      console.log(result)
      res.json(result);
    });
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './frontend.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);