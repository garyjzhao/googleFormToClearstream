function uploadMediaToClearstream() {
  // Your Clearstream API key
  var apiKey = 'REPLACE_WITH_CLEARSTREAM_API'; // Replace this with your actual API key

  // The API endpoint for media upload
  var url = 'https://api.getclearstream.com/v1/media/upload';

  // File to be uploaded from Google Drive
  var fileBlob = DriveApp.getFileById('FILE_ID').getBlob(); // Replace with your file ID

  // Set up the request options
  var options = {
    'method': 'post',
    'headers': {
      'X-Api-Key': apiKey
    },
    'payload': {
      'media': fileBlob
    }
  };

  // Make the API request
  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText()); // Log the response for debugging
  } catch (e) {
    Logger.log('Error: ' + e.message);
  }
}
