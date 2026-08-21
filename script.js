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

    // Set the inner HTML of the card with hobby details, using ${hobby.property} to insert the hobby's properties into the HTML
    card.innerHTML = `
            <img src="${hobby.image}" alt="${hobby.id}">
            <h2>${hobby.name}</h2>
            <p>Price: ${hobby.price}</p>
            <p>${hobby.description}</p>
            <p>Category: ${hobby.category}</p>
            <p>Availability: ${hobby.availability}</p>
            <p>Difficulty: ${hobby.difficulty}</p>
        `;
    container.appendChild(card); // Append the card to the container, which adds the card to the webpage.
    // child means that the card is a child of the container (hobby-section), which means that the card is inside the container in the HTML structure
  });
}

loadHobbies(); // Call the function to load hobbies when the script runs
