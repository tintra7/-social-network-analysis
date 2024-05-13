#include <Arduino.h>
#include <IRremoteESP8266.h>
#include <IRac.h>
#include <IRutils.h>
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <HTTPClient.h>
#include <WiFiMulti.h>
#include <Wire.h>
//#include <LiquidCrystal_I2C.h>
const uint16_t kIrLed = 25;  // The ESP GPIO pin to use that controls the IR LED.
IRac ac(kIrLed);  // Create a A/C object using GPIO to sending messages with.
#define DHTPIN 26     // GPIO pin connected to the DHT sensor 
#define DHTTYPE DHT22     // DHT 11

DHT dht(DHTPIN, DHTTYPE);
//LiquidCrystal_I2C lcd(0x27, 16, 2);  // I2C address 0x27, 16 columns and 2 rows

const char* ssid = "Phong313";
const char* password = "paracetamol15mg/kg";
// const char* ssid = "Thien123";
// const char* password = "123123Thien";
const char* serverURL="http://localhost:8000/emergency?deviceId=";
WebServer WebServer(80);

String user_id;
String device_id;
void SetDefaultProfile()
{
  ac.next.protocol = decode_type_t::DAIKIN;  // Set a protocol to use.
  ac.next.model = 1;  // Some A/Cs have different models. Try just the first.
  ac.next.mode = stdAc::opmode_t::kCool;  // Run in cool mode initially.
  ac.next.celsius = true;  // Use Celsius for temp units. False = Fahrenheit
  ac.next.degrees = 25;  // 25 degrees.
  ac.next.fanspeed = stdAc::fanspeed_t::kMedium;  // Start the fan at medium.
  ac.next.swingv = stdAc::swingv_t::kOff;  // Don't swing the fan up or down.
  ac.next.swingh = stdAc::swingh_t::kOff;  // Don't swing the fan left or right.
  ac.next.light = false;  // Turn off any LED/Lights/Display that we can.
  ac.next.beep = false;  // Turn off any beep from the A/C if we can.
  ac.next.econo = false;  // Turn off any economy modes if we can.
  ac.next.filter = false;  // Turn off any Ion/Mold/Health filters if we can.
  ac.next.turbo = false;  // Don't use any turbo/powerful/etc modes.
  ac.next.quiet = false;  // Don't use any quiet/silent/etc modes.
  ac.next.sleep = -1;  // Don't set any sleep time or modes.
  ac.next.clean = false;  // Turn off any Cleaning options if we can.
  ac.next.clock = -1;  // Don't set any current time if we can avoid it.
  ac.next.power = false;  // Initially start with the unit off.
}
void HandleSetRequest() {
  if (WebServer.hasArg("plain")) {
    // Parse JSON data
    StaticJsonDocument<200> jsonDocument;
    DeserializationError error = deserializeJson(jsonDocument, WebServer.arg("plain"));
    const char* rq_device_id=jsonDocument["deviceId"];
    const char* rq_user_id=jsonDocument["userId"];
    device_id=String(rq_device_id);
    user_id=String(rq_user_id);
    if (error) {
      WebServer.send(400, "application/json", "Error parsing JSON data");
    } else {
      Serial.print(device_id);
      Serial.print(user_id);
    }
  }  WebServer.send(200, "application/json", "message:SET OK");
}
bool CompareString(const char* str1,const char*str2){
  return strcmp(str1, str2) == 0;
}
bool CompareString(String str1,const char*str2){
  return str1.equals(str2);
}
bool SetFan(const char* FM)
{
  if(CompareString(FM,"LOW"))
  {
    ac.next.fanspeed=stdAc::fanspeed_t::kLow;
    return true;
  }
  else if(CompareString(FM,"MEDIUM"))
  {
    ac.next.fanspeed=stdAc::fanspeed_t::kMedium;
    return true;
  }
  else if(CompareString(FM,"HIGH"))
  {
    ac.next.fanspeed=stdAc::fanspeed_t::kHigh;
    return true;
  }
  return false;
}
bool SetBrand(const char* B)
{
  if(CompareString(B,"SHARP"))
  {
    ac.next.protocol=decode_type_t::SHARP_AC;
    return true;
  }
  if(CompareString(B,"TOSHIBA"))
  {
    ac.next.protocol=decode_type_t::TOSHIBA_AC;
    return true;
  }
  if(CompareString(B,"SAMSUNG"))
  {
    ac.next.protocol=decode_type_t::SAMSUNG_AC;
    return true;
  }
  if(CompareString(B,"LG"))
  {
    ac.next.protocol=decode_type_t::LG;
    return true;
  }
  if(CompareString(B,"MITSUBISHI"))
  {
    ac.next.protocol=decode_type_t::MITSUBISHI_AC;
    return true;
  }
  if(CompareString(B,"PANASONIC"))
  {
    ac.next.protocol=decode_type_t::PANASONIC_AC;
    return true;
  }
  if(CompareString(B,"DAIKIN"))
  {
    ac.next.protocol=decode_type_t::DAIKIN;
    return true;
  }
  if(CompareString(B,"NEC"))
  {
    ac.next.protocol=decode_type_t::NEC;
    return true;
  }
  return false;
}
bool SetStatus(const char* status)
{
  if(CompareString(status,"ON"))
  {
    ac.next.power=true;
    return true;
  }
  else if(CompareString(status,"OFF"))
  {
    ac.next.power=false;
    return true;
  }
  else return false;
}
void HandleSendSignalRequest()
{
  Serial.print(device_id);
  Serial.print(user_id);
  if (WebServer.hasArg("plain")) {
    // Parse JSON data
    StaticJsonDocument<200> jsonDocument;
    DeserializationError error = deserializeJson(jsonDocument, WebServer.arg("plain"));
    const char* rq_device_id=jsonDocument["deviceId"];
    const char* rq_user_id=jsonDocument["userId"];
    const char* rq_fan=jsonDocument["fan"];
    const char* rq_brand=jsonDocument["brand"];
    const char*rq_status=jsonDocument["status"];
    int rq_temp=jsonDocument["temp"];
    Serial.print(rq_device_id);
    Serial.print(rq_user_id);
    Serial.print(rq_fan);
    Serial.print(rq_temp);
    Serial.print(rq_brand);
    if (error) {
      WebServer.send(400, "application/json", "Error parsing JSON data");
    } else {
      if(CompareString(device_id,rq_device_id)  && CompareString(user_id,rq_user_id) )
      {
        if(!SetFan(rq_fan))
        {
          WebServer.send(400,"application/json","message: Wrong Request");
          return;
        }
        if(!SetBrand(jsonDocument["brand"]))
        {
          WebServer.send(400,"application/json","message: Wrong Request");
          return;
        }
        if(!SetStatus(rq_status))
        {
          WebServer.send(400,"application/json","message: Wrong Request");
          return;
        }
        ac.next.degrees=int(jsonDocument["temp"]);
        Serial.println("Protocol " + String(ac.next.protocol) + " / " +
                      typeToString(ac.next.protocol) + " is supported.");
        
        ac.sendAc();   //Have the IRac class create and send a message.
        Serial.println("Sent!");
        delay(500);
        ac.sendAc();   //Have the IRac class create and send a message.
        Serial.println("Sent!");
        delay(500);
        ac.sendAc();   //Have the IRac class create and send a message.
        Serial.println("Sent!");
        delay(500);
      }
      else 
      {
        WebServer.send(400,"application/json","message : Wrong!");
        return;
      }
    }
  }  WebServer.send(200, "application/json", "message : SET OK");
}
void HandleStatsRequest() {
  // Đọc temperature and humidity từ DHT
  float tempC = dht.readTemperature();
  float humidity = dht.readHumidity();
  // JSON response
  String jsonResponse = "{\"device_id\":\"" + device_id + "\",\"temp\":" + String(tempC) + ",\"humidity\":" + String(humidity) + "}"; 
  WebServer.send(200, "application/json", jsonResponse);
}
void setup() {
  Serial.begin(9600);
  Serial.print("hello");
  delay(200);
  //Thiết lập trạng thái mặc định của AC
  SetDefaultProfile();
  // Kết nối đến mạng WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());

  // Khởi tạo DHT11 và LCD
  dht.begin();
  // lcd.init();
  // lcd.backlight();
  // lcd.setCursor(0, 0);
  // lcd.print("Temp:       C");
  // lcd.setCursor(0, 1);
  // lcd.print("Humidity:   %");
  // Bắt đầu máy chủ trên cổng 80
  WebServer.on("/api/device/set",HTTP_POST,HandleSetRequest);
  WebServer.on("/api/device/sendsignal",HTTP_POST,HandleSendSignalRequest);
  WebServer.on("/api/device/stats", HTTP_GET, HandleStatsRequest);
  Serial.println("Hello");
  WebServer.begin();
}
void Emergency()
{
  float tempC = dht.readTemperature();
  if(tempC>60)
  {
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverURL + device_id);  // Specify the URL of the server

      int httpResponseCode = http.GET();  // Send the GET request

      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);

        String response = http.getString();  // Get the response payload
        Serial.println("Response: " + response);
      } else {
        Serial.print("Error on HTTP request: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    }
    delay(5000);
  }
}

void loop() {
  WebServer.handleClient();
  // Đọc temperature và humidity từ DHT
  float tempC = dht.readTemperature();
  float humidity = dht.readHumidity();
  // Emergency();
  // Hiển thị temperature and humidity lên LCD
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  float f = dht.readTemperature(true);

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // // Compute heat index in Fahrenheit (the default)
  float hif = dht.computeHeatIndex(f, h);
  // Compute heat index in Celsius (isFahreheit = false)
  float hic = dht.computeHeatIndex(t, h, false);

  // Serial.print(F("Humidity: "));
  // Serial.print(h);
  // Serial.print(F("%  Temperature: "));
  // Serial.print(t);
  // Serial.print(F("°C "));
  // Serial.print(f);
  // Serial.print(F("°F  Heat index: "));
  // Serial.print(hic);
  // Serial.print(F("°C "));
  // Serial.print(hif);
  // Serial.println(F("°F"));

}