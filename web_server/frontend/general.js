let generaljson;
const inverter_maxpower = 15000;

window.onload = async function () {
    generaljson = await fetch('http://192.168.1.70:8080/generaljson').then(res => res.json());

    document.getElementById("total_generated").textContent=String(generaljson[0].total_generated);
    document.getElementById("total_running_time").textContent=String(generaljson[0].total_running_time);
    document.getElementById("today_generated").textContent=String(generaljson[0].today_generated);
    document.getElementById("today_running_time").textContent=String(generaljson[0].today_running_time);
    document.getElementById("grid_connected_power").textContent=String(generaljson[0].grid_connected_power);
    document.getElementById("last_timestamp").textContent=String(parseDate(generaljson[0].dt));

    const percent = Math.round((generaljson[0].grid_connected_power/inverter_maxpower)*100)

    const chart = new CanvasJS.Chart("doughnut",
    {
      animationEnabled: true,
      title:{
        text: String(percent) + "%",
        fontFamily: "Arial",
        fontSize: 40,
        fontWeight: "bold",
        fontColor: "#14AA14",
        verticalAlign: "center"
      },
      data: [
      {
       type: "doughnut",
       startAngle: 180,
       dataPoints: [
       {  y: percent, color: "#14AA14", indexLabel: "Active" },
       {  y: 100-percent, color: "#D3D3D3", indexLabel: "Inactive" },
       ]
     }
     ]
    });

    chart.render();
}

function padTo2Digits(num) {return num.toString().padStart(2, '0');}

function parseDate(str_date) {
    let dt = new Date(Date.parse(str_date));
    dt.setHours(dt.getHours() - 1);
    return padTo2Digits(dt.getHours()) + ":" + padTo2Digits(dt.getMinutes());
}

const btn1 = document.getElementById("charts");
const btn2 = document.getElementById("data");

btn1.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/chart');
});

btn2.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/data');
});
