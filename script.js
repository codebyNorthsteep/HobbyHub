// This script fetches hobby data from a JSON file and dynamically creates hobby cards to display on the webpage.
// "async" means that the function will return a promise and can use the await keyword to wait for asynchronous operations to complete.
async function loadHobbies() {
  //using const because the variables are not reassigned, they are only used within the function and do not need to be changed.
  const response = await fetch("/hobby.json"); // Fetch the JSON file, await waits for the fetch to complete before moving on to the next line
  const hobbieData = await response.json(); // Parse the JSON data to a JavaScript object, await waits for the parsing to complete before moving on to the next line

  const container = document.querySelector("#hobby-section"); // Select the container element

  hobbieData.hobbies.forEach((hobby) => {
    const card = document.createElement("article"); // Create a new article element for each hobby to display
    card.classList.add("hobby-card"); // Add a class for styling, the class comes from the CSS file, which is used to style the hobby cards

    // Set the inner HTML of the card with hobby details, using ${hobby.property} to insert the hobby's properties into the HTML,
    // also using a link to the details page with the hobby's id as a query parameter, which allows the details page to know which hobby to display
    card.innerHTML = `
    <a href="details.html?id=${hobby.id}" class="hobby-card-link">
        <img src="${hobby.image}" alt="${hobby.name}">
        <h2>${hobby.name}</h2>
        <button class="like-btn" aria-label="Like hobby">♥</button>
        <p class = "price">Price: ${hobby.price}</p>
        <p>Category: ${hobby.category}</p>
    </a>
        `;
    container.appendChild(card); // Append the card to the container, which adds the card to the webpage.
    // child means that the card is a child of the container (hobby-section), which means that the card is inside the container in the HTML structure
  });
}

async function loadHobbyDetails() {
  const container = document.querySelector("#hobby-details"); // Select the container element for hobby details
  const urlParams = new URLSearchParams(window.location.search); // Get the query parameters from the URL, which allows us to get the hobby id from the URL
  const hobbyId = urlParams.get("id"); // Get the hobby id from the query parameters, which allows us to know which hobby to display on the details page

  const response = await fetch("/hobby.json"); // Fetch the JSON file
  const hobbieData = await response.json(); // Parse the JSON data to a JavaScript object
  const hobby = hobbieData.hobbies.find((h) => h.id === hobbyId);

  if (!hobby) {
    console.error("Hobby not found");
    return;
  }

  // Display hobby details in the container
  container.innerHTML = `
    <article class="hobby-detail-card">
      <div class="hobby-detail-image">
        <img src="${hobby.image}" alt="${hobby.name}">
      </div>
      <div class="hobby-detail-info">
        <button class="like-btn" aria-label="Gilla hobby">♥</button>
        <h1>${hobby.name}</h1>
        <p><strong>Category:</strong> ${hobby.category}</p>
        <p><strong>Price:</strong> ${hobby.price}</p>
        <p><strong>Availability:</strong> ${hobby.availability}</p>
        <p><strong>Difficulty:</strong> ${hobby.difficulty} / 5</p>
        <p class="description">${hobby.description}</p>
        <a href="index.html" class="back-btn">← Back to Explore</a>
      </div>
    </article>
    `;
}

loadHobbies(); // Call the function to load hobbies when the script runs
loadHobbyDetails(); // Call the function to load hobby details when the script runs
