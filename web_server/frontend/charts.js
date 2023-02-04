let chartjson;

const slct = document.getElementById("timeperiods");
const btn1 = document.getElementById("general");
const btn2 = document.getElementById("data");

window.onload = async function () {
    await update_charts(slct.value);
}

async function update_charts(hour) {
    chartjson = await fetch('http://192.168.1.70:8080/chartjson/' + String(hour)).then(res => res.json());
    
    let se_voltage_t = [];
    let sw_voltage_t = [];
    let se_current_t = [];
    let sw_current_t = [];
    for(let i = 0; i < chartjson.length; i++) {
        se_voltage_t.push({"x" : parseDate(chartjson[i].dt), "y" : chartjson[i].south_east_plant_voltage});
        sw_voltage_t.push({"x" : parseDate(chartjson[i].dt), "y" : chartjson[i].south_west_plant_voltage});
        se_current_t.push({"x" : parseDate(chartjson[i].dt), "y" : chartjson[i].south_east_plant_current});
        sw_current_t.push({"x" : parseDate(chartjson[i].dt), "y" : chartjson[i].south_west_plant_current});
    }
    
    const chart1 = new CanvasJS.Chart("voltagebyplace", {
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
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
        },
        data: [{
            type: "line",
            axisYType: "secondary",
            name: "S-W",
            showInLegend: true,
            markerSize: 0,
            yValueFormatString: "###V",
            legendMarkerColor: "#1414AA",
            lineColor: "#1414AA",
            dataPoints: sw_voltage_t
        },
        {
            type:"line",
            axisYType: "secondary",
            name: "S-E",
            showInLegend: true,
            markerSize: 0,
            yValueFormatString: "###V",
            legendMarkerColor: "#AA1414",
            lineColor: "#AA1414",
            dataPoints: se_voltage_t
        },
       ]
    });
    const chart2 = new CanvasJS.Chart("currentbyplace", {
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
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: true,
        },
        data: [{
            type: "line",
            axisYType: "secondary",
            name: "S-W",
            showInLegend: true,
            markerSize: 0,
            yValueFormatString: "###A",
            legendMarkerColor: "#1414AA",
            lineColor: "#1414AA",
            dataPoints: sw_current_t
        },
        {
            type:"line",
            axisYType: "secondary",
            name: "S-E",
            showInLegend: true,
            markerSize: 0,
            yValueFormatString: "###A",
            legendMarkerColor: "#AA1414",
            lineColor: "#AA1414",
            dataPoints: se_current_t
        },
       ]
    });
    chart1.render();
    chart2.render();
}

function parseDate(str_date) {
    return new Date(Date.parse(str_date));
}

btn1.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/');
});

btn2.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/data');
});

slct.addEventListener('change', function() {
    update_charts(this.value);
});