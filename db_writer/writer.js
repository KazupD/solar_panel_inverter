const fetch = require('node-fetch');
const path = require('path');
const {Sequelize, DataTypes} = require('sequelize');

const SAJURL = 'http://192.168.1.67/status/status.php';

const Conn = new Sequelize('solar_panel_inverter', 'pi', 'raspberry', {host:'localhost', dialect:'mysql'});

Conn.authenticate().then(() => {
    console.log('MySQL connected.');
}).catch((error) => {
    connsole.error('Unable to connect MySQL: ', error);
});

const inverter_data = require("./models/inverter_data.js")(Conn, DataTypes);

async function get_data(){
    try{
        const response = await fetch(SAJURL);
        const response_text = await response.text();
        const response_list = response_text.split(',').map(Number);
        return {
            "total_generated": response_list[1]*0.01,
            "total_running_time": response_list[2]*0.1,
            "today_generated": response_list[3]*0.01,
            "today_running_time": response_list[4]*0.1,
            "south_east_plant_voltage": response_list[5]*0.1,
            "south_east_plant_current": response_list[6]*0.01,
            "south_west_plant_voltage": response_list[7]*0.1,
            "south_west_plant_current": response_list[8]*0.01,
            "grid_connected_power": response_list[23],
            "grid_connected_frequency": response_list[24]*0.01,
            "line1_voltage": response_list[25]*0.1,
            "line2_voltage": response_list[27]*0.1,
            "line3_voltage": response_list[29]*0.1,
            "line1_current": response_list[26]*0.01,
            "line2_current": response_list[28]*0.01,
            "line3_current": response_list[30]*0.01
        }
    } catch (error) {
        return undefined;
    }
}

async function get_last_row(){
    try{
        const maxid = await inverter_data.max('id');
        const last_row = await inverter_data.findAll({
            where: {
                id: maxid
            },
            raw: true
        })
        return last_row[0];
    } catch (error) {
        return undefined;
    }
}

async function insert_new_row(_json_){
    const new_data = await get_data();
    const hour = what_hour();
    if(new_data===undefined){
        if(hour < 12){

        } else {

        }
    } else {

    }
}

function what_hour(){
    let now = new Date();
    return now.getHours();
}

(async () => {
    //let received_inverter_data = await get_data();
    //console.log(received_inverter_data);
    //console.log(what_hour());

    let last_row = await get_last_row();
    console.log(last_row);

    Conn.close();
})()