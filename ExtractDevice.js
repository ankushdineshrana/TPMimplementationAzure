'use strict';

var tpmSecurity = require('azure-iot-security-tpm');
var tssJs = require("tss.js");

var myTpm = new tpmSecurity.TpmSecurityClient(undefined, new tssJs.Tpm(true));


myTpm.getEndorsementKey(function(err, endorsementKey) {
    if (err) {
      console.log('The error returned from get key is: ' + err);
    } else {
      console.log('the endorsement key is: ' + endorsementKey.toString('base64'));
      myTpm.getRegistrationId((getRegistrationIdError, registrationId) => {
        if (getRegistrationIdError) {
          console.log('The error returned from get registration id is: ' + getRegistrationIdError);
        } else {
          console.log('The Registration Id is: ' + registrationId);
          process.exit();
        }
      });
    }
  });