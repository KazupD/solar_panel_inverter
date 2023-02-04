const express = require('express');
const path = require('path');
const moment = require('moment')
const {Sequelize, DataTypes, Op} = require('sequelize');

const Conn = new Sequelize('solar_panel_inverter', 'pi', 'raspberry', {host:'localhost', dialect:'mysql'});

Conn.authenticate().then(() => {
    console.log('MySQL connected.');
}).catch((error) => {
    connsole.error('Unable to connect MySQL: ', error);
});

const inverter_data = require("./models/inverter_data.js")(Conn, DataTypes);

const app = express();
const port = process.env.PORT || 8080;
app.use(express.static(__dirname));
app.use(express.static(__dirname+"/frontend"));

app.get('/generaljson', async (req, res) => {
    try{
        const maxid = await inverter_data.max('id');
        const last_row = await inverter_data.findAll({
            attributes: ['total_generated',
                        'total_running_time',
                        'today_generated',
                        'today_running_time',
                        'grid_connected_power',
                        'dt'],
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
            attributes: ['south_east_plant_voltage',
                        'south_east_plant_current',
                        'south_west_plant_voltage',
                        'south_west_plant_current',
                        'grid_connected_power',
                        'grid_connected_frequency',
                        'line1_voltage',
                        'line1_current',
                        'line2_voltage',
                        'line2_current',
                        'line3_voltage',
                        'line3_current'],
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
        const now_local = moment().local();
        const then_local = now_local.subtract(Number(req.params.hr)-1, 'hours').toDate();
        const rows = await inverter_data.findAll({
            attributes: ['south_east_plant_voltage',
                        'south_east_plant_current',
                        'south_west_plant_voltage',
                        'south_west_plant_current',
                        'grid_connected_power',
                        'grid_connected_frequency',
                        'line1_voltage',
                        'line1_current',
                        'line2_voltage',
                        'line2_current',
                        'line3_voltage',
                        'line3_current',
                        'dt'],
            where: { dt: { [Op.gt]: then_local }, },
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

app.listen(port);
console.log('Server started at http://localhost:' + port);