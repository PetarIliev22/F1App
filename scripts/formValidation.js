const form = document.querySelector(".contact-form");
const submitButton = document.getElementById("form-submit");
const formResponse = document.getElementById("form-response");

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function showMessage(message, type = "error") {
    formResponse.textContent = message;
    formResponse.classList.remove("success");

    if (type === "success") {
        formResponse.classList.add("success");
    }

    formResponse.classList.remove("d-none");
    setTimeout(() => formResponse.classList.add("d-none"), 3000);
}

submitButton.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        return showMessage("Please fill in all fields.");
    }
    
    if (!emailRegex.test(email)) {
        return showMessage("Please enter a valid email address.");
    }

    if(email && name && message) {
        const formData = new FormData(form);
        console.log(formData);
        formData.append("access_key", "9442f64a-5688-4146-89a9-65cb54dec99d");
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                form.reset();
                showMessage("Form submitted successfully!", "success");
            } else {
                showMessage(data.message);
            }
        })
        .catch(err => console.error(err));
    }
});