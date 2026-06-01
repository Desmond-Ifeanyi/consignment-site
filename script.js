

/* MENU */
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  if (nav.style.display === "flex") {
    nav.style.display = "none";
  } else {
    nav.style.display = "flex";
  }
}

/* PASSWORD */
function togglePassword() {
  const password = document.getElementById("password");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

/* LOGIN */
function login() {
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");
  if (password === "Desmond12") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "home.html";
  } else {
    message.innerText = "Wrong Password";
  }
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

/* TRACK PACKAGE */
function trackPackage() {
  const id = document.getElementById("trackInput").value;
  if (id) {
    window.location.href = `track.html?id=${id}`;
  }
}

/* COPY LINK */
function copyTrackingLink(link) {
  navigator.clipboard.writeText(link).then(function () {
    alert("Tracking link copied!");
  }).catch(function () {
    // fallback for mobile browsers that block clipboard
    prompt("Copy this link:", link);
  });
}

/* COMPRESS IMAGE — shrinks gallery photos before storing */
function compressImage(base64, maxWidth, quality, callback) {
  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement("canvas");
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    const compressed = canvas.toDataURL("image/jpeg", quality);
    callback(compressed);
  };
  img.src = base64;
}

document.addEventListener("DOMContentLoaded", function () {

  /* IMAGE UPLOAD */
  let uploadedImages = [];
  const imageInput = document.getElementById("image");

  if (imageInput) {
    imageInput.addEventListener("change", function () {
      const files = Array.from(this.files);
      uploadedImages = [];

      const previewContainer = document.getElementById("previewContainer");
      previewContainer.innerHTML = '<p id="imgLoadingMsg">Loading images, please wait...</p>';

      let completed = 0;

      files.forEach(function (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          // Compress image to max 800px wide at 60% quality — keeps size small
          compressImage(e.target.result, 800, 0.6, function (compressed) {
            uploadedImages.push(compressed);

            const img = document.createElement("img");
            img.src = compressed;
            previewContainer.appendChild(img);

            completed++;
            if (completed === files.length) {
              const msg = document.getElementById("imgLoadingMsg");
              if (msg) msg.remove();
            }
          });
        };

        reader.onerror = function () {
          completed++;
          alert("Could not read an image file. Please try again.");
        };

        reader.readAsDataURL(file);
      });
    });
  }

  /* CREATE ORDER */
  const form = document.getElementById("orderForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (uploadedImages.length === 0) {
        alert("Please upload at least one image");
        return;
      }

      const totalFiles = imageInput.files ? imageInput.files.length : 0;
      if (uploadedImages.length < totalFiles) {
        alert("Images are still loading. Please wait a moment and try again.");
        return;
      }

      const trackingId = "PKG" + Math.floor(Math.random() * 9000 + 1000);

      const receiver    = document.getElementById("receiver").value;
      const address     = document.getElementById("address").value;
      const product     = document.getElementById("product").value;
      const description = document.getElementById("description").value;
      const phone       = document.getElementById("phone").value;

      const hours   = parseInt(document.getElementById("hours").value) || 0;
      const minutes = parseInt(document.getElementById("minutes").value) || 0;

      let totalSeconds = (hours * 3600) + (minutes * 60);
      if (totalSeconds <= 0) totalSeconds = 60;

      const riders = ["Kelvin Smith", "David Mark", "John Rider", "Michael Jay"];
      const randomRider = riders[Math.floor(Math.random() * riders.length)];

      // Store order data WITHOUT images in localStorage
      const order = {
        id: trackingId,
        receiver: receiver,
        address: address,
        product: product,
        description: description,
        phone: phone,
        progress: 0,
        status: "Out For Delivery",
        rider: randomRider,
        totalSeconds: totalSeconds
      };

      // Try saving order to localStorage
      try {
        localStorage.setItem(trackingId, JSON.stringify(order));
      } catch (err) {
        alert("Storage error: " + err.message + ". Try clearing your browser storage.");
        return;
      }

      // Store images separately in sessionStorage (cleared when tab closes)
      try {
        sessionStorage.setItem(trackingId + "_images", JSON.stringify(uploadedImages));
      } catch (err) {
        // If sessionStorage also fails, continue without images
        console.warn("Could not store images:", err);
      }

      const trackingLink = `${window.location.origin}${window.location.pathname.replace("create-order.html", "")}track.html?id=${trackingId}`;

      document.getElementById("result").innerHTML = `
        <div class="order-card success-card">
          <h2>Order Generated Successfully 🎉</h2>
          <br>
          <h3>Tracking ID</h3>
          <a href="${trackingLink}" class="tracking-link">${trackingId}</a>
          <br><br>
          <button onclick="copyTrackingLink('${trackingLink}')">Copy Tracking Link</button>
          <br><br>
          <a href="${trackingLink}" class="btn">Open Tracking Page</a>
        </div>
      `;

      form.reset();
      uploadedImages = [];
      document.getElementById("previewContainer").innerHTML = "";
    });
  }

  /* TRACKING PAGE */
  const params = new URLSearchParams(window.location.search);
  const trackingId = params.get("id");

  if (trackingId && document.getElementById("trackingDetails")) {
    const order = JSON.parse(localStorage.getItem(trackingId));

    if (order) {
      // Try getting images from sessionStorage first, then localStorage (old orders)
      let images = [];
      try {
        const stored = sessionStorage.getItem(trackingId + "_images");
        if (stored) images = JSON.parse(stored);
      } catch (err) {
        console.warn("Could not load images from sessionStorage");
      }

      let galleryHTML = "";
      images.forEach(function (image) {
        galleryHTML += `<img src="${image}">`;
      });

      document.getElementById("trackingDetails").innerHTML = `
        <div class="order-card">
          <h2>${order.id}</h2>
          <p><strong>Receiver:</strong> ${order.receiver}</p>
          <p><strong>Product:</strong> ${order.product}</p>
          <p><strong>Address:</strong> ${order.address}</p>
          <p><strong>Rider:</strong> ${order.rider}</p>
          <p><strong>Status:</strong> <span id="statusText">${order.status}</span></p>
          <div class="tracking-gallery">${galleryHTML}</div>
        </div>
      `;

      let progress = 0;
      let remainingTime = order.totalSeconds;
      const maxProgress = 70;
      const progressPerSecond = maxProgress / remainingTime;

      const timer = setInterval(function () {
        if (progress >= 70) {
          clearInterval(timer);
          document.getElementById("statusText").innerText = "Delivery Delayed";
          return;
        }

        progress += progressPerSecond;
        if (progress > 70) progress = 70;

        document.getElementById("progressBar").style.width = progress + "%";
        document.getElementById("progressText").innerText = Math.floor(progress) + "%";
        document.getElementById("rider").style.left = progress + "%";

        remainingTime--;

        const h = Math.floor(remainingTime / 3600);
        const m = Math.floor((remainingTime % 3600) / 60);
        const s = remainingTime % 60;

        document.getElementById("timer").innerText = `${h}h ${m}m ${s}s`;
      }, 1000);
    }
  }

  /* DASHBOARD */
  const ordersContainer = document.getElementById("ordersContainer");

  if (ordersContainer) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("PKG")) {
        const order = JSON.parse(localStorage.getItem(key));
        ordersContainer.innerHTML += `
          <div class="order-card">
            <h3>${order.id}</h3>
            <p>${order.receiver}</p>
            <p>${order.product}</p>
            <p>${order.status}</p>
          </div>
        `;
      }
    }
  }

});