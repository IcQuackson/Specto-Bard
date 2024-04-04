const GENERATE_TESTS_URL = '/generate_tests';
const AMEND_TESTS_URL = '/amend_tests';
const CLEAR_MESSAGES_URL = '/clear_messages';
const DOWNLOAD_DOCX_URL = '/download_docx';
var fetch_data_flag = false;
var uploaded_file = null;

var modalHTML = `
	<div id="SBModal" class="modal">
	<!-- Modal content -->
	<div class="modal-content">
	<p id="modal-fact" class="modal-p"></p>
	</div>
	</div>
	`;
	
	document.body.innerHTML += modalHTML;

var funFacts = [];
funFacts.push("Dolphins are highly intelligent marine mammals known for their playful behavior and complex social structures.");
funFacts.push("Whales are the largest animals on Earth, with some species reaching lengths of over 100 feet and weighing up to 200 tons.");
funFacts.push("Sharks are ancient predators that have been roaming the oceans for over 400 million years, with diverse species ranging from the massive whale shark to the fearsome great white.");
funFacts.push("Penguins are flightless birds that are highly adapted to life in the water, with specialized flippers for swimming and sleek bodies for diving.");
funFacts.push("Cuttlefish are masters of disguise, they transform color and pattern instantly for camouflage.");
funFacts.push("Crows are intelligent problem-solvers, communicating through varied vocalizations, with remarkable memory and social behaviors.");
funFacts.push("Sea pigs are deep-sea scavengers, resembling pigs with tube-like feet, thriving in abyssal depths, feeding on marine detritus.");
funFacts.push("Marsupials are mammals with pouches for nurturing young, iconic to Australia, including kangaroos, koalas, and wallabies.");
funFacts.push("Hummingbirds are tiny, iridescent birds capable of hovering in mid-air, feeding on nectar with remarkable agility.");
funFacts.push("Lions are majestic predators, living in prides, with males boasting impressive manes, while females lead hunts.");
funFacts.push("Capivaras are large semi-aquatic rodents found in South America, known for their social behavior and aquatic lifestyle.");
funFacts.push("The Harris's Hawk, also known as the bay-winged hawk, is a social raptor found in the Americas, characterized by its cooperative hunting behavior and striking plumage.");
funFacts.push("The Peregrine Falcon is the fastest animal on Earth, reaching speeds over 386 kph during its high-speed dives.");
funFacts.push("The Tiger Shark is a large, predatory shark known for its distinctive stripes and voracious appetite, inhabiting tropical and temperate waters worldwide.");
funFacts.push("The Great White Shark is an apex predator of the ocean, known for its size, power, and iconic serrated teeth.");
funFacts.push("Seals are marine mammals that is characterized by its sleek body, flippers, and playful behavior both on land and in water.");
funFacts.push("Dogs are domesticated mammals known for their loyalty, diverse breeds, and roles as companions, workers, and service animals.");
funFacts.push("Cats are independent, agile mammals known for their grace, hunting prowess, and affectionate yet aloof demeanor as pets.");
funFacts.push("Polar bears are iconic Arctic predators, adapted to survive in extreme cold, with thick fur and a keen sense of smell for hunting seals.");
funFacts.push("Grizzly bears are powerful omnivores found in North America, known for their massive size, distinctive hump, and aggressive defense of territory.");
funFacts.push("Flamingos are tall, pink wading birds with distinctive curved beaks, known for their elegant appearance and flocking behavior in wetland habitats.");
funFacts.push("Trout are freshwater fish known for their streamlined bodies, colorful patterns, and popularity among anglers for sport fishing.");
funFacts.push("Cod are cold-water fish, known for their mild flavor and flaky texture, popular in cuisines worldwide and historically significant in maritime economies.");
funFacts.push("Chickens are domesticated birds raised for their meat and eggs, versatile in diets and cultures worldwide.");
funFacts.push("Pigeons are common urban birds with distinctive cooing calls, known for their homing abilities and historical use in messaging and racing.");
funFacts.push("Pigs are known for their keen sense of smell, even surpassing that of dogs, making them valuable for tasks like truffle hunting.");
funFacts.push("Octopuses are highly intelligent marine mollusks with complex nervous systems, capable of problem-solving and camouflaging to avoid predators.");
funFacts.push("Squid are fast-swimming cephalopods with elongated bodies, equipped with powerful tentacles and beaks, often hunted as food by humans and marine predators.");
funFacts.push("Pandas are iconic black and white bears native to China, primarily herbivorous, and known for their bamboo diet and conservation status as an endangered species.");
funFacts.push("The Bengal tiger is the largest tiger species, native to the Indian subcontinent, known for its striking coat pattern and status as an apex predator.");
funFacts.push("Pumas, also known as mountain lions or cougars, are large wild cats native to the Americas, known for their agility, powerful leaps, and solitary hunting behavior.");
funFacts.push("Saber-toothed cats, such as Smilodon, were prehistoric predators characterized by their long, curved canine teeth and robust build, extinct around 10,000 years ago.");
funFacts.push("Mammoths were ancient relatives of elephants, with long, curved tusks and shaggy coats, roaming the Earth during the Ice Age before going extinct around 4,000 years ago.");
funFacts.push("Elephants are the largest land mammals, known for their tusks, trunk, and social behavior, revered in many cultures and habitats worldwide.");
funFacts.push("Ostriches are the largest birds, known for their flightlessness, fast running speeds, and large, powerful legs adapted for kicking predators.");
funFacts.push("The narwhal, often referred to as the 'unicorn of the sea', is a species of whale known for its long, spiral tusk, which is actually an elongated tooth that can grow up to 10 feet long.");


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
    fileInput.accept = '.docx, .txt'; // Accepts both DOCX and text files
    fileInput.onchange = handleFileUpload;
    fileInput.click();
}

/* Handles file upload */
function handleFileUpload(event) {
	const file = event.target.files[0];
	const fileName = file.name;
	const textInput = document.getElementById('textInput')
	textInput.value = fileName;
	textInput.disabled = true;
	// store the uploaded file
	uploaded_file = event.target;
}

// Handles submit story data fetch
async function fetchTestCases(file, story, automaticManual, testType) {

	const formData = new FormData();
	if (file != null) {
		formData.append('file', uploaded_file.files[0]);
		console.log('File:', uploaded_file.files[0]);
	}
	else {
		formData.append('text', story);
		console.log('Story:', story);
	}
	formData.append('automaticManual', automaticManual);
	formData.append('testType', testType);
    try {
		console.log('FormData:', formData)
		console.log('Fetching data...')
        const response = await fetch(GENERATE_TESTS_URL, {
            method: 'POST',
            body: formData
        });
		console.log('Response:', response);

        if (!response.ok) {
			fetch_data_flag = true;
			uploaded_file = null;
            throw new Error('Failed to fetch data');
        }

        const data = response.text();
        console.log('Data:', data);

		uploaded_file = null;
		fetch_data_flag = true;
        return data;
    } catch (error) {
		fetch_data_flag = true;
		uploaded_file = null;
		console.log('Error: ', error.message);
        return null;
    }
}

// Handles amend tests button
async function amendTests() {
	let amendTextbar = document.getElementById("amend-textbar");
	let amendText = amendTextbar.value;

	if (amendText == "") {
		alert("Please enter text to amend");
		return;
	}

	fetch_data_flag = false;
	const [amendTestsResult, loadingScreenResult] = await Promise.all([
		fetchAmendTests(amendText),
		loadingScreen()
	]);

	console.log(amendTestsResult);
	
	if (amendTestsResult == null) {
		alert("Tests are invalid");
	} else {
		console.log(amendTestsResult);
		displayText.innerHTML = amendTestsResult;
	}
}

// Handles amend tests data fetch
async function fetchAmendTests(amended_text) {
	let payload = {'amended_text': amended_text}
	try {
		console.log('Fetching data...')
		fetch_data_flag = false;

		const response = await fetch(AMEND_TESTS_URL, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log('Response:', response);

		if (!response.ok) {
			fetch_data_flag = true;
			throw new Error('Failed to fetch data');
		}

		const data = response.text();
		console.log('Data:', data);

		fetch_data_flag = true;
		return data;
	} catch (error) {
		console.log('Error: ', error.message);
		fetch_data_flag = true;
		return null;
	}
}

// Handles clear messages data fetch
async function fetchClearMessages() {
	try {
		console.log('Fetching data...')
		const response = await fetch(CLEAR_MESSAGES_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		console.log('Response:', response);

		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}

		const data = response.json();
		console.log('Data:', data);
		return data;
	} catch (error) {
		console.log('Error: ', error.message);
		return null;
	}
}

// Handles display modal
function displayModal() {
	modal = document.getElementById("SBModal");
}

// Handles loading screen while fetching data
async function loadingScreen() {
	let modal = document.getElementById("SBModal");
	modal.style.display = "block";

	let i = 0;
	while (!fetch_data_flag) {
		var randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
		if (i % 7 == 0) {
			document.getElementById("modal-fact").textContent = randomFact;
		}
		await new Promise(resolve => setTimeout(resolve, 1000));
		i++;
	}
	modal.style.display = "none";
}

// Handles submit story button
async function submitStory() {
	let inputText = document.getElementById("textInput").value;
	let displayText = document.getElementById("displayText");
	const automaticManualForm = document.getElementById('automaticManualForm');
	const automaticManual = automaticManualForm.querySelector('input[name="automaticManual"]:checked').value;
	const testTypeForm = document.getElementById('testTypeForm');
	const testType = testTypeForm.querySelector('input[name="testType"]:checked').value;

	if (inputText == "") {
		alert("Please enter text to generate tests");
		return;
	}

	fetch_data_flag = false;
	const [story, loadingScreenResult] = await Promise.all([
        fetchTestCases(uploaded_file, inputText, automaticManual, testType),
        loadingScreen()
    ]);

	if (story == null) {
		alert("Story is invalid");
	} else {
		console.log(story);
		displayText.innerHTML = story;
	}
}

// Handles reset history button
async function resetHistory() {
	const data = await fetchClearMessages();
	if (data == null) {
		alert("Failed to clear history");
	} else {
		console.log(data);
	}
	// Clear display text
	document.getElementById("displayText").innerHTML = "";
	if (document.getElementById("textInput").disabled) {
		document.getElementById("textInput").disabled = false;
		document.getElementById("textInput").value = "";
	}
}

async function downloadDocx() {
	const data = await fetch(DOWNLOAD_DOCX_URL)
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.blob();
	})
	.then(blob => {
		// Create a temporary link element
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = 'output.docx';
		document.body.appendChild(a);

		// Trigger the download
		a.click();

		// Clean up
		window.URL.revokeObjectURL(url);
	})
	.catch(error => {
		console.error('Error downloading file:', error);
	});
}

function textAreaAdjust(element) {
	element.style.height = "1px";
	element.style.height = (25+element.scrollHeight)+"px";
}
