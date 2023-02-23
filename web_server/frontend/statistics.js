let statisticsjson;

const slct = document.getElementById("timeperiods");
const btn1 = document.getElementById("general");
const btn2 = document.getElementById("data");
const btn3 = document.getElementById("charts");

window.onload = async function () {
    await update_charts(slct.value);
}

async function update_charts(days) {
    statisticsjson = await fetch('http://192.168.1.70:8080/statisticsjson/' + String(days)).then(res => res.json());
    
    let generated = [];
    let runningtime = [];
    let maxpower = [];
    for(let i = 0; i < statisticsjson.length; i++) {
        generated.push({"label" : String(statisticsjson[i].month)+". "+String(statisticsjson[i].day)+".", "y" : statisticsjson[i].max_today_generated});
        runningtime.push({"label" : String(statisticsjson[i].month)+". "+String(statisticsjson[i].day)+".", "y" : statisticsjson[i].max_today_running_time});
        maxpower.push({"label" : String(statisticsjson[i].month)+". "+String(statisticsjson[i].day)+".", "y" : statisticsjson[i].max_grid_connected_power});
    }

    const chart1 = new CanvasJS.Chart("generated", {
        animationEnabled: true,
        title:{
            text: "Energy Generated",
            fontFamily: "Arial",
            fontSize: 20,
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
    const chart2 = new CanvasJS.Chart("runningtime", {
        animationEnabled: true,
        title:{
            text: "Running Time",
            fontFamily: "Arial",
            fontSize: 20,
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
    const chart3 = new CanvasJS.Chart("maxpower", {
        animationEnabled: true,
        title:{
            text: "Max Power",
            fontFamily: "Arial",
            fontSize: 20,
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
    chart1.render();
    chart2.render();
    chart3.render();
}

btn1.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/');
});

btn2.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/data');
});

btn3.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/chart');
});

slct.addEventListener('change', function() {
    update_charts(this.value);
});