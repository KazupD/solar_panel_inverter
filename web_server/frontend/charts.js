
const btn1 = document.getElementById("general");
const btn2 = document.getElementById("data");

btn1.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/');
});

btn2.addEventListener('click',function ()
{
    location.assign('http://192.168.1.70:8080/data');
});