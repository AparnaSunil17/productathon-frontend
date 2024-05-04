// Save options to chrome.storage
function saveOptions() {
  var apiKey = document.getElementById("apiKey").value;
  const hideRecommendations = document.getElementById("hideRecommendations").checked;

  chrome.storage.sync.set(
    {
      openAIKey: apiKey,
      hideRecommendations: hideRecommendations,
    },
    function () {
      // Update status to let user know options were saved.
      console.log("Options saved.");
    }
  );
}

// Function to parse simple markdown to HTML
function simpleMarkdownParser(markdownText) {
  // Replace bold markdown with strong HTML tags
  let htmlText = markdownText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Simple list parsing
  htmlText = htmlText
    .replace(/^\s*\n\*\s/gm, "<ul>\n<li>")
    .replace(/^(\s*\*\s)/gm, "</li>\n<li>")
    .concat("</li>\n</ul>");
  // Fix for the added <ul> at every new line starting with *
  htmlText = htmlText.replace(/<\/li>\n<\/ul>(\n<ul>)/g, "</li>\n");

  // Replace consecutive newline characters with a single paragraph break
  htmlText = htmlText.replace(/\n\n/g, "<p></p>");

  // Convert single newlines to <br> for better formatting
  htmlText = htmlText.replace(/\n/g, "<br>");

  return htmlText;
}

// Function to fetch the plan from the server
function getPlan() {
  var button = document.getElementById("getPlan");
  // Disable the button and change the text to indicate loading
  button.disabled = true;
  button.textContent = "Developing your customized plan...";

  // Capture user input
  var personalGoal = document.getElementById("personal").value;
  var addictionGoal = document.getElementById("addiction").value;

  chrome.storage.sync.set(
    {
      personalGoal: personalGoal,
      addictionGoal: addictionGoal,
    },
    function () {
      // Update status to let user know options were saved.
      console.log("Input saved.");
    }
  );

  // Prepare the data to send
  var data = {
    personal_goal: personalGoal,
    addiction_goal: addictionGoal,
  };

  if (data) {
    
    console.log(JSON.stringify(data));
  } else {
    console.log("Data is undefined or null.");
  }
  

  // Set up the request options, including headers and body
  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  // The URL of your server
  var serverUrl = "http://localhost:3000/data"; // Change this to your server's URL

  // Send the request to the server
  fetch(serverUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Assuming the request is successful and you receive data from the server
      console.log("Received response from server:", data);
      button.disabled = false;
      button.textContent = "Get Plan";
    })
    .catch((error) => {
      console.error("Error:", error);
      // Optionally handle the error, such as displaying a message to the user
    });

  

}



// Restores options state using the preferences stored in chrome.storage
function restoreOptions() {
  chrome.storage.sync.get(
    {
      openAIKey: "",
      personalGoal: "",
      addictionGoal: "",
      hideRecommendations: false,
    },
    function (items) {
      document.getElementById("apiKey").value = items.openAIKey;
      document.getElementById("personal").value = items.personalGoal;
      document.getElementById("addiction").value = items.addictionGoal;
      document.getElementById("hideRecommendations").checked = items.hideRecommendations;
    }
  );
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("getPlan").addEventListener("click", getPlan);
