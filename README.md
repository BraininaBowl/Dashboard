# Dashboard
A simple page to pull data from a Domoticz server running on a Raspberry Pi, format it and display it on a Kindle Paperwhite screen. Build for a specific solar converter model and Kindle screen, so simplicity and efficiency took precedence over flexibility.

To minimize screen updates and api calls, the script calls the solar panels first. Only when they have been updated, the other data is requested as well.
