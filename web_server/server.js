const express = require('express');
const path = require('path');
const moment = require('moment')
const bodyparser = require('body-parser')
const {Sequelize, DataTypes, Op} = require('sequelize');

const mysql_ip = '172.17.0.2';

// CONNECT TO DATABASE
const Conn = new Sequelize('solar_panel_inverter', 'root', 'raspberry',
                {host:mysql_ip, dialect:'mysql',
                typeCast: function (field, next) {
                    if (field.type === 'DATETIME') {return field.string();}
                    return next();},
                  timezone: '+01:00'});
try { Conn.authenticate()} catch(error) { console.error("Unable to connect MySQL")}
const inverter_data = require("./models/inverter_data.js")(Conn, DataTypes);

// INITIALIZE EXPRESS
const app = express();
const port = process.env.PORT || 8080;
app.use(express.static(__dirname));
app.use(express.static(__dirname+"/frontend"));
app.use(bodyparser.urlencoded({ extended: false }))

// UTIL FUNCTIONS
async function get_last_row(){
    try{
        const maxid = await inverter_data.max('id');
        const last_row = await inverter_data.findAll({
            attributes: ['total_generated','total_running_time','today_generated',
                        'today_running_time','south_east_plant_voltage','south_east_plant_current',
                        'south_west_plant_voltage','south_west_plant_current','grid_connected_power',
                        'grid_connected_frequency','line1_voltage','line1_current',
                        'line2_voltage','line2_current','line3_voltage','line3_current'],
            where: { id: maxid },
            raw: true
        })
        return last_row[0];
    } catch (error) {
        console.log(error);
        return {'total_generated':0,'total_running_time':0,'today_generated':0,'today_running_time':0,
                'south_east_plant_voltage':0,'south_east_plant_current':0,'south_west_plant_voltage':0,
                'south_west_plant_current':0,'grid_connected_power':0,'grid_connected_frequency':0,
                'line1_voltage':0,'line1_current':0,'line2_voltage':0,'line2_current':0,'line3_voltage':0,'line3_current':0};
    }
}
// END OF UTIL FUNCTIONS

// WRITE TO DATABASE --- POST REQUESTS
app.post('/postinverterdata', async (req, res) => {
    let response = "OK";
    switch(req.body.inverterstate){
        case "ON":
            console.log("---INVERTER IS ON---");
            try{
                await inverter_data.create({
                    "total_generated": req.body.total_generated,"total_running_time": req.body.total_running_time,
                    "today_generated": req.body.today_generated,"today_running_time": req.body.today_running_time,
                    "south_east_plant_voltage": req.body.south_east_plant_voltage,"south_east_plant_current": req.body.south_east_plant_current,
                    "south_west_plant_voltage": req.body.south_west_plant_voltage,"south_west_plant_current": req.body.south_west_plant_current,
                    "grid_connected_power": req.body.grid_connected_power,"grid_connected_frequency": req.body.grid_connected_frequency,
                    "line1_voltage": req.body.line1_voltage,"line2_voltage": req.body.line2_voltage,
                    "line3_voltage": req.body.line3_voltage,"line1_current": req.body.line1_current,
                    "line2_current": req.body.line2_current,"line3_current": req.body.line3_current});
                console.log("INSERTED SUCCESSFULLY");}
            catch(error){
                console.log(error);
                response = "ERROR";
            }
            break;
        case "OFF_BEFORE_SUNRISE":
            console.log("---INVERTER IS OFF, BEFORE SUNRISE---");
            let last_row_am = await get_last_row();
            try{
                await inverter_data.create({
                    "total_generated": last_row_am.total_generated,"total_running_time": last_row_am.total_running_time,
                    "today_generated": 0,"today_running_time": 0,
                    "south_east_plant_voltage": 0,"south_east_plant_current": 0,
                    "south_west_plant_voltage": 0,"south_west_plant_current": 0,
                    "grid_connected_power": 0,"grid_connected_frequency": 0,
                    "line1_voltage": 0,"line2_voltage": 0,
                    "line3_voltage": 0,"line1_current": 0,
                    "line2_current": 0,"line3_current": 0});
                console.log("INSERTED SUCCESSFULLY");}
            catch(error){
                console.log(error);
                response = "ERROR";
            }
            break;
        case "OFF_AFTER_SUNSET":
            console.log("---INVERTER IS OFF, AFTER SUNSET---");
            let last_row_pm = await get_last_row();
            try{
                await inverter_data.create({
                    "total_generated": last_row_pm.total_generated,"total_running_time": last_row_pm.total_running_time,
                    "today_generated": last_row_pm.today_generated,"today_running_time": last_row_pm.today_running_time,
                    "south_east_plant_voltage": 0,"south_east_plant_current": 0,
                    "south_west_plant_voltage": 0,"south_west_plant_current": 0,
                    "grid_connected_power": 0,"grid_connected_frequency": 0,
                    "line1_voltage": 0,"line2_voltage": 0,
                    "line3_voltage": 0,"line1_current": 0,
                    "line2_current": 0,"line3_current": 0});
                console.log("INSERTED SUCCESSFULLY");}
            catch(error){
                console.log(error);
                response = "ERROR";
            }
            break;
        default:
            console.log("Unhandled inverter state");
            response = "ERROR";
    }
    res.send(response);
});
// END OF POST REQUESTS

// CLIENT REQUESTING FOR DATA --- GET REQUESTS
app.get('/generaljson', async (req, res) => {
    try{
        const maxid = await inverter_data.max('id');
        const last_row = await inverter_data.findAll({
            attributes: ['total_generated','total_running_time','today_generated',
                        'today_running_time','grid_connected_power','dt'],
            where: { id: maxid },
            raw: true
        });
        res.send(last_row);
    } catch (error) {
        console.log(error);
        res.send(undefined);
    }
});

app.get('/datajson', async (req, res) => {
    try{
        const maxid = await inverter_data.max('id');
        const last_row = await inverter_data.findAll({
            attributes: ['south_east_plant_voltage','south_east_plant_current','south_west_plant_voltage',
                        'south_west_plant_current','grid_connected_power','grid_connected_frequency',
                        'line1_voltage','line1_current','line2_voltage',
                        'line2_current','line3_voltage','line3_current'],
            where: { id: maxid },
            raw: true
        });
        res.send(last_row);
    } catch (error) {
        console.log(error);
        res.send(undefined);
    }
});

app.get('/chartjson/:hr', async (req, res) => {
    try{
        const now_local = moment();
        console.log(now_local)
        const then_local = now_local.subtract(Number(req.params.hr), 'hours').startOf('hour').toDate();
        const rows = await inverter_data.findAll({
            attributes: ['south_east_plant_voltage','south_east_plant_current','south_west_plant_voltage',
                        'south_west_plant_current','grid_connected_power','grid_connected_frequency',
                        'line1_voltage','line1_current','line2_voltage',
                        'line2_current','line3_voltage','line3_current','dt'],
            where: { dt: { [Op.gt]: then_local }, },
            raw: true
        });
        res.send(rows);
    } catch (error) {
        console.log(error);
        res.send(undefined);
    }
});


app.get('/statisticsjson/:day', async (req, res) => {
    try{
        const now_local = moment();
        console.log(now_local)
        const then_local = now_local.subtract(Number(req.params.day), 'days').startOf('day').toDate();
        const rows = await inverter_data.findAll({
            attributes: [[Sequelize.fn('MAX', Sequelize.col('today_generated')), 'max_today_generated'],
                        [Sequelize.fn('MAX', Sequelize.col('today_running_time')), 'max_today_running_time'],
                        [Sequelize.fn('MAX', Sequelize.col('grid_connected_power')), 'max_grid_connected_power'],
                        [Sequelize.fn("DAY", Sequelize.col("dt")), "day"],
                        [Sequelize.fn("MONTH", Sequelize.col("dt")), "month"],
                        [Sequelize.fn("YEAR", Sequelize.col("dt")), "year"]],
            where: { dt: { [Op.gt]: then_local}, },
            group: ['year', 'month', 'day'],
            raw: true
        });
        res.send(rows);
    } catch (error) {
        console.log(error);
        res.send(undefined);
    }
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './frontend/general.html'));
});

app.get('/data', function(req, res) {
    res.sendFile(path.join(__dirname, './frontend/moredata.html'));
});

app.get('/chart', function(req, res) {
    res.sendFile(path.join(__dirname, './frontend/charts.html'));
});

app.get('/statistics', function(req, res) {
    res.sendFile(path.join(__dirname, './frontend/statistics.html'));
});
// END OF GET REQUESTS

// LAUNCH APP
app.listen(port);
console.log('Server started at http://localhost:' + port);