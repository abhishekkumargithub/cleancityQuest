// setting up firebase with our website

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCuBKCvDcR46rwFbjJKHnEpSv4aW3pa35Y",
    authDomain: "gfghackthon-89c75.firebaseapp.com",
    databaseURL: "https://gfghackthon-89c75-default-rtdb.firebaseio.com",
    projectId: "gfghackthon-89c75",
    storageBucket: "gfghackthon-89c75.appspot.com",
    messagingSenderId: "541382055062",
    appId: "1:541382055062:web:3ce858f246c68441dedeb7",
    measurementId: "G-189Y397X92"
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
          const userName = document.getElementById("name");
          userName.textContent =
            documentData.FirstName + " " + documentData.LastName;
        });
      } else {
        console.log("No matching documents.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  window.addEventListener('load', fetchUserData);
  const fetchProfileData = async () => {
    const profileRef = db.collection("PointSystem");
    try {
      const querySnapshot = await profileRef.where("user_email", "==", user_email).get();
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const documentData = doc.data();
          const userEmailElement = document.getElementById("userEmail");
          const pointsElement = document.getElementById("points");
          const rankElement = document.getElementById("rank");
            
          userEmailElement.textContent = documentData.user_email; 
          pointsElement.textContent = documentData.points; 
            
          if (documentData.points < 100) {
            rankElement.textContent = "Beginner"
          } else if (documentData.points >= 100 && documentData.points < 500) {
            rankElement.textContent = "Intermediate"
          } else {
            rankElement.textContent = "Pro"
          }

          
        });
      } else {
        console.log("No matching documents.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  

window.addEventListener('load', fetchProfileData);
