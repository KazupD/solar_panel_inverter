#! /usr/bin/python3
import os
import requests
from datetime import datetime

SAJ_URL = "http://192.168.1.67/status/status.php"
SERVER_URL = 'http://localhost:8080/postinverterdata'

REMOTE_SERVER_IP = '192.168.1.64'
REMOTE_SERVER_PORT = '8080'
REMOTE_SERVER_URL = 'http://'+REMOTE_SERVER_IP+':'+REMOTE_SERVER_PORT+'/postinverterdata'

GREEN = 19
RED = 26

def get_inverter_data():

    try:
        file = requests.get(SAJ_URL)
        string_set = file.text.split(',')
        return [int(string_set[i]) for i in range(len(string_set))]
    except:
        return None

def flash_led(response):
    if(response == "OK"):
        os.system("raspi-gpio set " + str(RED) + " op dl")
        os.system("raspi-gpio set " + str(GREEN) + " op dh")
    elif(response == "ERROR"):
        os.system("raspi-gpio set " + str(GREEN) + " op dl")
        os.system("raspi-gpio set " + str(RED) + " op dh")
    print(response)

def main():
    inverter_data = get_inverter_data()
    payload = {}

    if(inverter_data is not None):
        payload["inverterstate"] = "ON"

        payload["total_generated"]=inverter_data[1]*0.01,
        payload["total_running_time"]=inverter_data[2]*0.1,
        payload["today_generated"]=inverter_data[3]*0.01,
        payload["today_running_time"]=inverter_data[4]*0.1,
        payload["south_east_plant_voltage"]=inverter_data[5]*0.1,
        payload["south_east_plant_current"]=inverter_data[6]*0.01,
        payload["south_west_plant_voltage"]=inverter_data[7]*0.1,
        payload["south_west_plant_current"]=inverter_data[8]*0.01,
        payload["grid_connected_power"]=inverter_data[23],
        payload["grid_connected_frequency"]=inverter_data[24]*0.01,
        payload["line1_voltage"]=inverter_data[25]*0.1,
        payload["line2_voltage"]=inverter_data[27]*0.1,
        payload["line3_voltage"]=inverter_data[29]*0.1,
        payload["line1_current"]=inverter_data[26]*0.01,
        payload["line2_current"]=inverter_data[28]*0.01,
        payload["line3_current"]=inverter_data[30]*0.01

        print("INVERTER ON")

    elif(datetime.today().strftime("%p") == 'AM' and inverter_data is None):
        payload["inverterstate"] = "OFF_BEFORE_SUNRISE"
        print("INVERTER IS OFF, BEFORE SUNRISE")
    elif(datetime.today().strftime("%p") == 'PM' and inverter_data is None):
        payload["inverterstate"] = "OFF_AFTER_SUNSET"
        print("INVERTER IS OFF, AFTER SUNSET")

    try:
        response = requests.post(SERVER_URL, data=payload)
        answer = response.text
    except:
        answer = "ERROR"

    flash_led(answer)

    try:
        response = requests.post(REMOTE_SERVER_URL, data=payload)
        answer = response.text
    except:
        answer = "ERROR"


if __name__ == "__main__":
    main()
