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

  if (listsUserIsIn.includes(239584)) {  // UGWN list
    userIsAlreadyInEventList = true;
  } else {
    listsUserIsIn.push(239584);
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
    if(!sendMessage(phoneNumber, false, "Looks like you're already registered for this event. See you Sunday 8/11, 6:30pm at WALC 1055!")) {
      throw new Error("Unable to send already registered message to " + phoneNumber);
    }
  } else {
    var message = 'Thanks for registering for our event! Here is your e-ticket.';
    if (!isExistingUser) {
      message = message + " We'll keep you updated about future events.";
    }
    if (!sendETicketWelcomeMessage(phoneNumber, message)) {
      throw new Error("Unable to send welcome e-ticket to " + phoneNumber);
    }
  }
}
