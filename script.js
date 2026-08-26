function getLikedHobbies() {
  const likedHobbies = localStorage.getItem("likedHobbies"); // Retrieve the liked hobbies from localStorage
  return JSON.parse(likedHobbies) || []; //return parsed array || empty array if null
}

function setLikedHobbies(likedHobbies) {
  const jsonString = JSON.stringify(likedHobbies);
  localStorage.setItem("likedHobbies", jsonString); // Store the updated array in localStorage
}

async function toggleLike(hobbyId) {
  let likedHobbies = getLikedHobbies();
  const index = likedHobbies.indexOf(hobbyId);

  if (index === -1) {
    likedHobbies.push(hobbyId); // Add hobbyId to the array if not already liked
  } else {
    likedHobbies.splice(index, 1); // Remove hobbyId from the array if already liked to avoid duplicates
  }
  setLikedHobbies(likedHobbies);
}

function likeButtonEvent(hobby, parentElement) {
  const likeBtn = parentElement.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    toggleLike(hobby.id);
    likeBtn.classList.toggle("liked");
  });
}

function showEmptyMessage(container) {
  container.innerHTML = `
    <div class="empty-message">
      <p>You haven't liked any hobbies yet.</p>
      <p>Go back to <a href="index.html">Explore</a> to find hobbies you like!</p>
    </div>
  `;
}

//Helpful function to fetch hobby data from the JSON file and handle errors
async function fetchHobbyData() {
  try {
    const response = await fetch("/hobby.json");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    const container = document.querySelector("#hobby-section");
    if (container) {
      container.innerHTML =
        "<p>Failed to load hobbies. Please try again later.</p>";
      return null; // Return null to indicate failure
    }
  }
}

async function loadHobbies() {
  const container = document.querySelector("#hobby-section");
  if (!container) return;

  const hobbyData = await fetchHobbyData();

  hobbyData.hobbies.forEach((hobby) => {
    const card = document.createElement("article");
    card.classList.add("hobby-card");

    const isLiked = getLikedHobbies().includes(hobby.id);

    card.innerHTML = `
    <a href="details.html?id=${hobby.id}" class="hobby-card-link">
        <img src="${hobby.image}" alt="${hobby.name}">
        <h2>${hobby.name}</h2>
        <p class = "price">Price: ${hobby.price}</p>
        <p>Category: ${hobby.category}</p>
    </a>
    <button type="button" class="like-btn ${isLiked ? "liked" : ""}" aria-label="Like hobby">♥</button>
        `;

    likeButtonEvent(hobby, card); // Attach the like button event listener to the card
    container.appendChild(card);
  });
}

async function loadHobbyDetails() {
  const container = document.querySelector("#hobby-details");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const hobbyId = urlParams.get("id");

  const hobbyData = await fetchHobbyData();

  const hobby = hobbyData.hobbies.find((h) => h.id === hobbyId);
  if (!hobby) {
    console.error("Hobby not found");
    return;
  }

  const isLiked = getLikedHobbies().includes(hobby.id);
  container.innerHTML = `
    <article class="hobby-detail-card">
      <div class="hobby-detail-image">
        <img src="${hobby.image}" alt="${hobby.name}">
      </div>
      <div class="hobby-detail-info">
        <button type="button" class="like-btn ${isLiked ? "liked" : ""}" aria-label="Gilla hobby">♥</button>
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

  likeButtonEvent(hobby, container);
}

async function showMyLikedHobbies() {
  const container = document.querySelector("#my-hobbies");
  if (!container) return;
  const likedHobbies = getLikedHobbies();

  const hobbyData = await fetchHobbyData();

  const myHobbies = hobbyData.hobbies.filter((hobby) =>
    likedHobbies.includes(hobby.id),
  );

  if (myHobbies.length === 0) {
    showEmptyMessage(container);
    return;
  }

  myHobbies.forEach((hobby) => {
    const card = document.createElement("article");
    card.classList.add("hobby-card");

    card.innerHTML = `
    <a href="details.html?id=${hobby.id}" class="hobby-card-link">
        <img src="${hobby.image}" alt="${hobby.name}">
        <h2>${hobby.name}</h2>
        <p class="price">Price: ${hobby.price}</p>
        <p>Category: ${hobby.category}</p>
    </a>
    <button type="button" class="like-btn liked" aria-label="Like hobby">♥</button>

        `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      toggleLike(hobby.id);
      card.remove(); // Remove the card from the section when unliked
      if (container.children.length === 0) {
        showEmptyMessage(container);
      }
    });
    container.appendChild(card);
  });
}

function setupBackToTop() {
  const backToTopBtn = document.querySelector("#backToTopBtn");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    // show the button when the user scrolls down 300px from the top
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  //(smooth scroll) when clicked
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function setupNewsletterForm() {
  const form = document.querySelector("#newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInput = document.querySelector("#email");
    const emailValue = emailInput.value.trim();

    if (emailValue.length < 6 || !emailValue.includes("@")) {
      alert("Please enter a valid email address (at least 6 characters).");
      return;
    }

    alert(`Thank you for subscribing with: ${emailValue}`);
    emailInput.value = "";
  });
}

setupNewsletterForm();
setupBackToTop();
loadHobbies();
loadHobbyDetails();
showMyLikedHobbies();
