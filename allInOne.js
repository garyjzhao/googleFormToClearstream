/**
 * This is the all the functions combined into one file so it is easy to copy and paste to different google forms.
 */


function onFormSubmit(e) {
  // Log the form responses to the Logger
  // e.values is an array of form values
  var responses = e.response.getItemResponses();

  var formValues = extractFormValues(responses);

  var phoneNumber  = formValues.mobile_number;
  var tagIds = formValues.tags;

  var userData = getSubscriberData(phoneNumber);
  var isExistingUser = checkIfUserFinishedRegistration(phoneNumber);

  var listsUserIsIn = [];
  if (userData) {
    listsUserIsIn = getUserListIds(userData);
  }

  var userIsAlreadyInEventList = false;

  if (listsUserIsIn.includes(239583)) {  // Boba list
    userIsAlreadyInEventList = true;
  } else {
    listsUserIsIn.push(239583);
  }
  formValues.lists = listsUserIsIn;

  if (userData) {
    // This updates tags and lists, and everything else.
    if (!updateSubscriber(formValues, phoneNumber)) {
      throw new Error("Unable to update subscriber:" + formValues);
    }
  } else {
    // Creation only handles lists.
    if(!createSubscriber(formValues, phoneNumber)) {
      throw new Error("Unable to add new subscriber:" + formValues);
    }
    // So need to update to add tags.
    if (!updateSubscriberWithTags(tagIds, phoneNumber)) {
      throw new Error("Unable to update tags for subscriber:" + formValues);
    }
  }

  if (userIsAlreadyInEventList) {
    if(!sendMessage(phoneNumber, false, "Looks like you're already registered for Boba & Games. See you Friday 8/9, 7:30pm at Krach 230!")) {
      throw new Error("Unable to send already registered message to " + phoneNumber);
    }
  } else {
    var message = 'Thanks for registering for Boba & Games (Fri 8/9 7:30pm @ Krach 230)!';
    var use_header = false;
    if (!userData) {
      use_header = true;
      message = message + " We'll keep you updated about future events.";
    }
    if (!sendMessage(phoneNumber, use_header, message)) {
      throw new Error("Unable to send welcome message to " + phoneNumber);
    }
  }
}


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

function sendETicketWelcomeMessage(phoneNumber, message) {
  var apiKey = 'REPLACE_WITH_CLEARSTREAM_API'; // Replace this with your actual API key

  var url = "https://api.getclearstream.com/v1/messages"

  var payload = {
    'message_header': 'A2F International',
    'message_body': message,
    'media_id': '889477',
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

function checkIfUserFinishedRegistration(data) {
    if (!data) {
      return false;
    }
    // If not filled out gender, consider as having not finished registration.
    var hasGender = false;
    data?.tags?.forEach(function(tag) {
      if (tag.name == "Male" || tag.name == "Female") {
        Logger.log("Gender found");
        hasGender = true;
      }
    });
    if (!hasGender) {
      // If no gender, consider as non-Existent.
      Logger.log('subscriber does not exist because no gender was found:' + data)
      return false;
    }
    Logger.log('existing subscriber entry:' + data);
    return true;
}

function getUserListIds(data) {
  var lists = data?.lists;
  var list_ids = [];
  if (lists) {
    lists.forEach(function(list_item) {
      if (list_item.id) {
        list_ids.push(list_item.id);
      }
    });
  }
  return list_ids;
}

function getSubscriberData (phoneNumber) {
  var apiKey = 'REPLACE_WITH_CLEARSTREAM_API'; // Replace this with your actual API key

  var url = 'https://api.getclearstream.com/v1/subscribers/' + phoneNumber;

  var options = {
    'method': 'get',
    'headers': {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
  };

  // Make the API request
  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    // Check if the request was successful
    if (responseCode === 200) {
      // This means the user DOES EXIST
      var jsonResponse = JSON.parse(responseBody);
      var data = jsonResponse.data;
      Logger.log("Subcriber data retrieval successful");
      Logger.log(data);
      return data;
    } else {
      // This means the user DOES NOT EXIST
      Logger.log('Error (user not exist): ' + responseCode + ' - ' + responseBody);
      return null;
    }
  } catch (e) {
    // This also means the user DOES NOT EXIST
    Logger.log('Error attempting to determine user existence: ' + e.message);
    return null;
  }
}

/**
 * This function extracts form values from the form responses and
 * returns it as a json object.
 */
function extractFormValues(responses) {
  var phoneNumber = "";
  var tagIds = [];
  var email = '';
  var firstName = '';
  var lastName = '';

  responses.forEach(function (response) {
      var question = response.getItem().getTitle();
      var answer = response.getResponse();

      if (question === "First Name") {
        firstName = answer;
        return;
      }
      if (question === "Last Name") {
        lastName = answer;
        return;
      }
      if (question === "Phone Number") {
        var cleanedPhoneNumber = answer.replace(/[^\d+]/g, "");
        // Check if the number starts with '+'
        if (!cleanedPhoneNumber.startsWith("1")) {
          // If no '+' sign, prepend the country code
          cleanedPhoneNumber = `+1${cleanedPhoneNumber}`;
        }
        phoneNumber = cleanedPhoneNumber;
        return;
      }
      if (question.toLowerCase().includes('gender')) {
        switch (answer) {
          case 'Male':
            return tagIds.push(14026);
          case 'Female':
            return tagIds.push(14027);
        }
      }
      if (question.toLowerCase().includes('email')) {
        email = answer;
        return;
      }

      if (
        question === "Year in school" ||
        question === "What's your academic status?" ||
        question === "Academic Status " ||
        question === "What year in school are you?"
      ) {
        switch (answer) {
          case "Visiting Student/Scholar":
            return tagIds.push(14037, 14035);
          case "Transfer":
            return tagIds.push(14036, 14034);
          case "Grad - PhD":
          case "Graduate School - PhD":
            return tagIds.push(14033, 14035);
          case "Graduate School - Masters":
          case "Grad - Master":
            return tagIds.push(14032, 14035);
          case "Graduate":
            return tagIds.push(14035);
          case "Undergraduate":
            return tagIds.push(14034);
          case "Sophomore":
            return tagIds.push(14034, 14029);
          case "Junior":
            return tagIds.push(14034, 14030);
          case "Senior":
            return tagIds.push(14034, 14031);
          case "Freshman":
          case "Freshmen":
            return tagIds.push(14034, 14028);
        };
        return;
      }

      if (question.toLowerCase().includes("interested")) {
        answer.forEach(function (interest) {
          if (interest.includes("English")) {
              tagIds.push(14038);
          } else if (interest.includes("mentorship")) {
              tagIds.push(14039);
          } else if (interest.includes("Christianity")) {
              tagIds.push(14040);
          } else if (interest.includes("church")) {
              tagIds.push(14041);
          }
        });
      }
    }
  );

  return {
    'first': firstName,
    'last': lastName,
    'mobile_number': phoneNumber,
    'email': email,
    'tags': tagIds,
  };
}

