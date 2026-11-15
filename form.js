const form_errors = [];

function validateName(fieldID) {
    const input = document.getElementById(fieldID);
    const state = input.validity;

    input.setCustomValidity("");

    if (state.valueMissing) {
        input.setCustomValidity("Please enter a valid name (max 15 characters).");
    } else if (state.tooLong) {
        input.setCustomValidity("Too many characters (max 15 characters).");
    } else if (state.tooShort) {
        input.setCustomValidity("Too few characters (min 2 characters).");
    } 

    return displayError(input);
}

function validateEmail(fieldID) {
    const input = document.getElementById(fieldID);
    const state = input.validity;

    input.setCustomValidity("");

    if (state.valueMissing) {
        input.setCustomValidity("Please enter a valid email (max 20 characters).");
    } else if (state.typeMismatch) {
        input.setCustomValidity("Please enter a valid email with the form you@email");
    } else if (state.tooLong) {
        input.setCustomValidity("Too many characters (max 20 characters).");
    } else if (state.tooShort) {
        input.setCustomValidity("Too few characters (min 10 characters).");
    }

    return displayError(input);
}

function validateText(fieldID) {
    const textarea = document.getElementById(fieldID);
    const state = textarea.validity;

    textarea.setCustomValidity("");

    if (state.valueMissing) {
        textarea.setCustomValidity("Please enter a valid comment (max 150 characters).");
    } else if (state.tooLong) {
        textarea.setCustomValidity("Too many characters (max 150 characters).");
    } else if (state.tooShort) {
        textarea.setCustomValidity("Too few characters (min 5 characters).");
    } 

    return displayError(textarea);
}

function displayError(input) {
    const errorElement = document.querySelector(
        `[data-error-for="${input.id}"]`
    );

    const isValid = input.validity.valid;

    errorElement.textContent = isValid
        ? ""
        : input.validationMessage;

    input.classList.toggle("invalid", !isValid);
    input.classList.toggle("valid", isValid);

    // Update form error array
    const existingIndex = form_errors.findIndex(
        error => error.field === input.id
    );

    if (!isValid) {
        const entry = {
            field: input.id,
            message: input.validationMessage
        };

        const exists = form_errors.some(error =>
            error.field === entry.field &&
            error.message === entry.message
        );

        if (!exists) {
            form_errors.push(entry);
        }
    }

    /*
    if (!isValid) {
        const entry = {
            field: input.id,
            message: input.validationMessage
        };

        console.log(entry);
        //form_errors.push(entry);

        

    } else if (existingIndex !== -1) {
        form_errors.splice(existingIndex, 1);
    }

    console.log(form_errors);
    */

    

    return isValid;
}

document.querySelector("form").addEventListener("submit", (e) => {

    document.getElementById("form-errors").value =
        JSON.stringify(form_errors);
    console.log(document.getElementById("form-errors").value);
});


//Characters remaining
function charactersRemaining(fieldID) {
    const input = document.getElementById(fieldID);

    return input.maxLength - input.value.length;
}


// Create live character counter
function createCharacterCounter(fieldID) {
    const input = document.getElementById(fieldID);

    // Create counter element
    const counter = document.createElement("p");

    counter.classList.add("character-counter");

    // Insert counter after textarea
    input.insertAdjacentElement("afterend", counter);

    // Update counter
    function updateCounter() {
        counter.textContent =
            `${charactersRemaining(fieldID)} characters remaining`;
    }

    // Initial count
    updateCounter();

    // Update as user types
    input.addEventListener("input", updateCounter);
}

// Initialize counter
createCharacterCounter("name");
createCharacterCounter("email");
createCharacterCounter("comments");






const fields = document.querySelectorAll(
    "#name, #email, #comments"
);

fields.forEach(field => {
    field.addEventListener("blur", () => {
        if (field.id === "name") validateName(field.id);
        if (field.id === "email") validateEmail(field.id);
        if (field.id === "comments") validateText(field.id);
    });
});

fields.forEach(field => {
    field.addEventListener("input", () => {
        if (field.classList.contains("invalid")) {
            if (field.id === "name") validateName(field.id);
            if (field.id === "email") validateEmail(field.id);
            if (field.id === "comments") validateText(field.id);
        }
    });
});






/*

const form = document.querySelector("form");
const form_errors = [];

const fieldsToTrack = ["name", "email", "comments"];

// Update error history whenever a field is checked
function updateFormErrors(fieldID) {
    const input = document.getElementById(fieldID);

    const existingIndex = form_errors.findIndex(
        error => error.field === fieldID
    );

    if (!input.validity.valid) {

        const entry = {
            field: fieldID,
            message: input.validationMessage
        };

        if (existingIndex === -1) {
            form_errors.push(entry);
        } else {
            form_errors[existingIndex].message =
                input.validationMessage;
        }

    } else if (existingIndex !== -1) {

        form_errors.splice(existingIndex, 1);
    }

    document.getElementById("form-errors").value =
        JSON.stringify(form_errors);
}

form.addEventListener("invalid", (e) => {
    updateFormErrors(e.target);
}, true);


// Track typing and leaving fields
fieldsToTrack.forEach(fieldID => {
    const input = document.getElementById(fieldID);

    input.addEventListener("input", () => {
        if (fieldID === "name") validateName(fieldID);
        if (fieldID === "email") validateEmail(fieldID);
        if (fieldID === "comments") validateText(fieldID);

        updateFormErrors(fieldID);
    });

    input.addEventListener("blur", () => {
        if (fieldID === "name") validateName(fieldID);
        if (fieldID === "email") validateEmail(fieldID);
        if (fieldID === "comments") validateText(fieldID);

        updateFormErrors(fieldID);
    });
});

*/






/*
// Form Error History
const form_errors = [];
const form = document.querySelector("#withJSForm");

let submissionAttemptActive = false;

let attemptErrors = new Set();

form.addEventListener("invalid", (event) => {

    if (!submissionAttemptActive) return;

    const field = event.target;

    if (!attemptErrors.has(field.id)) {

        attemptErrors.add(field.id);

        form_errors.push({
            field: field.id,
            error: field.validationMessage
        });

    }

}, true);

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    submissionAttemptActive = true;
    attemptErrors = new Set();

    // Update custom validation messages
    fields.forEach(field => {
        if (field.id === "name") validateName(field.id);
        if (field.id === "email") validateEmail(field.id);
        if (field.id === "comments") validateText(field.id);
    });

    // Trigger invalid events
    const isValid = form.checkValidity();

    submissionAttemptActive = false;

    if (!isValid) {
        form.querySelector(".invalid")?.focus();

        console.log("Current attempt errors:", [...attemptErrors]);
        console.log("Complete error history:", form_errors);

        return;
    }

    // Serialize complete error history
    const serializedErrors = JSON.stringify(form_errors);

    // Populate hidden field
    document.querySelector("#form-errors").value =
        serializedErrors;

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const responseText = await response.text();

        console.log("Server response:", responseText);

        console.log(
            "Error history received:",
            responseText.includes(serializedErrors)
        );

        if (response.redirected) {
            window.location.href = response.url;
        }

    } catch (error) {
        console.error("Form submission failed:", error);
    }
});
*/


/*

//Form Error History
const form_errors = [];
const form = document.querySelector("#withJSForm");

let submissionAttemptActive = false;

let attemptErrors = new Set();

form.addEventListener("invalid", (event) => {
    if (!submissionAttemptActive) return;

    const field = event.target;

    if (!attemptErrors.has(field.id)) {
        attemptErrors.add(field.id);
        form_errors.push(field.id);
    }

}, true);

*/



/*
const form = document.querySelector("#withJSForm");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let formIsValid = true;

    fields.forEach(field => {
        let isValid;

        if (field.id === "name") {
            isValid = validateName(field.id);
        } else if (field.id === "email") {
            isValid = validateEmail(field.id);
        } else if (field.id === "comments") {
            isValid = validateText(field.id);
        }

        if (!isValid) {
            formIsValid = false;
        }
    });

    if (!formIsValid) {
        form.querySelector(".invalid")?.focus();
        return;
    }

    console.log("All fields are valid!");

    // Continue with form submission here.
});
*/
