/**
 * Creates a new subscriber. payload should be a json object with keys matching the api call.
 * mobile_numer is required. Do not use the autoresponder fields.
 */

function createSubscriber(payload, phoneNumber) {
  // Your Clearstream API key
  var apiKey = 'REPLACE_WITH_CLEARSTREAM_API'; // Replace this with your actual API key

  var url = 'https://api.getclearstream.com/v1/subscribers';

  if (!payload?.mobile_number) {
    payload.mobile_number = phoneNumber;
  }
  payload.double_optin = false;
  payload.overwrite_attributes = true;

  // Set up the request options
  var options = {
    // 'method': 'patch',
    'method': 'post',
    'headers': {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    'payload': JSON.stringify(payload)
  };
  Logger.log("createSubscriber options:" + options);

  // Make the API request
  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    // Check if the request was successful
    if (responseCode === 200) {
      var jsonResponse = JSON.parse(responseBody);
      Logger.log('Successful createSubscriber:' + jsonResponse);
      return true;
    } else {
      Logger.log('Error createSubscriber: ' + responseCode + ' - ' + responseBody);
      return false;
    }
  } catch (e) {
    Logger.log('Error createSubscriber: ' + e.message);
    return false;
  }
}

/**
 * Updates the tags of the subscriber with the phone number.
 */
function updateSubscriberWithTags(tagPayload, phoneNumber) {
  // Your Clearstream API key
  var apiKey = 'REPLACE_WITH_CLEARSTREAM_API'; // Replace this with your actual API key

  // var phoneNumber = '+16265927296'
  // Clearstream API URL to get lists
  var url = 'https://api.getclearstream.com/v1/subscribers/' + phoneNumber;

  var payload = {
    'tags': tagPayload,
  };

  // Set up the request options
  var options = {
    'method': 'patch',
    'headers': {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    'payload': JSON.stringify(payload)
  };

  // Make the API request
  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    // Check if the request was successful
    if (responseCode === 200) {
      var jsonResponse = JSON.parse(responseBody);
      Logger.log('Successful updateSubscriberWithTags:' + jsonResponse);
      return true;
    } else {
      Logger.log('Error: ' + responseCode + ' - ' + responseBody);
      return false;
    }
  } catch (e) {
    Logger.log('Error: ' + e.message);
    return false;
  }
}

/**
 * Updates all the subscriber info with the phone number.
 */
function updateSubscriber(payload, phoneNumber) {
  // Your Clearstream API key
  var apiKey = 'REPLACE_WITH_CLEARSTREAM_API'; // Replace this with your actual API key

  // var phoneNumber = '+16265927296'
  // Clearstream API URL to get lists
  var url = 'https://api.getclearstream.com/v1/subscribers/' + phoneNumber;

  // Remove mobile_number:
  delete payload.mobile_number;

  // Set up the request options
  var options = {
    'method': 'patch',
    'headers': {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    'payload': JSON.stringify(payload)
  };

  // Make the API request
  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    // Check if the request was successful
    if (responseCode === 200) {
      var jsonResponse = JSON.parse(responseBody);
      Logger.log('Successful updateSubscriberWithTags:' + jsonResponse);
      return true;
    } else {
      Logger.log('Error: ' + responseCode + ' - ' + responseBody);
      return false;
    }
  } catch (e) {
    Logger.log('Error: ' + e.message);
    return false;
  }
}
