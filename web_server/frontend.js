let continuous_inverter_data;
let momentary_inverter_data;

window.onload = async function () {
    continuous_inverter_data = await fetch('http://192.168.1.70:8080/inverter_conti')
                            .then(res => res.json());
    momentary_inverter_data = await fetch('http://192.168.1.70:8080/inverter_moment')
                            .then(res => res.json());
    
    console.log(continuous_inverter_data);
    console.log(momentary_inverter_data);

    document.getElementById("total_generated").textContent=String(momentary_inverter_data[0].total_generated);
    document.getElementById("total_running_time").textContent=String(momentary_inverter_data[0].total_running_time);
    document.getElementById("today_generated").textContent=String(momentary_inverter_data[0].today_generated);
    document.getElementById("today_running_time").textContent=String(momentary_inverter_data[0].today_running_time);
    document.getElementById("last_timestamp").textContent=String(parseDate(momentary_inverter_data[0].dt));
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function parseDate(str_date) {
    dt = new Date(Date.parse(str_date));
    return padTo2Digits(dt.getHours()) + ":" + padTo2Digits(dt.getMinutes());
}
