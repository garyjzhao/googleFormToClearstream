/**
 * This function takes in user's phone number and a message with an image attached,
 * and sends the message to the user.
 */

function sendETicketWelcomeMessage(phoneNumber, message) {
  var apiKey = 'REPLACE_WITH_CLEARSTREAM_API'; // Replace this with your actual API key

  var url = "https://api.getclearstream.com/v1/messages"

  var payload = {
    'message_header': 'A2F International',
    'message_body': message,
    'media_id': '890001', //TODO: Replace this with the actual media ID
    'subscribers': [phoneNumber]
  }

  var options = {
    'method': 'post',
    'headers': {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    'payload': JSON.stringify(payload)
  }

  // Make the API request
  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    // Check if the request was successful
    if (responseCode === 200) {
      var jsonResponse = JSON.parse(responseBody);
      Logger.log("sendETicketWelcomeMessage successful");
      Logger.log(jsonResponse);
      return true;
    } else {
      Logger.log('Error sendETicketWelcomeMessage: ' + responseCode + ' - ' + responseBody);
      return false;
    }
  } catch (e) {
    Logger.log('Error sendETicketWelcomeMessage: ' + e.message);
    return false;
  }
}
