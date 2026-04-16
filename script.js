/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");

const selectedProductList = document.getElementById("selectedProductsList");
const modal = document.getElementById("myModal");
const modalContent = document.querySelector(".modal-content");
const modalExit = document.querySelector(".modal-exit");
const description = document.getElementById("description");

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
        
        <p id="hidden">${product.description}</p>
        <button id="modal-button" class="product-description">Info</button>
      </div>
    </div>
  `,
    )
    .join("");
  const productGrid = document.querySelectorAll(".product-card");
  productGrid.forEach((productG) => {
    productG.addEventListener("click", function (e) {
      if (e.target.className == "product-description") return;

      if (productG.parentElement.id === "productsContainer") {
        //console.log(selectedProductList.innerHTML);
        selectedProductList.appendChild(productG);
        //console.log(selectedProductList.innerHTML);
      } else {
        productsContainer.appendChild(productG);
      }
    });
  });
  const modalButton = document.querySelectorAll(".product-description");
  modalButton.forEach((button) =>
    button.addEventListener("click", function (e) {
      //console.log(e.target.previousSibling.previousSibling.innerHTML);
      modal.style.display = "block";
      description.textContent =
        e.target.previousSibling.previousSibling.innerHTML;
    }),
  );
}

modalExit.addEventListener("click", function () {
  modal.style.display = "none";
  description.textContent = "";
});

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;
  //const selectedProducts = document.querySelectorAll('.product-card');

  //console.log(products);
  /* filter() creates a new array containing only products 
     where the category matches what the user selected */
  const filteredProducts = products.filter(
    (product) =>
      product.category === selectedCategory &&
      selectedProductList.innerHTML.indexOf(product.name) == -1,
  );
  //console.log(filteredProducts);
  displayProducts(filteredProducts);
});

chatWindow.textContent = "Hello, how may I help you today?";

const routineGenerate = document.getElementById("generateRoutine");
routineGenerate.addEventListener("click", async (e) => {
  e.preventDefault();
  let selectedProductInfo = [];
  //selectedProductList.childNodes.forEach((element)=>selectedProductInfo.push(element.innerHTML));
  selectedProductList.childNodes.forEach((element) =>
    selectedProductInfo.push(JSON.stringify(element.innerHTML)),
  );
  selectedProductInfo.forEach((element) => console.log(element));
  const prompt = `Please create a personalized LOreal product routine with the following products:


${selectedProductInfo}`;

  const workerUrl = "https://loreal-worker2.dalon-bc6.workers.dev";

  if (!userInput) {
    chatWindow.textContent = "Please enter a prompt.";
    return;
  }

  chatWindow.textContent = "Thinking...";

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a Loreal routine advisor, specializing in giving cost-efficient product routine advice. Use the given parameters to build a routine for the user. 
    
        Always keep the routines short, realistic and tailored to the user's preferences.`,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await response.json();
    const lastMessage = data.choices[0].message.content;
    localStorage.setItem("lastMessage", lastMessage);
    chatWindow.innerHTML =
      data.choices[0].message.content || "No response recieved.";
  } catch (error) {
    console.error("Error:", error);
    chatWindow.textContent = "Oops! Something went wrong. Please try again.";
  }
});
/* Chat form submission handler - placeholder for OpenAI integration */

/*chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const workerUrl = "https://loreal-worker2.dalon-bc6.workers.dev";

  if (!userInput) {
    chatWindow.textContent = "Please enter a prompt.";
    return;
  }

  messages.push({ role: "user", content: userInput.value });

  chatWindow.textContent = "Thinking...";

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{role:'system',content:`You are a Loreal routine advisor, specializing in giving cost-efficient product routine advice. Use the given parameters to build a routine for the user. 
    
        Always keep the routines short, realistic and tailored to the user's preferences.`},{role:'user',content:prompt}],
        temperature:0.7,
        max_completion_tokens:500
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await response.json();
    chatWindow.innerHTML =
      data.choices[0].message.content || "No response recieved.";
  } catch (error) {
    console.error("Error:", error);
    chatWindow.textContent = "Oops! Something went wrong. Please try again.";
  }
});
*/
