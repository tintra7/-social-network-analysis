#include<WiFi.h>
#include "DHTesp.h"
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <RTClib.h>

#define DHTpin 5

RTC_DS1307 rtc;

char daysOfTheWeek[7][12] = {
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
};

DHTesp dht;
//----Thay đổi thành thông tin của bạn---------------
const char* ssid = "Phong313";      //Wifi connect
const char* password = "paracetamol15mg/kg";   //Password

const char* mqtt_server = "b128048a90a847289dcd30d3ff68e5fc.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "user1"; //User
const char* mqtt_password = "User123@"; //Password
//--------------------------------------------------
WiFiClientSecure espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
//------------Connect to MQTT Broker-----------------------------
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientID =  "ESPClient-";
    clientID += String(random(0xffff),HEX);
    if (client.connect(clientID.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("esp32/client");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
//-----Call back Method for Receiving MQTT massage---------
void callback(char* topic, byte* payload, unsigned int length) {
  String incommingMessage = "";
  for(int i=0; i<length;i++) incommingMessage += (char)payload[i];
  Serial.println("Massage arived ["+String(topic)+"]"+incommingMessage);
}
//-----Method for Publishing MQTT Messages---------
void publishMessage(const char* topic, String payload, boolean retained){
  if(client.publish(topic,payload.c_str(),true))
    Serial.println("Message published ["+String(topic)+"]: "+payload);
}


void setup() {
  Serial.begin(9600);
  while(!Serial) delay(1);

  dht.setup(DHTpin,DHTesp::DHT22);

  setup_wifi();
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
    if (! rtc.begin()) {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    while (1);
  }

  // automatically sets the RTC to the date & time on PC this sketch was compiled
  rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));

  // manually sets the RTC with an explicit date & time, for example to set
  // January 21, 2021 at 3am you would call:
  // rtc.adjust(DateTime(2021, 1, 21, 3, 0, 0));

}
unsigned long timeUpdata=millis();
char buffer[20];

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  //delay(5000);
  client.loop();
  //read DHT11
  DateTime now = rtc.now();
  if(millis()-timeUpdata>1000){
    delay(dht.getMinimumSamplingPeriod());
    
    float h = dht.getHumidity();
    float t = dht.getTemperature();
    sprintf(buffer, "%04d/%02d/%02d %02d:%02d:%02d", now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second());
    unsigned long epochTime = now.unixtime();
    String timeString = String(buffer); // Chuyển đổi buffer thành String
    DynamicJsonDocument doc(1024);
    doc["h1"]=h;
    doc["te1"]=t;
    doc["t1"] = String(epochTime);

    char mqtt_message[128];
    serializeJson(doc,mqtt_message);
    publishMessage("esp32/dht22", mqtt_message, true);


    // check if any reads failed
    if (isnan(h) || isnan(t)) {
      Serial.println("Failed to read from DHT22 sensor!");
    } else {
      Serial.print("DHT22# Humidity1: ");
      Serial.print(h);
      Serial.print("%");

      Serial.print("  |  "); 

      Serial.print("Temperature2: ");
      Serial.print(t);
      Serial.print("°C ~ ");

      Serial.print("Date & Time: ");
      Serial.println(timeString);
      

    }
    timeUpdata=millis();
  }
}
