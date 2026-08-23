document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Contact form: submit via fetch so we can show an inline
  // success/error message instead of redirecting to Formspree.
  var form = document.getElementById("contact-form");
  if (form) {
    var submitBtn = document.getElementById("contact-submit-btn");
    var successEl = document.getElementById("form-success");
    var errorEl = document.getElementById("form-error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      successEl.hidden = true;
      errorEl.hidden = true;
      submitBtn.disabled = true;
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            successEl.hidden = false;
            form.reset();
          } else {
            return response.json().then(function (data) {
              throw new Error(
                data && data.errors
                  ? data.errors.map(function (err) { return err.message; }).join(", ")
                  : "Submission failed"
              );
            });
          }
        })
        .catch(function () {
          errorEl.hidden = false;
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }
});
