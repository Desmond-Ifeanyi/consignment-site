
/* =========================================
   MENU
========================================= */

function toggleMenu() {

  const nav =
    document.getElementById(
      "navLinks"
    );

  if (!nav) return;

  if (
    nav.style.display === "flex"
  ) {

    nav.style.display = "none";

  } else {

    nav.style.display = "flex";

  }

}

/* =========================================
   PASSWORD TOGGLE
========================================= */

function togglePassword() {

  const password =
    document.getElementById(
      "password"
    );

  if (!password) return;

  if (
    password.type === "password"
  ) {

    password.type = "text";

  } else {

    password.type = "password";

  }

}

/* =========================================
   LOGIN
========================================= */

function login() {

  const password =
    document.getElementById(
      "password"
    );

  const message =
    document.getElementById(
      "loginMessage"
    );

  if (!password) return;

  if (
    password.value ===
    "Desmond12"
  ) {

    localStorage.setItem(
      "loggedIn",
      "true"
    );

    window.location.href =
      "home.html";

  } else {

    if (message) {

      message.innerText =
        "Wrong Password";

    }

  }

}

/* =========================================
   LOGOUT
========================================= */

function logout() {

  localStorage.removeItem(
    "loggedIn"
  );

  window.location.href =
    "login.html";

}

/* =========================================
   TRACK PACKAGE
========================================= */

function trackPackage() {

  const input =
    document.getElementById(
      "trackInput"
    );

  if (!input) return;

  const id =
    input.value.trim();

  if (id) {

    window.location.href =
      `track.html?id=${id}`;

  }

}

/* =========================================
   MULTIPLE IMAGE UPLOAD
========================================= */

const imageInput =
  document.getElementById(
    "image"
  );

let uploadedImages = [];

let imagesReady = false;

if (imageInput) {

  imageInput.addEventListener(
    "change",
    function () {

      const files =
        Array.from(this.files);

      uploadedImages = [];

      imagesReady = false;

      const previewContainer =
        document.getElementById(
          "previewContainer"
        );

      if (previewContainer) {

        previewContainer.innerHTML =
          "";

      }

      if (files.length === 0) {

        return;

      }

      let completed = 0;

      files.forEach(file => {

        const reader =
          new FileReader();

        reader.onload =
          function (e) {

            uploadedImages.push(
              e.target.result
            );

            if (
              previewContainer
            ) {

              const img =
                document.createElement(
                  "img"
                );

              img.src =
                e.target.result;

              previewContainer.appendChild(
                img
              );

            }

            completed++;

            if (
              completed ===
              files.length
            ) {

              imagesReady =
                true;

            }

          };

        reader.readAsDataURL(
          file
        );

      });

    }

  );

}

/* =========================================
   CREATE ORDER
========================================= */

const form =
  document.getElementById(
    "orderForm"
  );

if (form) {

  form.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();

      if (
        uploadedImages.length === 0
      ) {

        alert(
          "Upload at least one image"
        );

        return;

      }

      if (!imagesReady) {

        alert(
          "Images still loading"
        );

        return;

      }

      const trackingId =
        "PKG" +
        Math.floor(
          Math.random() *
          9000 +
          1000
        );

      const receiver =
        document.getElementById(
          "receiver"
        )?.value || "";

      const address =
        document.getElementById(
          "address"
        )?.value || "";

        // =-----====
        const city =
        document.getElementById(
          "city"
        )?.value || "";

        const houseAddress =
        document.getElementById(
          "houseAddress"
        )?.value || "";
// =--======
      const product =
        document.getElementById(
          "product"
        )?.value || "";

      const description =
        document.getElementById(
          "description"
        )?.value || "";

      const phone =
        document.getElementById(
          "phone"
        )?.value || "";

      const fromCountry =
        document.getElementById(
          "fromCountry"
        )?.value || "nigeria";

      const toCountry =
        document.getElementById(
          "toCountry"
        )?.value || "usa";

      const hours =
        parseInt(
          document.getElementById(
            "hours"
          )?.value
        ) || 0;

      const minutes =
        parseInt(
          document.getElementById(
            "minutes"
          )?.value
        ) || 0;

      let totalSeconds =
        (hours * 3600) +
        (minutes * 60);

      if (
        totalSeconds <= 0
      ) {

        totalSeconds = 60;

      }

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

        city: city,

        houseAddress: houseAddress,

        product: product,

        description: description,

        phone: phone,

        fromCountry:
          fromCountry,

        toCountry:
          toCountry,

        images:
          uploadedImages,

        status:
          "Out For Delivery",

        progress: 0,

        rider:
          randomRider,

        totalSeconds:
          totalSeconds

      };

      localStorage.setItem(
        trackingId,
        JSON.stringify(order)
      );

      const trackingLink =
        `track.html?id=${trackingId}`;

      const result =
        document.getElementById(
          "result"
        );

      if (result) {

        result.innerHTML = `

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

      }

      form.reset();

      uploadedImages = [];

      imagesReady = false;

      const previewContainer =
        document.getElementById(
          "previewContainer"
        );

      if (previewContainer) {

        previewContainer.innerHTML =
          "";

      }

    }

  );

}

/* =========================================
   COPY LINK
========================================= */

function copyTrackingLink(link) {

  const fullLink =
    `${window.location.origin}/${link}`;

  navigator.clipboard.writeText(
    fullLink
  );

  alert(
    "Tracking link copied!"
  );

}

/* =========================================
   TRACKING PAGE
========================================= */

const params =
  new URLSearchParams(
    window.location.search
  );

const trackingId =
  params.get("id");

const trackingDetails =
  document.getElementById(
    "trackingDetails"
  );

if (
  trackingId &&
  trackingDetails
) {

  const saved =
    localStorage.getItem(
      trackingId
    );

  if (saved) {

    const order =
      JSON.parse(saved);

    let galleryHTML = "";

    if (
      order.images &&
      order.images.length > 0
    ) {

      order.images.forEach(
        image => {

          galleryHTML += `
            <img src="${image}">
          `;

        }
      );

    }

    trackingDetails.innerHTML = `

    <div class="order-card">

      <h2>${order.id}</h2>

      <p>
        <strong>Receiver:</strong>
        ${order.receiver}
        <p>
        <strong>Delivery Address:</strong>
        ${order.address}
        </p>
        
        <p>
        <strong>City:</strong>
        ${order.city}
        </p>
        
        <p>
        <strong>House Address:</strong>
        ${order.houseAddress}
        </p>
      </p>
      <p>
        <strong>From:</strong>
        ${order.fromCountry}
      </p>

      <p>
        <strong>To:</strong>
        ${order.toCountry}
      </p>

      <p>
        <strong>Rider:</strong>
        ${order.rider}
      </p>

      <p>
        <strong>Status:</strong>

        <span id="statusText">
          Out For Delivery
        </span>

      </p>

      <div class="tracking-gallery">

        ${galleryHTML}

      </div>

    </div>

    `;

    let progress = 0;

    let remainingTime =
      order.totalSeconds || 60;

    const maxProgress = 70;

    const progressPerSecond =
      maxProgress /
      remainingTime;

    const progressBar =
      document.getElementById(
        "progressBar"
      );

    const timerText =
      document.getElementById(
        "timer"
      );

    const interval =
      setInterval(() => {

        if (
          progress >= 70
        ) {

          clearInterval(
            interval
          );

          const status =
            document.getElementById(
              "statusText"
            );

          if (status) {

            status.innerText =
              "Delivery Delayed";

          }

          return;

        }

        progress +=
          progressPerSecond;

        if (
          progress > 70
        ) {

          progress = 70;

        }

        if (progressBar) {

          progressBar.style.width =
            progress + "%";

        }

        if(progress < 70){

          remainingTime--;

        }

        const hours =
          Math.floor(
            remainingTime /
            3600
          );

        const minutes =
          Math.floor(
            (
              remainingTime %
              3600
            ) / 60
          );

        const seconds =
          remainingTime % 60;

        if (timerText) {

          timerText.innerText =
            `${hours}h ${minutes}m ${seconds}s`;

        }

      }, 1000);

/* =========================================
   REAL LIVE TRACKING MAP
========================================= */

if (
  document.getElementById("map") &&
  typeof L !== "undefined"
) {

  /* COUNTRY COORDINATES */

  const countryCoords = {

    nigeria:[6.5244,3.3792],
    usa:[40.7128,-74.0060],
    canada:[43.6510,-79.3470],
    mexico:[19.4326,-99.1332],
    brazil:[-23.5505,-46.6333],
    argentina:[-34.6037,-58.3816],
    uk:[51.5074,-0.1278],
    france:[48.8566,2.3522],
    germany:[52.5200,13.4050],
    italy:[41.9028,12.4964],
    spain:[40.4168,-3.7038],
    portugal:[38.7223,-9.1393],
    netherlands:[52.3676,4.9041],
    belgium:[50.8503,4.3517],
    sweden:[59.3293,18.0686],
    norway:[59.9139,10.7522],
    finland:[60.1699,24.9384],
    denmark:[55.6761,12.5683],
    switzerland:[46.9480,7.4474],
    austria:[48.2082,16.3738],
    poland:[52.2297,21.0122],
    ukraine:[50.4501,30.5234],
    russia:[55.7558,37.6173],
    turkey:[41.0082,28.9784],
    india:[28.6139,77.2090],
    china:[39.9042,116.4074],
    japan:[35.6762,139.6503],
    southkorea:[37.5665,126.9780],
    australia:[-33.8688,151.2093],
    newzealand:[-36.8485,174.7633],
    southafrica:[-26.2041,28.0473],
    egypt:[30.0444,31.2357],
    kenya:[-1.2921,36.8219],
    ghana:[5.6037,-0.1870],
    morocco:[33.5731,-7.5898],
    saudiarabia:[24.7136,46.6753],
    uae:[25.2048,55.2708]

  };

  /* START + DESTINATION */

  const fromCoords =
    countryCoords[
      order.fromCountry
    ] || [6.5244,3.3792];

  const toCoords =
    countryCoords[
      order.toCountry
    ] || [40.7128,-74.0060];

  /* CREATE MAP */

  const map = L.map("map", {

    zoomControl:true,

    scrollWheelZoom:true,

    dragging:true,

    touchZoom:true,

    doubleClickZoom:true,

    boxZoom:true,

    keyboard:true

  });

  /* DEEP STREET MAP */

  L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

      attribution:
      "© OpenStreetMap",

      maxZoom:19

    }

  ).addTo(map);

  /* START MARKER */

  const startMarker =
    L.marker(fromCoords)
    .addTo(map)
    .bindPopup(
      "Package Origin"
    );

  /* DESTINATION MARKER */

  const endMarker =
    L.marker(toCoords)
    .addTo(map)
    .bindPopup(
      "Destination"
    );

  /* ROUTE LINE */

  const routeLine =
    L.polyline(

      [

        fromCoords,

        toCoords

      ],

      {

        color:"orange",

        weight:5

      }

    ).addTo(map);

  map.fitBounds(
    routeLine.getBounds()
  );

  /* RIDER ICON */

  const riderIcon =
    L.icon({

      iconUrl:
      "https://cdn-icons-png.flaticon.com/512/684/684908.png",

      iconSize:[45,45],

      iconAnchor:[22,22]

    });

  /* RIDER MARKER */

  const riderMarker =
    L.marker(

      fromCoords,

      {

        icon:riderIcon

      }

    ).addTo(map);

  /* =========================================
     MOVE RIDER WITH PROGRESS BAR
  ========================================= */

  const moveInterval =
    setInterval(() => {

      /* STOP AT 70% */

      if (progress >= 70) {

        clearInterval(
          moveInterval
        );

        return;

      }

      /* CALCULATE MOVEMENT */

      const movePercent =
        progress / 70;

      /* CURRENT POSITION */

      const currentLat =

        fromCoords[0] +

        (
          (
            toCoords[0] -
            fromCoords[0]
          ) *

          movePercent
        );

      const currentLng =

        fromCoords[1] +

        (
          (
            toCoords[1] -
            fromCoords[1]
          ) *

          movePercent
        );

      /* MOVE RIDER */

      riderMarker.setLatLng([

        currentLat,

        currentLng

      ]);

      /* FOLLOW RIDER */

      map.panTo(

        [

          currentLat,

          currentLng

        ],

        {

          animate:true,

          duration:1

        }

      );

    },1000);

}



  } else {

    trackingDetails.innerHTML = `

    <div class="order-card">

      <h2>
        Tracking ID Not Found
      </h2>

    </div>

    `;

  }

}





/* =========================================
   DASHBOARD
========================================= */

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

          <h3>${order.id}</h3>

          <p>${order.receiver}</p>

          <p>${order.product}</p>

          <p>${order.status}</p>

        </div>

        `;

    }

  }

}
