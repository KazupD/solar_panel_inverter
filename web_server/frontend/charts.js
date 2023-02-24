const ip_addr = '192.168.1.64';
const port = '8080';

let chartjson;

const slct = document.getElementById("timeperiods");
const btn1 = document.getElementById("general");
const btn2 = document.getElementById("data");
const btn3 = document.getElementById("stats");

window.onload = async function () {
    await update_charts(slct.value);
}

async function update_charts(hour) {
    chartjson = await fetch('http://'+String(ip_addr)+':'+String(port)+'/chartjson/' + String(hour)).then(res => res.json());
    
    let se_voltage_t = [];
    let sw_voltage_t = [];
    let se_current_t = [];
    let sw_current_t = [];
    let power_t = [];
    let se_power_t = [];
    let sw_power_t = [];
    for(let i = 0; i < chartjson.length; i++) {
        se_voltage_t.push({"x" : parseDate(chartjson[i].dt), "y" : chartjson[i].south_east_plant_voltage});
        sw_voltage_t.push({"x" : parseDate(chartjson[i].dt), "y" : chartjson[i].south_west_plant_voltage});
        se_current_t.push({"x" : parseDate(chartjson[i].dt), "y" : chartjson[i].south_east_plant_current});
        sw_current_t.push({"x" : parseDate(chartjson[i].dt), "y" : chartjson[i].south_west_plant_current});
        power_t.push({"x" : parseDate(chartjson[i].dt), "y" : chartjson[i].grid_connected_power});
        se_power_t.push({"x" : parseDate(chartjson[i].dt), "y" : Math.round(chartjson[i].south_east_plant_current*chartjson[i].south_east_plant_voltage)});
        sw_power_t.push({"x" : parseDate(chartjson[i].dt), "y" : Math.round(chartjson[i].south_west_plant_current*chartjson[i].south_west_plant_voltage)});
    }
    
    const chart2 = new CanvasJS.Chart("voltagebyplace", {
        animationEnabled: true,
        title: {
            text: "Voltage S-E/S-W [ V ]",
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisX: {
            valueFormatString: "D'th' hh:mm TT"
        },
        axisY2: {
            suffix: "V"
        },
        toolTip: {
            shared: true,
        },
        data: [{
            type: "line",
            axisYType: "secondary",
            name: "S-W",
            markerSize: 0,
            markerColor: "#1414AA",
            legendMarkerColor: "#1414AA",
            lineColor: "#1414AA",
            dataPoints: sw_voltage_t
        },
        {
            type:"line",
            axisYType: "secondary",
            name: "S-E",
            markerSize: 0,
            markerColor: "#AA1414",
            legendMarkerColor: "#AA1414",
            lineColor: "#AA1414",
            dataPoints: se_voltage_t
        },
       ]
    });
    const chart3 = new CanvasJS.Chart("currentbyplace", {
        animationEnabled: true,
        title: {
            text: "Current S-E/S-W [ A ]",
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisX: {
            valueFormatString: "D'th' hh:mm TT"
        },
        axisY2: {
            suffix: "A"
        },
        toolTip: {
            shared: true
        },
        data: [{
            type: "line",
            axisYType: "secondary",
            name: "S-W",
            markerSize: 0,
            markerColor: "#1414AA",
            legendMarkerColor: "#1414AA",
            lineColor: "#1414AA",
            dataPoints: sw_current_t
        },
        {
            type:"line",
            axisYType: "secondary",
            name: "S-E",
            markerSize: 0,
            markerColor: "#AA1414",
            legendMarkerColor: "#AA1414",
            lineColor: "#AA1414",
            dataPoints: se_current_t
        },
       ]
    });
    const chart1 = new CanvasJS.Chart("power", {
        animationEnabled: true,
        title: {
            text: "Power [ W ]",
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisX: {
            valueFormatString: "D'th' hh:mm TT"
        },
        axisY2: {
            suffix: "W"
        },
        toolTip: {
            shared: true,
        },
        data: [{
            type: "line",
            axisYType: "secondary",
            name: "Power",
            markerSize: 0,
            markerColor: "#14AA14",
            legendMarkerColor: "#14AA14",
            lineColor: "#1414AA",
            dataPoints: power_t
        }
       ]
    });
    const chart4 = new CanvasJS.Chart("powerbyplace", {
        animationEnabled: true,
        title: {
            text: "Power S-E/S-W [ W ]",
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisX: {
            valueFormatString: "D'th' hh:mm TT"
        },
        axisY2: {
            suffix: "W"
        },
        toolTip: {
            shared: true
        },
        data: [{
            type: "line",
            axisYType: "secondary",
            name: "S-W",
            markerSize: 0,
            markerColor: "#1414AA",
            legendMarkerColor: "#1414AA",
            lineColor: "#1414AA",
            dataPoints: sw_power_t
        },
        {
            type:"line",
            axisYType: "secondary",
            name: "S-E",
            markerSize: 0,
            markerColor: "#AA1414",
            legendMarkerColor: "#AA1414",
            lineColor: "#AA1414",
            dataPoints: se_power_t
        },
       ]
    });
    chart1.render();
    chart2.render();
    chart3.render();
    chart4.render();
}

function parseDate(str_date) {
    let dt = new Date(Date.parse(str_date));
    dt.setHours(dt.getHours());
    return dt;
}

btn1.addEventListener('click',function ()
{
    location.assign('http://'+String(ip_addr)+':'+String(port)+'/');
});

btn2.addEventListener('click',function ()
{
    location.assign('http://'+String(ip_addr)+':'+String(port)+'/data');
});

btn3.addEventListener('click',function ()
{
    location.assign('http://'+String(ip_addr)+':'+String(port)+'/statistics');
});

slct.addEventListener('change', function() {
    update_charts(this.value);
});