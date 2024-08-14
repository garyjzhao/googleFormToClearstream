/**
 * This function sends a message to a phone number using the Clearstream API.
 *
 * @param {string} phoneNumber - The phone number to send the message to.
 * @param {boolean} include_header - Whether to include a header in the message.
 * @param {string} message_body - The body of the message.
 */


function sendMessage(phoneNumber, include_header, message_body) {
  var apiKey = 'REPLACE_WITH_CLEARSTREAM_API'; // Replace this with your actual API key

  var url = "https://api.getclearstream.com/v1/messages"

  var payload = {
    'message_header': include_header ? 'A2F International' : null,
    'message_body': message_body,
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
      Logger.log("sendMessage successful");
      Logger.log(jsonResponse);
      return true;
    } else {
      Logger.log('Error sendMessage: ' + responseCode + ' - ' + responseBody);
      return false;
    }
  } catch (e) {
    Logger.log('Error sendMessage: ' + e.message);
    return false;
  }
}
