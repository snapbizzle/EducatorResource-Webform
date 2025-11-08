// Form handling and validation
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("educatorForm");

  // Form submission handler
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    if (validateForm()) {
      // In a real application, you would send this data to a server
      // For now, we'll just show a success message and log the data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      console.log("Form Data:", data);

      // Show success message
      showMessage("Form saved successfully!", "success");

      // Optional: Save to localStorage for persistence
      saveToLocalStorage(data);
    }
  });

  // Form reset handler
  form.addEventListener("reset", function (e) {
    if (
      confirm("Are you sure you want to reset the form? All data will be lost.")
    ) {
      // Clear localStorage
      clearLocalStorage();
      showMessage("Form reset successfully.", "info");
    } else {
      e.preventDefault();
    }
  });

  // Load saved data on page load
  loadFromLocalStorage();

  // Add Contact functionality
  const addContactBtn = document.getElementById("addHospitalContact");
  let contactCount = 1; // Start at 1 since we already have the first contact

  addContactBtn.addEventListener("click", function () {
    contactCount++;
    addHospitalContact(contactCount);
  });

  // Add ZOLL Contact functionality
  const addZollContactBtn = document.getElementById("addZollContact");
  let zollContactCount = 2; // Start at 2 since we already have zollName1 and zollName2

  addZollContactBtn.addEventListener("click", function () {
    zollContactCount++;
    addZollContact(zollContactCount);
  });

  // Auto-save functionality (optional)
  let autoSaveTimeout;
  form.addEventListener("input", function () {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      saveToLocalStorage(data);
    }, 1000); // Auto-save after 1 second of inactivity
  });
});

// Form validation function
function validateForm() {
  const requiredFields = [
    "facilityAddress",
    "facilityPhone",
    "hospitalName",
    "hospitalEmail",
    "hospitalPhone",
  ];

  let isValid = true;
  let firstInvalidField = null;

  // Check required fields
  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();

    if (!value) {
      markFieldInvalid(field, "This field is required");
      if (!firstInvalidField) firstInvalidField = field;
      isValid = false;
    } else {
      markFieldValid(field);
    }
  });

  // Email validation - dynamically find all email inputs
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach((field) => {
    if (field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        markFieldInvalid(field, "Please enter a valid email address");
        if (!firstInvalidField) firstInvalidField = field;
        isValid = false;
      } else {
        markFieldValid(field);
      }
    }
  });

  // Phone validation - dynamically find all tel inputs
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach((field) => {
    if (field.value.trim()) {
      const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
      if (!phoneRegex.test(field.value.trim())) {
        markFieldInvalid(field, "Please enter a valid phone number");
        if (!firstInvalidField) firstInvalidField = field;
        isValid = false;
      } else {
        markFieldValid(field);
      }
    }
  });

  if (!isValid && firstInvalidField) {
    firstInvalidField.focus();
    firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return isValid;
}

// Field validation helpers
function markFieldInvalid(field, message) {
  field.style.borderColor = "#e74c3c";
  field.style.boxShadow = "0 0 5px rgba(231, 76, 60, 0.3)";

  // Remove existing error message
  const existingError = field.parentNode.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Add error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.color = "#e74c3c";
  errorDiv.style.fontSize = "0.85em";
  errorDiv.style.marginTop = "5px";
  field.parentNode.appendChild(errorDiv);
}

function markFieldValid(field) {
  field.style.borderColor = "#27ae60";
  field.style.boxShadow = "0 0 5px rgba(39, 174, 96, 0.3)";

  // Remove error message
  const errorMessage = field.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Message display function
function showMessage(message, type) {
  // Remove existing messages
  const existingMessages = document.querySelectorAll(".form-message");
  existingMessages.forEach((msg) => msg.remove());

  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.padding = "15px";
  messageDiv.style.marginBottom = "20px";
  messageDiv.style.borderRadius = "4px";
  messageDiv.style.fontWeight = "600";
  messageDiv.style.textAlign = "center";

  if (type === "success") {
    messageDiv.style.backgroundColor = "#d4edda";
    messageDiv.style.color = "#155724";
    messageDiv.style.border = "1px solid #c3e6cb";
  } else if (type === "error") {
    messageDiv.style.backgroundColor = "#f8d7da";
    messageDiv.style.color = "#721c24";
    messageDiv.style.border = "1px solid #f5c6cb";
  } else {
    messageDiv.style.backgroundColor = "#d1ecf1";
    messageDiv.style.color = "#0c5460";
    messageDiv.style.border = "1px solid #bee5eb";
  }

  // Insert at top of form
  const form = document.getElementById("educatorForm");
  form.insertBefore(messageDiv, form.firstChild);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// Local storage functions
function saveToLocalStorage(data) {
  try {
    localStorage.setItem("educatorFormData", JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

function loadFromLocalStorage() {
  try {
    const savedData = localStorage.getItem("educatorFormData");
    if (savedData) {
      const data = JSON.parse(savedData);
      Object.keys(data).forEach((key) => {
        const field = document.getElementById(key);
        if (field) {
          field.value = data[key];
        }
      });
    }
  } catch (e) {
    console.warn("Could not load from localStorage:", e);
  }
}

function clearLocalStorage() {
  try {
    localStorage.removeItem("educatorFormData");
  } catch (e) {
    console.warn("Could not clear localStorage:", e);
  }
}

// Function to add a new hospital contact
function addHospitalContact(contactNumber) {
  // Create the new contact HTML
  const contactHTML = `
    <div class="dynamic-contact" data-contact-id="${contactNumber}">
      <div class="name-title-row">
        <div class="form-group">
          <label for="hospitalName${contactNumber}">NAME</label>
          <input type="text" id="hospitalName${contactNumber}" name="hospitalName${contactNumber}" />
        </div>
        <div class="form-group">
          <label for="hospitalTitle${contactNumber}">Title/Department</label>
          <input type="text" id="hospitalTitle${contactNumber}" name="hospitalTitle${contactNumber}" />
        </div>
      </div>

      <div class="contact-grid">
        <div class="form-group">
          <label for="hospitalEmail${contactNumber}">EMAIL</label>
          <input type="email" id="hospitalEmail${contactNumber}" name="hospitalEmail${contactNumber}" />
        </div>
        <div class="form-group">
          <label for="hospitalPhone${contactNumber}">PHONE #</label>
          <input type="tel" id="hospitalPhone${contactNumber}" name="hospitalPhone${contactNumber}" />
        </div>
      </div>

      <div class="contact-actions">
        <button type="button" class="remove-contact-btn" onclick="removeHospitalContact(${contactNumber})">Remove Contact</button>
      </div>
    </div>
  `;

  // Insert the new contact before the "Add Contact" button
  const addContactContainer = document.querySelector(".add-contact-container");
  addContactContainer.insertAdjacentHTML("beforebegin", contactHTML);
}

// Function to remove a hospital contact
function removeHospitalContact(contactNumber) {
  const contactElement = document.querySelector(
    `.dynamic-contact[data-contact-id="${contactNumber}"]`
  );
  if (contactElement) {
    contactElement.remove();
    // Note: We don't decrement contactCount as IDs should remain unique
  }
}

// Function to add a new ZOLL contact
function addZollContact(contactNumber) {
  // Create the new contact HTML
  const contactHTML = `
    <div class="dynamic-contact" data-contact-id="${contactNumber}">
      <div class="form-group">
        <label for="zollTitle${contactNumber}">Title/Department</label>
        <input type="text" id="zollTitle${contactNumber}" name="zollTitle${contactNumber}" />
      </div>

      <div class="contact-grid">
        <div class="form-group">
          <label for="zollName${contactNumber}">NAME</label>
          <input type="text" id="zollName${contactNumber}" name="zollName${contactNumber}" />
        </div>
        <div class="form-group">
          <label for="zollEmail${contactNumber}">EMAIL</label>
          <input type="email" id="zollEmail${contactNumber}" name="zollEmail${contactNumber}" />
        </div>
        <div class="form-group">
          <label for="zollPhone${contactNumber}">PHONE #</label>
          <input type="tel" id="zollPhone${contactNumber}" name="zollPhone${contactNumber}" />
        </div>
      </div>

      <div class="contact-actions">
        <button type="button" class="remove-contact-btn" onclick="removeZollContact(${contactNumber})">Remove Contact</button>
      </div>
    </div>
  `;

  // Insert the new contact before the ZOLL "Add Contact" button
  const addZollContactContainer =
    document.querySelector("#addZollContact").parentElement;
  addZollContactContainer.insertAdjacentHTML("beforebegin", contactHTML);
}

// Function to remove a ZOLL contact
function removeZollContact(contactNumber) {
  const contactElement = document.querySelector(
    `.dynamic-contact[data-contact-id="${contactNumber}"]`
  );
  if (contactElement) {
    contactElement.remove();
    // Note: We don't decrement zollContactCount as IDs should remain unique
  }
}
