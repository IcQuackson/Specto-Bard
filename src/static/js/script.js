const GENERATE_TESTS_URL = '/generate_tests';
const AMEND_TESTS_URL = '/amend_tests';
const CLEAR_MESSAGES_URL = '/clear_messages';

function getTestCasesByFile() {
	var inputText = document.getElementById("textInput").value;


	// make a request using fetch and await
	fetch(GENERATE_TESTS_URL, {
		method: 'POST',
		body: JSON.stringify({text: inputText}),
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

/* Handles upload file button */
function uploadFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = handleFileUpload;
    fileInput.click();
}

/* Handles file upload */
function handleFileUpload(event) {
	const file = event.target.files[0];
	const reader = new FileReader();
	reader.onload = function(e) {
		const text = e.target.result;
		document.getElementById('textInput').value = text;
	}
	reader.readAsText(file);
}

// Handles submit story data fetch
async function fetchTestCases(story) {
	story = {'text': story};
    try {
		console.log('Story:', story);
		console.log('Fetching data...')
        const response = await fetch(GENERATE_TESTS_URL, {
            method: 'POST',
            body: JSON.stringify(story),
            headers: {
                'Content-Type': 'application/json'
            }
        });
		console.log('Response:', response);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = response.text();
        // Do something with the data
        console.log('Data:', data);

        // Return the data or do further processing
        return data;
    } catch (error) {
        // Handle errors
        //console.error('Error:', error.message);
		console.log('Error: ', error.message);
        return null;
    }
}

// Handles submit story button
async function submitStory() {
	var inputText = document.getElementById("textInput").value;
	var displayText = document.getElementById("displayText");

	//console.log(inputText);
	story = await fetchTestCases(inputText);

	if (story == null) {
		alert("Story is invalid");
	} else {
		// Remove <head>, <body> and <html> tags
		console.log(story);
		displayText.innerHTML = story;
	}
}

function textAreaAdjust(element) {
	element.style.height = "1px";
	element.style.height = (25+element.scrollHeight)+"px";
}


