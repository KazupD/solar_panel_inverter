const ip_addr = '192.168.1.64';
const port = '8080';

let statisticsjson;

const slct = document.getElementById("timeperiods");
const btn1 = document.getElementById("general");
const btn2 = document.getElementById("data");
const btn3 = document.getElementById("charts");

window.onload = async function () {
    await update_charts(slct.value);
}

async function update_charts(days) {
    statisticsjson = await fetch('http://'+String(ip_addr)+':'+String(port)+'/statisticsjson/' + String(days)).then(res => res.json());
    
    let generated = [];
    let runningtime = [];
    let maxpower = [];
    let generated_sum = 0;
    let runningtime_sum = 0;
    for(let i = 0; i < statisticsjson.length; i++) {
        generated.push({"label" : String(statisticsjson[i].month)+". "+String(statisticsjson[i].day)+".", "y" : statisticsjson[i].max_today_generated});
        runningtime.push({"label" : String(statisticsjson[i].month)+". "+String(statisticsjson[i].day)+".", "y" : statisticsjson[i].max_today_running_time});
        maxpower.push({"label" : String(statisticsjson[i].month)+". "+String(statisticsjson[i].day)+".", "y" : statisticsjson[i].max_grid_connected_power});
        generated_sum = generated_sum + statisticsjson[i].max_today_generated;
        runningtime_sum = runningtime_sum + statisticsjson[i].max_today_running_time;
    }

    const chart1 = new CanvasJS.Chart("generated", {
        animationEnabled: true,
        title:{
            text: "Generated: " + String(Math.round(generated_sum)) + " [kWh]",
            fontFamily: "Arial",
            fontSize: 25,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisY: {
            title: "Energy [kWh]",
            minimum: 0,
            maximum: 150,
        },
        axisX: {
            title: "Day",
        },
        data: [{        
            type: "column",
            markerColor: "#14AA14",
            legendMarkerColor: "#14AA14",
            dataPoints: generated,
            color: "#14AA14",
        }]
    });
    chart1.options.data[0].dataPoints[generated.length-1].color = "#1414AA";
    const chart2 = new CanvasJS.Chart("runningtime", {
        animationEnabled: true,
        title:{
            text: "Running time: " + String(Math.round(runningtime_sum)) + " [h]",
            fontFamily: "Arial",
            fontSize: 25,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisY: {
            title: "Running Time [h]",
            minimum: 0,
            maximum: 24,
        },
        axisX: {
            title: "Day",
        },
        data: [{
            type: "column",
            markerColor: "#14AA14",
            legendMarkerColor: "#14AA14",
            dataPoints: runningtime,
            color: "#14AA14",
        }]
    });
    chart2.options.data[0].dataPoints[runningtime.length-1].color = "#1414AA";
    const chart3 = new CanvasJS.Chart("maxpower", {
        animationEnabled: true,
        title:{
            text: "Max Power",
            fontFamily: "Arial",
            fontSize: 25,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisY: {
            title: "Power [W]",
            minimum: 0,
            maximum: 15000,
        },
        axisX: {
            title: "Day",
        },
        data: [{        
            type: "column",
            markerColor: "#14AA14",
            legendMarkerColor: "#14AA14",
            dataPoints: maxpower,
            color: "#14AA14",
        }]
    });
    chart3.options.data[0].dataPoints[maxpower.length-1].color = "#1414AA";
    chart1.render();
    chart2.render();
    chart3.render();
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
    location.assign('http://'+String(ip_addr)+':'+String(port)+'/chart');
});

slct.addEventListener('change', function() {
    update_charts(this.value);
});