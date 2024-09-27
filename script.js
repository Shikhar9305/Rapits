let currentSlide = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Loop back to the start if at the end
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Move the slider
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Optional: Auto slide every 3 seconds
setInterval(nextSlide, 2000);
function toggleOptions(element) {
    const optionsDiv = element.nextElementSibling;
    const allOptions = document.querySelectorAll('.filter-category .options');

    // Hide all options first
    allOptions.forEach(options => options.style.display = 'none');

    // Show the clicked option
    optionsDiv.style.display = 'flex';
}
const headings = document.querySelectorAll('.filter-headings h3');
const contents = document.querySelectorAll('.filter-content .content');
const defaultMessage = document.querySelector('.filter-content .default-message');

headings.forEach(heading => {
  heading.addEventListener('click', () => {
    const targetId = heading.getAttribute('data-target');

    contents.forEach(content => {
      content.style.display = 'none';
    });

    document.getElementById(targetId).style.display = 'block';
    defaultMessage.style.display = 'none';
  });
});


// Variables to track the state
let locationFetched = false;
let videoPlayedOnce = false;

// Video element
const video = document.getElementById('intro-video');

// Function to handle video playback completion
video.addEventListener('ended', () => {
    videoPlayedOnce = true;
    console.log(videoPlayedOnce)  ;
    checkConditions();
});

// Function to fetch user location
function fetchUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {      // here two function is passed as callback , position & error
            locationFetched = true;
            console.log('Location fetched:', position);
          const lat=position.coords.latitude;
         const long=position.coords.longitude;
           console.log(lat);
           console.log(long);
            exact(lat,long);
            checkConditions();
        }, error => {
            console.error('Error fetching location:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

// Function to check if both conditions are met
function checkConditions() {
    if (locationFetched && videoPlayedOnce) {
        transitionToMainHomePage();
    }
}

// Function to transition to the main home page
function transitionToMainHomePage() {
    document.querySelector('.landingpg').style.display = 'none';
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.main').style.display = 'block';
    document.querySelector('footer').style.display = 'flex';

}

// Start fetching user location in the background
fetchUserLocation();

// Add an event listener to track when the video has completed its first loop
video.addEventListener('timeupdate', function () {
    if (video.currentTime >= video.duration) {
        videoPlayedOnce = true;
        checkConditions();
    }
});

let address= document.querySelector(".navbar .location span");

// Fetching exact address
const exact = async (lat, long) => {
    
    const key = "5a1903b7ea1c4f9d924c7a5e0a22e337";
    const endpoint = "https://api.opencagedata.com/geocode/v1/json?";
    const URL = `${endpoint}q=${lat}%2C${long}&key=${key}`;
    
    try {
        let response = await fetch(URL);  
        let data = await response.json();
        console.log(data);  // Logs the entire parsed JSON data
        console.log(data.results[0].formatted);
        const longText =data.results[0].formatted;
        const truncatedText = truncateText(longText, 7);
        address.innerText=truncatedText;
    } catch (error) {
        console.error("An error occurred:", error);
    }
};
let restau =document.querySelector(".restau p")
//truncsting the address as .....

function truncateText(text, wordLimit) {
    const words = text.split(' '); // Split the text into an array of words
     mainword=words[2];
     console.log(mainword);
     restau.innerText+=mainword; // adss location in restrau div
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...'; // Join the first `wordLimit` words and add "..."
    } else {
        return text; // If the text is shorter than the limit, return it as is
    }
}


let restaurantcard=document.querySelectorAll(".restaurant-card");
let panel =document.querySelector(".panel");
let main= document.querySelector(".main");
restaurantcard.forEach(card => {
card.addEventListener('click',()=>
{
    
    panel.style.display="block";
    main.style.display="none";
}
);
});


// working on adding food items to cart and updation of values in cart
const cart = [];
const deliveryFee = 5;

function updateCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const itemTotalSpan = document.querySelector('.item-total');
    const subtotalSpan = document.querySelector('.subtotal-amount');

    // Clear current cart display
    cartItemsContainer.innerHTML = '';

    let totalItemCost = 0;

    // Loop through cart and render each item
    cart.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.classList.add('cart-item');
        itemRow.innerHTML = `
            <div class="item-info">
               
                <span class="item-name">${item.name}</span>
                <span class="item-price">Rs ${item.price}</span>
                <span class="item-quantity">x${item.quantity}</span>
            </div>
            <div class="quantity-control">
                <button class="plus">+</button>
                <p>${item.quantity}</p>
                <button class="minus">-</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemRow);

        totalItemCost += item.price * item.quantity;

        // Event listeners for + and - buttons inside the cart
        const plusBtn = itemRow.querySelector('.plus');
        const minusBtn = itemRow.querySelector('.minus');

        plusBtn.addEventListener('click', () => {
            item.quantity++;
            
            updateCart();
        });

        minusBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(cart.indexOf(item), 1); // Remove item if quantity is 0
            }
            updateCart();
        });
    });

    // Update billing details
    itemTotalSpan.textContent = `Rs ${totalItemCost}`;
    subtotalSpan.textContent = `Rs ${totalItemCost + deliveryFee}`;
}
// Handle add button click
const addButtons = document.querySelectorAll('.add-button');
addButtons.forEach(function(addButton) {
    const plusButton= addButton.querySelector('.plus');
    const minusButton= addButton.querySelector('.minus');

    const qty = addButton.querySelector('p');
    let value = 0; 

    addButton.addEventListener('click', function(e) {
        addButton.style.padding="0";
        const plusButtonDisplay = getComputedStyle(plusButton).display;
        if (plusButtonDisplay === 'none') {

            plusButton.style.display = 'inline-block';
            minusButton.style.display = 'inline-block';

            value = 1; 
            qty.textContent = value;      //updates the value in dish add buttons

            const dishCard = e.target.closest('.dish-card');
            const dishName = dishCard.dataset.name;
            const dishPrice = parseInt(dishCard.dataset.price);
    
            // Check if item is already in the cart
            const existingItem = cart.find(item => item.name === dishName);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: dishName, price: dishPrice, quantity: 1 });
            }
            updateCart();}
        });   

    plusButton.addEventListener('click', (e) => {
        const dishCard = e.target.closest('.dish-card');
        const dishName = dishCard.dataset.name;
        const dishPrice = parseInt(dishCard.dataset.price);
        
        value ++; 
        qty.textContent = value;

        // Check if item is already in the cart
        const existingItem = cart.find(item => item.name === dishName);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name: dishName, price: dishPrice, quantity: 1 });
        }
        updateCart();
    });

    
    minusButton.addEventListener('click', (e) => {
        const dishCard = e.target.closest('.dish-card');
        const dishName = dishCard.dataset.name;

        // Find the item in the cart
        const existingItem = cart.find(item => item.name === dishName);
        if (existingItem && existingItem.quantity > 0) {
            existingItem.quantity--;
            value --; 
            qty.textContent = value;
            if (existingItem.quantity === 0) {
                cart.splice(cart.indexOf(existingItem), 1);
                qty.textContent = 'ADD';  
                e.stopPropagation();  
                plusButton.style.display = 'none';
                minusButton.style.display = 'none';
                addButton.style.padding="10px";
            }
        }
        updateCart();
    });

});


// javascript to view cart page
let hero = document.querySelector(".hero");
let basket = document.querySelector(".basket");
let bothcart = document.querySelectorAll(".navbar .cartt, .menu .cart");

bothcart.forEach(cart => {
    cart.addEventListener('click', () => {
        // Your action here
        console.log("Cart clicked!");
        hero.style.display="none";
        basket.style.display="flex";
        panel.style.display="none";
    });
});


// dropdown mechanism for panel menu left

let dropbtn = document.querySelectorAll('.dropbtn');
dropbtn.forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Find the specific dropdown related to this button
    let dropdownContent = this.nextElementSibling;

    // Toggle display
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  });
});







