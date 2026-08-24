function getLikedHobbies() {
  return JSON.parse(localStorage.getItem("likedHobbies")) || [];
}

// This function toggles the like status of a hobby by adding or removing its ID from the likedHobbies array in localStorage.
async function toggleLike(hobbyId) {
  let likedHobbies = getLikedHobbies();
  const index = likedHobbies.indexOf(hobbyId); // Check if the hobby is already liked by finding its index in the likedHobbies array

  if (index === -1) {
    likedHobbies.push(hobbyId); // If the hobby is not liked, add it to the likedHobbies array to avoid duplicates
  } else {
    likedHobbies.splice(index, 1); // If the hobby is already liked, remove it from the likedHobbies array
  }

  localStorage.setItem("likedHobbies", JSON.stringify(likedHobbies)); // Save the updated liked hobbies back to localStorage as a JSON string
}

function showEmptyMessage(container) {
  container.innerHTML = `
    <div class="empty-message">
      <p>You haven't liked any hobbies yet.</p>
      <p>Go back to <a href="index.html">Explore</a> to find hobbies you like!</p>
    </div>
  `;
}

// This script fetches hobby data from a JSON file and dynamically creates hobby cards to display on the webpage.
// "async" means that the function will return a promise and can use the await keyword to wait for asynchronous operations to complete.
async function loadHobbies() {
  const container = document.querySelector("#hobby-section"); // Select the container element
  if (!container) return; // If the container is not found, exit the function early to avoid errors
  //using const because the variables are not reassigned, they are only used within the function and do not need to be changed.
  const response = await fetch("/hobby.json"); // Fetch the JSON file, await waits for the fetch to complete before moving on to the next line
  const hobbieData = await response.json(); // Parse the JSON data to a JavaScript object, await waits for the parsing to complete before moving on to the next line

  hobbieData.hobbies.forEach((hobby) => {
    const card = document.createElement("article"); // Create a new article element for each hobby to display
    card.classList.add("hobby-card"); // Add a class for styling, the class comes from the CSS file, which is used to style the hobby cards

    const isLiked = getLikedHobbies().includes(hobby.id); //boolean to check if the hobby is liked, using the getLikedHobbies function to get the liked hobbies from localStorage and checking if the current hobby's id is in the array

    card.innerHTML = `
    <a href="details.html?id=${hobby.id}" class="hobby-card-link">
        <img src="${hobby.image}" alt="${hobby.name}">
        <h2>${hobby.name}</h2>
        <button class="like-btn ${isLiked ? "liked" : ""}" aria-label="Like hobby">♥</button>
        <p class = "price">Price: ${hobby.price}</p>
        <p>Category: ${hobby.category}</p>
    </a>
        `;

    const likeBtn = card.querySelector(".like-btn"); // Select the like button within the card
    likeBtn.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default action of the button, which is to submit a form or follow a link

      toggleLike(hobby.id); // Call the toggleLike function to add or remove the hobby from liked hobbies
      likeBtn.classList.toggle("liked"); // Toggle the "liked" class on the button for visual feedback, which changes the button's appearance when liked
    });

    container.appendChild(card); // Append the card to the container, which adds the card to the webpage.
    // child means that the card is a child of the container (hobby-section), which means that the card is inside the container in the HTML structure
  });
}

async function loadHobbyDetails() {
  const container = document.querySelector("#hobby-details"); // Select the container element for hobby details
  if (!container) return;
  const urlParams = new URLSearchParams(window.location.search); // Get the query parameters from the URL, which allows us to get the hobby id from the URL
  const hobbyId = urlParams.get("id"); // Get the hobby id from the query parameters, which allows us to know which hobby to display on the details page

  const response = await fetch("/hobby.json"); // Fetch the JSON file
  const hobbieData = await response.json(); // Parse the JSON data to a JavaScript object
  const hobby = hobbieData.hobbies.find((h) => h.id === hobbyId);

  if (!hobby) {
    console.error("Hobby not found");
    return;
  }

  const isLiked = getLikedHobbies().includes(hobby.id); // Check if the hobby is liked by checking if its id is in the likedHobbies array

  // Display hobby details in the container
  container.innerHTML = `
    <article class="hobby-detail-card">
      <div class="hobby-detail-image">
        <img src="${hobby.image}" alt="${hobby.name}">
      </div>
      <div class="hobby-detail-info">
        <button class="like-btn ${isLiked ? "liked" : ""}" aria-label="Gilla hobby">♥</button>
        <h1>${hobby.name}</h1>
        <p><strong>Category:</strong> ${hobby.category}</p>
        <p><strong>Price:</strong> ${hobby.price}</p>
        <p><strong>Availability:</strong> ${hobby.availability}</p>
        <p><strong>Difficulty:</strong> ${hobby.difficulty} / 5</p>
        <p class="description">${hobby.description}</p>
        <a href="index.html" class="back-btn">← Back to Explore</a>
        <a href="liked-hobbies.html" class="back-btn">← Back to My Hobbies</a>
      </div>
    </article>
    `;

  const likeBtn = container.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    toggleLike(hobby.id);
    likeBtn.classList.toggle("liked");
  });
}

async function showMyLikedHobbies() {
  const container = document.querySelector("#my-hobbies"); // Select the container element for liked hobbies
  if (!container) return;
  const likedHobbies = getLikedHobbies(); // Get the list of liked hobbies

  const response = await fetch("/hobby.json");
  const hobbieData = await response.json();

  const myHobbies = hobbieData.hobbies.filter((hobby) =>
    likedHobbies.includes(hobby.id),
  ); // Filter the hobbies to only include those that are liked

  if (myHobbies.length === 0) {
    showEmptyMessage(container); // Show a message if there are no liked hobbies
    return;
  }

  myHobbies.forEach((hobby) => {
    const card = document.createElement("article");
    card.classList.add("hobby-card");

    card.innerHTML = `
    <a href="details.html?id=${hobby.id}" class="hobby-card-link">
        <img src="${hobby.image}" alt="${hobby.name}">
        <h2>${hobby.name}</h2>
        <button class="like-btn liked" aria-label="Like hobby">♥</button>
        <p class="price">Price: ${hobby.price}</p>
        <p>Category: ${hobby.category}</p>
    </a>
        `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", (event) => {
      event.preventDefault();

      toggleLike(hobby.id);
      card.remove(); // Remove the card from the DOM when unliked
      if (container.children.length === 0) {
        showEmptyMessage(container);
      }
    });
    container.appendChild(card);
  });
}

loadHobbies();
loadHobbyDetails();
showMyLikedHobbies();
