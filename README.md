# Solar Panel Inverter

## This is a website for monitoring solar panels at home.

A Python script manages to retrieve the data from the SAJ inverter's own web server via http request in every 5 minutes (scheduled in Linux crontab),
and it posts the data to the backend.

The backend (server.js) is based on Express.js and currently hosted locally on a Raspberry Pi 4B.
It is connected to a MySQL server, which is also hosted on the RPI, and data management is done by the Sequelize ORM.

The frontend is in native JavaScript, HTML and CSS for now, using Canvas.js for visualization.
