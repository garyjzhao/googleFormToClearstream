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
