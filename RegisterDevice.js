'use strict';

var ProvisioningTransport = require('azure-iot-provisioning-device-http').Http;
var iotHubTransport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var tpmSecurity = require('azure-iot-security-tpm');
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;



var provisioningHost = 'global.azure-devices-provisioning.net';
var idScope = '0ne00021F3E';

var tssJs = require("tss.js");
var securityClient = new tpmSecurity.TpmSecurityClient('', new tssJs.Tpm(true));
// if using non-simulated device, replace the above line with following:
//var securityClient = new tpmSecurity.TpmSecurityClient();

var provisioningClient = ProvisioningDeviceClient.create(provisioningHost, idScope, new ProvisioningTransport(), securityClient);



provisioningClient.register(function(err, result) {
    if (err) {
      console.log("error registering device: " + err);
    } else {
      console.log('registration succeeded');
      console.log('assigned hub=' + result.registrationState.assignedHub);
      console.log('deviceId=' + result.registrationState.deviceId);
      var tpmAuthenticationProvider = tpmSecurity.TpmAuthenticationProvider.fromTpmSecurityClient(result.registrationState.deviceId, result.registrationState.assignedHub, securityClient);
      var hubClient = Client.fromAuthenticationProvider(tpmAuthenticationProvider, iotHubTransport);
  
      var connectCallback = function (err) {
        if (err) {
          console.error('Could not connect: ' + err.message);
        } else {
          console.log('Client connected');
          var message = new Message('Hello world');
          hubClient.sendEvent(message, printResultFor('send'));
        }
      };
  
      hubClient.open(connectCallback);
  
      function printResultFor(op) {
        return function printResult(err, res) {
          if (err) console.log(op + ' error: ' + err.toString());
          if (res) console.log(op + ' status: ' + res.constructor.name);
          process.exit(1);
        };
      }
    }
  });