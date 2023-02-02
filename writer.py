#! /usr/bin/python3

import mysql.connector as database
import sys
import requests
from datetime import datetime


def get_inverter_data():

    SAJ = 'http://192.168.1.67'
    SAJURL = SAJ + '/status/status.php'

    try:
        file = requests.get(SAJURL)
        string_set = file.text.split(',')
        return [int(string_set[i]) for i in range(len(string_set))]
    except:
        return None


def write_to_db(total_generated, total_running_time,
                today_generated, today_running_time,
                south_east_plant_voltage, south_east_plant_current,
                south_west_plant_voltage, south_west_plant_current,
                grid_connected_power, grid_connected_frequency,
                line1_voltage, line2_voltage, line3_voltage,
                line1_current, line2_current, line3_current):
    try:
        conn = database.connect(user="pi", password="raspberry",
                                host="127.0.0.1", port=3306,
                                database="solar_panel_inverter")
    except database.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        return

    cur = conn.cursor()

    cur.execute(
        "INSERT INTO inverter_data VALUES (default, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, default)", 
        (str(total_generated), str(total_running_time),
        str(today_generated), str(today_running_time),
        str(south_east_plant_voltage), str(south_east_plant_current),
        str(south_west_plant_voltage), str(south_west_plant_current),
        str(grid_connected_power), str(grid_connected_frequency),
        str(line1_voltage), str(line2_voltage), str(line3_voltage),
        str(line1_current), str(line2_current), str(line3_current)))

    conn.commit()

def get_last_active_row():
    try:
        conn = database.connect(user="pi", password="raspberry",
                                host="127.0.0.1", port=3306,
                                database="solar_panel_inverter")
    except database.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        return

    cur = conn.cursor()
    cur.execute("SELECT * FROM inverter_data WHERE id=(SELECT max(id) FROM inverter_data)")
    query_result = cur.fetchall()
    result_list = list(query_result[0])
    result_list.pop(0)
    result_list.pop(-1)

    return result_list

def main():
    inverter_data = get_inverter_data()

    if(inverter_data is None):
        inverter_data = get_last_active_row()
        if(len(inverter_data) == 0):
            inverter_data = [0.0 for i in range(16)]
        if(datetime.today().strftime("%p") == 'AM'):
            today_generated = 0.0
            today_running_time = 0.0
        elif(datetime.today().strftime("%p") == 'PM'):
            today_generated = inverter_data[2]
            today_running_time = inverter_data[3]
        write_to_db(total_generated=inverter_data[0],
                    total_running_time=inverter_data[1],
                    today_generated=today_generated,
                    today_running_time=today_running_time,
                    south_east_plant_voltage=0.0,
                    south_east_plant_current=0.0,
                    south_west_plant_voltage=0.0,
                    south_west_plant_current=0.0,
                    grid_connected_power=0.0,
                    grid_connected_frequency=inverter_data[9],
                    line1_voltage=inverter_data[10],
                    line2_voltage=inverter_data[11],
                    line3_voltage=inverter_data[12],
                    line1_current=inverter_data[13],
                    line2_current=inverter_data[14],
                    line3_current=inverter_data[15])
    else:
        write_to_db(total_generated=inverter_data[1]*0.01,
                    total_running_time=inverter_data[2]*0.1,
                    today_generated=inverter_data[3]*0.01,
                    today_running_time=inverter_data[4]*0.1,
                    south_east_plant_voltage=inverter_data[5]*0.1,
                    south_east_plant_current=inverter_data[6]*0.01,
                    south_west_plant_voltage=inverter_data[7]*0.1,
                    south_west_plant_current=inverter_data[8]*0.01,
                    grid_connected_power=inverter_data[23],
                    grid_connected_frequency=inverter_data[24]*0.01,
                    line1_voltage=inverter_data[25]*0.1,
                    line2_voltage=inverter_data[27]*0.1,
                    line3_voltage=inverter_data[29]*0.1,
                    line1_current=inverter_data[26]*0.01,
                    line2_current=inverter_data[28]*0.01,
                    line3_current=inverter_data[30]*0.01)


if __name__ == "__main__":
    main()