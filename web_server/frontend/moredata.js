let datajson;
const inverter_maxpower = 15000;

window.onload = async function () {
    datajson = await fetch('http://192.168.1.70:8080/datajson').then(res => res.json());

    document.getElementById("se_voltage").textContent=String(datajson[0].south_east_plant_voltage);
    document.getElementById("se_current").textContent=String(datajson[0].south_east_plant_current);
    document.getElementById("sw_voltage").textContent=String(datajson[0].south_west_plant_voltage);
    document.getElementById("sw_current").textContent=String(datajson[0].south_west_plant_current);

    //document.getElementById("grid_connected_power").textContent=String(datajson[0].grid_connected_power);
    //document.getElementById("grid_connected_frequency").textContent=String(datajson[0].grid_connected_frequency);

    document.getElementById("l1_voltage").textContent=String(datajson[0].line1_voltage);
    document.getElementById("l1_current").textContent=String(datajson[0].line1_current);
    document.getElementById("l2_voltage").textContent=String(datajson[0].line2_voltage);
    document.getElementById("l2_current").textContent=String(datajson[0].line2_current);
    document.getElementById("l3_voltage").textContent=String(datajson[0].line3_voltage);
    document.getElementById("l3_current").textContent=String(datajson[0].line3_current);


    const chart1 = new CanvasJS.Chart("voltagechart", {
        animationEnabled: true,
        title:{
            text:"Voltage by Lines [ V ]",
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisX:{
            interval: 1
        },
        axisY2:{
            interlacedColor: "#FFFFFF",
            gridColor: "#D3D3D3",
            minimum: 220,
            maximum: 240,
        },
        data: [{
            type: "bar",
            name: "Lines",
            axisYType: "secondary",
            color: "#14AA14",
            dataPoints: [
                { y: datajson[0].line1_voltage, label: "L1", color: "#AA1414" },
                { y: datajson[0].line2_voltage, label: "L2", color: "#AAAA14" },
                { y: datajson[0].line3_voltage, label: "L3", color: "#1414AA" },
            ]
        }]
    });
    const chart2 = new CanvasJS.Chart("currentchart", {
        animationEnabled: true,
        title:{
            text:"Current by Lines [ A ]",
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisX:{
            interval: 1
        },
        axisY2:{
            interlacedColor: "#FFFFFF",
            gridColor: "#D3D3D3",
            minimum: 0,
            maximum: 15,
        },
        data: [{
            type: "bar",
            name: "Lines",
            axisYType: "secondary",
            color: "#14AA14",
            dataPoints: [
                { y: datajson[0].line1_current, label: "L1", color: "#AA1414" },
                { y: datajson[0].line2_current, label: "L2", color: "#AAAA14" },
                { y: datajson[0].line3_current, label: "L3", color: "#1414AA" },
            ]
        }]
    });
    const chart3 = new CanvasJS.Chart("voltagebyplace", {
        animationEnabled: true,
        title:{
            text:"S-E/S-W [ V ]",
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisX:{
            interval: 1
        },
        axisY2:{
            interlacedColor: "#FFFFFF",
            gridColor: "#D3D3D3",
            minimum: 0,
            maximum: 800,
        },
        data: [{
            type: "bar",
            name: "Lines",
            axisYType: "secondary",
            color: "#14AA14",
            dataPoints: [
                { y: datajson[0].south_east_plant_voltage, label: "S-E", color: "#AA1414" },
                { y: datajson[0].south_west_plant_voltage, label: "S-W", color: "#1414AA" },
            ]
        }]
    });
    const chart4 = new CanvasJS.Chart("currentbyplace", {
        animationEnabled: true,
        title:{
            text:"S-E/S-W [ A ]",
            fontFamily: "Arial",
            fontSize: 20,
            fontWeight: "bold",
            fontColor: "#14AA14",
        },
        axisX:{
            interval: 1
        },
        axisY2:{
            interlacedColor: "#FFFFFF",
            gridColor: "#D3D3D3",
            minimum: 0,
            maximum: 30,
        },
        data: [{
            type: "bar",
            name: "Lines",
            axisYType: "secondary",
            color: "#14AA14",
            dataPoints: [
                { y: datajson[0].south_east_plant_current, label: "S-E", color: "#AA1414" },
                { y: datajson[0].south_west_plant_current, label: "S-W", color: "#1414AA" },
            ]
        }]
    });
    const chart5 = new CanvasJS.Chart("doughnut",
    {
      animationEnabled: true,
      title:{
        text:"Power by roof [ W ]",
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: "bold",
        verticalAlign: "center",
        fontColor: "#14AA14",
      },
      data: [
      {
       type: "doughnut",
       startAngle: 180,
       dataPoints: [
       {  y: datajson[0].south_east_plant_current*datajson[0].south_east_plant_voltage, color: "#AA1414", indexLabel: "S-E Power" },
       {  y: datajson[0].south_west_plant_current*datajson[0].south_west_plant_voltage, color: "#1414AA", indexLabel: "S-W Power" },
       {  y: inverter_maxpower-(datajson[0].south_east_plant_current*datajson[0].south_east_plant_voltage)-(datajson[0].south_west_plant_current*datajson[0].south_west_plant_voltage), color: "#D3D3D3", indexLabel: "Inactive" },
       ]
     }
     ]
    });
    chart1.render();
    chart2.render();
    chart3.render();
    chart4.render();
    chart5.render();
}

const btn1 = document.getElementById("general");
const btn2 = document.getElementById("charts");

btn1.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/');
});

btn2.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/chart');
});