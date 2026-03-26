// ================= NAVBAR + USER =================
function login() {
    const username = document.getElementById("username").value;

    if (username === "") {
        alert("Enter your name");
        return;
    }

    localStorage.setItem("user", username);
    showUser();
}

function logout() {
    localStorage.removeItem("user");
    location.reload();
}

function showUser() {
    const user = localStorage.getItem("user");

    if (user) {
        const loginBox = document.getElementById("loginBox");
        const userBox = document.getElementById("userBox");

        if (loginBox) loginBox.style.display = "none";
        if (userBox) userBox.style.display = "block";

        const nameDisplay = document.getElementById("userNameDisplay");
        if (nameDisplay) nameDisplay.innerText = user;
    }
}

function updateNavbar() {
    const user = localStorage.getItem("user");
    const link = document.getElementById("accountLink");

    if (user && link) {
        link.textContent = "Hello " + user + " 👋";
    }
}

window.onload = function () {
    showUser();
    updateNavbar();
};

// ================= SUBSCRIPTION =================
function selectPlan(plan) {
    localStorage.setItem("selectedPlan", plan);
    const text = document.getElementById("selectedPlanText");
    if (text) text.innerText = "You selected: " + plan;
    openPopup();
}

function confirmPayment() {
    const plan = localStorage.getItem("selectedPlan");
    localStorage.setItem("userPlan", plan);

    alert("✅ Payment successful for " + plan + " 🎉");

    closePopup();
    location.href = "account.html";
}

function openPopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "flex";
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "none";
}

// ================= MEAL SELECTION =================
let selectedMeals = [];

function selectMeal(mealName, element) {
    if (selectedMeals.includes(mealName)) {
        selectedMeals = selectedMeals.filter(m => m !== mealName);
        element.classList.remove("selected");
    } else {
        selectedMeals.push(mealName);
        element.classList.add("selected");
    }

    localStorage.setItem("meals", JSON.stringify(selectedMeals));
}

function goToSubscription() {
    if (selectedMeals.length === 0) {
        alert("Select at least one meal");
        return;
    }
    location.href = "subscription.html";
}

// ================= TOAST =================
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = "show";

    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 4000);
}

// ================= ONE-TIME ORDER + WHATSAPP =================
const checkoutBtn = document.getElementById('checkoutBtn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {

        const locationInput = document.getElementById('locationInput');
        const location = locationInput ? locationInput.value.trim() : "";

        if (selectedMeals.length === 0) {
            showToast("Please select at least one meal!");
            return;
        }

        if (location === "") {
            showToast("Enter your delivery location!");
            return;
        }

        // Build order summary
        let summary = selectedMeals.join(", ");

        // WhatsApp number (CHANGE THIS TO YOUR NUMBER)
        let phoneNumber = "26778733506"; 

        let message = `Hello Uni-Eats! I would like to order: ${summary}. Deliver to: ${location}. I will pay on delivery.`;

        let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(whatsappURL, "_blank");

        // Show confirmation toast
        showToast(`✅ Order placed! Food coming to ${location} in a few minutes. Pay on delivery.`);

        // Reset
        selectedMeals = [];
        locationInput.value = "";

        document.querySelectorAll(".meal-item").forEach(item => {
            item.classList.remove("selected");
        });
    });
}
