/*==================== SHOW MENU ====================*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  // Validate that variables exist
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      // We add the show-menu class to the div tag with the nav__menu class
      nav.classList.toggle("show-menu");
    });
  }
};
showMenu("nav-toggle", "nav-menu");

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 50;
    sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.getElementById("header");
  // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 200) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*==================== SHOW SCROLL TOP ====================*/
function scrollTop() {
  const scrollTop = document.getElementById("scroll-top");
  // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
  if (this.scrollY >= 560) scrollTop.classList.add("show-scroll");
  else scrollTop.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollTop);

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "bx-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "bx-moon" : "bx-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    darkTheme
  );
  themeButton.classList[selectedIcon === "bx-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
  origin: "top",
  distance: "30px",
  duration: 2000,
  reset: true,
});

sr.reveal(
  `.home__data, .home__img,
            .about__data, .about__img,
            .services__content, .menu__content,
            .app__data, .app__img,
            .contact__data, .contact__button,
            .footer__content`,
  {
    interval: 200,
  }
);

// ==================Firebase============================

// setting up firebase with our website

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCuBKCvDcR46rwFbjJKHnEpSv4aW3pa35Y",
  authDomain: "gfghackthon-89c75.firebaseapp.com",
  databaseURL: "https://gfghackthon-89c75-default-rtdb.firebaseio.com",
  projectId: "gfghackthon-89c75",
  storageBucket: "gfghackthon-89c75.appspot.com",
  messagingSenderId: "541382055062",
  appId: "1:541382055062:web:3ce858f246c68441dedeb7",
  measurementId: "G-189Y397X92",
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

const fetchUserData = async () => {
  const profileRef = db.collection("UserDetails");
  try {
    const querySnapshot = await profileRef
      .where("user_email", "==", user_email)
      .get();
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const documentData = doc.data();
        const userEmailElement = document.getElementById("name");
        userEmailElement.textContent =
          documentData.FirstName + " " + documentData.LastName;
      });
    } else {
      console.log("No matching documents.");
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
  }
};

window.addEventListener("load", fetchUserData);

const fetchTop3Users = async () => {
  const pointSystemRef = db.collection("PointSystem");
  const userDetailsRef = db.collection("UserDetails"); 

  try {
    const querySnapshot = await pointSystemRef
      .orderBy("points", "desc")
      .limit(3)
      .get();

    const top3Users = [];
  
    for (const doc of querySnapshot.docs) {
      const documentData = doc.data();
     
      const userQuerySnapshot = await userDetailsRef
        .where("user_email", "==", documentData.user_email)
        .get();
      if (!userQuerySnapshot.empty) {
        userQuerySnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          console.log(userData.FirstName + " " + userData.LastName);
          top3Users.push({
            userName: userData.FirstName + " " + userData.LastName,
            points: documentData.points,
          });
        });
      }
    }
    const firstposname = document.getElementById("firstposname");
    const firstposPoints = document.getElementById("firstposPoints");
    const secondposname = document.getElementById("secondposname");
    const secondposPoints = document.getElementById("secondposPoints");
    const thirdposname = document.getElementById("thirdposname");
    const thirdposPoints = document.getElementById("thirdposPoints");
    firstposname.textContent = top3Users[0].userName;
    firstposPoints.textContent = top3Users[0].points;
    secondposname.textContent = top3Users[1].userName;
    secondposPoints.textContent = top3Users[1].points;
    thirdposname.textContent = top3Users[2].userName;
    thirdposPoints.textContent = top3Users[2].points;
  } catch (error) {
    console.error("Error fetching top 3 users:", error);
    return [];
  }
};

window.addEventListener("load", fetchTop3Users);