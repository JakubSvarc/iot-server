import paho.mqtt.client as paho
import time
import json
import random

broker = '127.0.0.1'
port = 1883
keepalive = 60
stationID = '19bd830b-4b26-46d8-9b30-78ab5cf7d772'
counter = 0

client = paho.Client()                        
client.will_set(stationID + '/disconnect', 'Disconnected', 0, False)
client.connect(broker, port, keepalive)  
client.publish(stationID + '/connect', 'Connected', 0, False)
while True:
	if counter < 9:
		save = False
		counter += 1
	else:
		save = True
		counter = 0
	message = json.dumps({
		"save": save,
		"data": {
			"inside": {
				"temperature": random.randint(18, 23), 
				"humidity": random.randint(60, 85)
			},
			"outside": {
				"temperature": random.randint(-3, 5), 
				"humidity": random.randint(50, 65)
			}
		}
	})
	client.publish(stationID, message, 0, False)    
	time.sleep(3)
