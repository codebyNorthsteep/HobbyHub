function getLikedHobbies() {
  return JSON.parse(localStorage.getItem("likedHobbies")) || [];
}

async function toggleLike(hobbyId) {
  let likedHobbies = getLikedHobbies();
  const index = likedHobbies.indexOf(hobbyId);

  if (index === -1) {
    likedHobbies.push(hobbyId);
  } else {
    likedHobbies.splice(index, 1);
  }

  localStorage.setItem("likedHobbies", JSON.stringify(likedHobbies));
}

function showEmptyMessage(container) {
  container.innerHTML = `
    <div class="empty-message">
      <p>You haven't liked any hobbies yet.</p>
      <p>Go back to <a href="index.html">Explore</a> to find hobbies you like!</p>
    </div>
  `;
}

async function loadHobbies() {
  const container = document.querySelector("#hobby-section");
  if (!container) return;
  const response = await fetch("/hobby.json"); 
  const hobbieData = await response.json();
  hobbieData.hobbies.forEach((hobby) => {
    const card = document.createElement("article");
    card.classList.add("hobby-card");

    const isLiked = getLikedHobbies().includes(hobby.id);
    card.innerHTML = `
    <a href="details.html?id=${hobby.id}" class="hobby-card-link">
        <img src="${hobby.image}" alt="${hobby.name}">
        <h2>${hobby.name}</h2>
        <button class="like-btn ${isLiked ? "liked" : ""}" aria-label="Like hobby">♥</button>
        <p class = "price">Price: ${hobby.price}</p>
        <p>Category: ${hobby.category}</p>
    </a>
        `;

    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", (event) => {
      event.preventDefault();

      toggleLike(hobby.id);
      likeBtn.classList.toggle("liked");
    });

    container.appendChild(card); 
  });
}

async function loadHobbyDetails() {
  const container = document.querySelector("#hobby-details");
  if (!container) return;
  const urlParams = new URLSearchParams(window.location.search); 
  const hobbyId = urlParams.get("id");

  const response = await fetch("/hobby.json");
  const hobbieData = await response.json();
  const hobby = hobbieData.hobbies.find((h) => h.id === hobbyId);

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
  const container = document.querySelector("#my-hobbies");
  if (!container) return;
  const likedHobbies = getLikedHobbies();

  const response = await fetch("/hobby.json");
  const hobbieData = await response.json();

  const myHobbies = hobbieData.hobbies.filter((hobby) =>
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
      behavior: "smooth"
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

    // Enkel JS-validering
    if (emailValue.length < 6 || !emailValue.includes("@")) {
      alert("Please enter a valid email address (at least 6 characters).");
      return;
    }

    alert(`Thank you for subscribing with: ${emailValue}`);
    emailInput.value = "";
  });
}

// Kom ihåg att anropa den längst ner
setupNewsletterForm();

setupBackToTop();
loadHobbies();
loadHobbyDetails();
showMyLikedHobbies();
