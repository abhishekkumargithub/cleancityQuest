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

// SIGN UP PAGE================================================================
const signUp = async() => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const FirstName = document.getElementById("firstname").value;
  const LastName = document.getElementById("lastname").value;
  const phoneNumber = document.getElementById("phoneno").value;
  

  // firebase code
  await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((result) => {
      // Signed in
      const data = {
        user_email: email, // Replace with the user's email
        points: 0,
      };
      db.collection("PointSystem")
        .add(data)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
        //==========
       
        //=========
        const data2 = {
          FirstName : FirstName, 
          LastName : LastName, 
          PhoneNumber : phoneNumber,
          user_email: email,
        }

        db.collection("UserDetails")
        .add(data2)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      alert("You are Signed Up");
      
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      // ..
    });

    window.location = "/login";

   
};
//=============




// LOGIN PAGE================================================================
const signIn = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      // Signed in
      alert("You are Signed In");

      // Send the user's email to the server
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      window.location= "/";
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
};
