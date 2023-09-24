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
  
  // Sign up function
  const signUp = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password)
    // firebase code
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in 
            alert("You are Signed Up")
            window.location.href = '/';

            // ...
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message)
            // ..
        });
  }
  
  // Sign In function
  const signIn = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in
            alert("You are Signed In");

            // Send the user's email to the server
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data); // You can handle the response data here
            })
            .catch(error => {
                console.error('Error:', error);
            });

            window.location.href = '/';
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message)
        });
}
