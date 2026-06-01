function toggleMenu() {

  const nav =
    document.getElementById(
      "navLinks"
    );

  if (nav.style.display === "flex") {

    nav.style.display = "none";

  } else {

    nav.style.display = "flex";

  }

}

/* PASSWORD TOGGLE */

function togglePassword() {

  const password =
    document.getElementById(
      "password"
    );

  if (password.type === "password") {

    password.type = "text";

  } else {

    password.type = "password";

  }

}

/* LOGIN */

function login() {

  const password =
    document.getElementById(
      "password"
    ).value;

  const message =
    document.getElementById(
      "loginMessage"
    );

  if (password === "Desmond12") {

    localStorage.setItem(
      "loggedIn",
      "true"
    );

    window.location.href =
      "index.html";

  } else {

    message.innerText =
      "Wrong Password";

  }

}

/* LOGOUT */

function logout() {

  localStorage.removeItem(
    "loggedIn"
  );

  window.location.href =
    "login.html";

}

/* TRACK PACKAGE */

function trackPackage() {

  const id =
    document.getElementById(
      "trackInput"
    ).value;

  if (id) {

    window.location.href =
      `track.html?id=${id}`;

  }

}

/* MULTIPLE IMAGE PREVIEW */

const imageInput =
  document.getElementById(
    "image"
  );

let uploadedImages = [];

if (imageInput) {

  imageInput.addEventListener(
    "change",
    function () {

      const files =
        Array.from(this.files);

      uploadedImages = [];

      const previewContainer =
        document.getElementById(
          "previewContainer"
        );

      previewContainer.innerHTML = "";

      files.forEach(file => {

        const reader =
          new FileReader();

        reader.onload = function (e) {

          uploadedImages.push(
            e.target.result
          );

          const img =
            document.createElement(
              "img"
            );

          img.src =
            e.target.result;

          previewContainer.appendChild(
            img
          );

        };

        reader.readAsDataURL(file);

      });

    }

  );

}

/* CREATE ORDER */

const form =
  document.getElementById(
    "orderForm"
  );

if (form) {

  form.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();

      const trackingId =
        "PKG" +
        Math.floor(
          Math.random() * 9000 + 1000
        );

      const receiver =
        document.getElementById(
          "receiver"
        ).value;

      const address =
        document.getElementById(
          "address"
        ).value;

      const product =
        document.getElementById(
          "product"
        ).value;

      const description =
        document.getElementById(
          "description"
        ).value;

      const phone =
        document.getElementById(
          "phone"
        ).value;

      const hours =
        parseInt(
          document.getElementById(
            "hours"
          ).value
        ) || 0;

      const minutes =
        parseInt(
          document.getElementById(
            "minutes"
          ).value
        ) || 0;

      const totalSeconds =
        (hours * 3600) +
        (minutes * 60);

      const riders = [

        "Kelvin Smith",

        "David Mark",

        "John Rider",

        "Michael Jay"

      ];

      const randomRider =
        riders[
          Math.floor(
            Math.random() *
            riders.length
          )
        ];

      const order = {

        id: trackingId,

        receiver: receiver,

        address: address,

        product: product,

        description: description,

        phone: phone,

        images: uploadedImages,

        progress: 0,

        status:
          "Order Received",

        rider: randomRider,

        totalSeconds:
          totalSeconds

      };

      localStorage.setItem(
        trackingId,
        JSON.stringify(order)
      );

      const trackingLink =
        `track.html?id=${trackingId}`;

      document.getElementById(
        "result"
      ).innerHTML = `

      <div class="order-card success-card">

        <h2>
          Order Generated Successfully 🎉
        </h2>

        <br>

        <h3>
          Tracking ID
        </h3>

        <a
          href="${trackingLink}"
          class="tracking-link"
        >
          ${trackingId}
        </a>

        <br><br>

        <button
          onclick="copyTrackingLink('${trackingLink}')"
        >
          Copy Tracking Link
        </button>

        <br><br>

        <a
          href="${trackingLink}"
          class="btn"
        >
          Open Tracking Page
        </a>

      </div>

      `;

      form.reset();

      const previewContainer =
        document.getElementById(
          "previewContainer"
        );

      if (previewContainer) {

        previewContainer.innerHTML = "";

      }

    }

  );

}

/* COPY LINK */

function copyTrackingLink(link) {

  navigator.clipboard.writeText(

    window.location.origin +
    "/" +
    link

  );

  alert(
    "Tracking link copied!"
  );

}

/* TRACKING PAGE */

const params =
  new URLSearchParams(
    window.location.search
  );

const trackingId =
  params.get("id");

if (
  trackingId &&
  document.getElementById(
    "trackingDetails"
  )
) {

  const order =
    JSON.parse(
      localStorage.getItem(
        trackingId
      )
    );

  if (order) {

    let galleryHTML = "";

    order.images.forEach(
      image => {

        galleryHTML += `

        <img src="${image}">

        `;

      }
    );

    document.getElementById(
      "trackingDetails"
    ).innerHTML = `

    <div class="order-card">

      <h2>
        ${order.id}
      </h2>

      <p>
        <strong>
          Receiver:
        </strong>

        ${order.receiver}
      </p>

      <p>
        <strong>
          Product:
        </strong>

        ${order.product}
      </p>

      <p>
        <strong>
          Address:
        </strong>

        ${order.address}
      </p>

      <p>
        <strong>
          Rider:
        </strong>

        ${order.rider}
      </p>

      <p>
        <strong>
          Status:
        </strong>

        <span id="statusText">
          ${order.status}
        </span>
      </p>

      <div class="tracking-gallery">
        ${galleryHTML}
      </div>

    </div>

    `;

    const statuses = [

      // "Order Received",

      // "Preparing Package",

      // "Rider Assigned",

      // "Package Picked Up",

      // "In Transit",

      "Out For Delivery"

    ];



    
    let progress = 0;

    let statusIndex = 0;

    let remainingTime =
      order.totalSeconds;

    const maxProgress = 70;

    const progressPerSecond =
      maxProgress / remainingTime;

    const timer =
      setInterval(() => {

        if (progress >= 70) {

          clearInterval(timer);

          document.getElementById(
            "statusText"
          ).innerText =
            "Delivery Delayed";

          return;

        }

        progress +=
          progressPerSecond;

        if (progress > 70) {

          progress = 70;

        }

        document.getElementById(
          "progressBar"
        ).style.width =
          progress + "%";

        document.getElementById(
          "progressText"
        ).innerText =
          Math.floor(progress) +
          "%";

        document.getElementById(
          "rider"
        ).style.left =
          progress + "%";

        remainingTime--;

        const hours =
          Math.floor(
            remainingTime / 3600
          );

        const minutes =
          Math.floor(
            (remainingTime % 3600) / 60
          );

        const seconds =
          remainingTime % 60;

        document.getElementById(
          "timer"
        ).innerText =

          `${hours}h ${minutes}m ${seconds}s`;

        // const stageProgress =
        //   Math.floor(
        //     progress / 12
        //   );

        // if (
        //   stageProgress !==
        //   statusIndex
        // ) {

        //   statusIndex =
        //     stageProgress;

        //   if (
        //     statusIndex >=
        //     statuses.length
        //   ) {

        //     statusIndex =
        //       statuses.length - 1;

        //   }

        //   document.getElementById(
        //     "statusText"
        //   ).innerText =

        //     statuses[
        //       statusIndex
        //     ];

        // }
        document.getElementById(
  "statusText"
).innerText =
  "Out For Delivery";

      }, 1000);

  }

}




/* DASHBOARD */

const ordersContainer =
  document.getElementById(
    "ordersContainer"
  );

if (ordersContainer) {

  for (
    let i = 0;
    i < localStorage.length;
    i++
  ) {

    const key =
      localStorage.key(i);

    if (
      key.startsWith("PKG")
    ) {

      const order =
        JSON.parse(
          localStorage.getItem(
            key
          )
        );

      ordersContainer.innerHTML += `

      <div class="order-card">

        <h3>
          ${order.id}
        </h3>

        <p>
          ${order.receiver}
        </p>

        <p>
          ${order.product}
        </p>

        <p>
          ${order.status}
        </p>

      </div>

      `;

    }

  }

}

