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


const lastDetectedObjects = {};
const cooldownTime = 5000; // 5 seconds cooldown for each object

async function fetchDetectedObjects() {
  const response = await fetch('/get_detected_objects');
  const data = await response.json();
  const detectedObjects = data.detected_objects;
  console.log('Detected Objects:', detectedObjects);

  // Clear the existing buttons
  const buttonsDiv = document.getElementById('buttons');

  detectedObjects.forEach((object) => {
    const currentTime = Date.now();

    if (!lastDetectedObjects[object] || currentTime - lastDetectedObjects[object] >= cooldownTime) {
      // Create a button if it's a new unique object or cooldown time has passed since the last detection
      const button = document.createElement('button');
      button.textContent = `Do Challenge ${object}`;
      button.addEventListener('click', async () => {
        // Handle the button click event here, e.g., start a challenge related to the object
        console.log(`Challenge started for ${object}`);

        // Check if the "PointSystem" collection exists
        const pointSystemRef = db.collection('PointSystem');
        const doc = await pointSystemRef.doc(user_email).get();

        if (!doc.exists) {
          // If the document does not exist, create it with initial points
          await pointSystemRef.doc(user_email).set({
            useremail: user_email,
            points: 50 // You can set the initial points as needed
          });
          console.log("done 1")
        } else {
          // If the document exists, update the user's points by +50
          await pointSystemRef.doc(user_email).update({
            points: firebase.firestore.FieldValue.increment(50)
          });
          console.log("done 2")
        }
      });

      // Append the button to the buttonsDiv
      buttonsDiv.appendChild(button);

      // Update the last detected time for this object
      lastDetectedObjects[object] = currentTime;

      // Set a timeout to remove the button after 5 seconds
      setTimeout(() => {
        buttonsDiv.removeChild(button);
        delete lastDetectedObjects[object]; // Remove the object from the tracking after button removal
      }, 5000);
    }
  });
}

// Call fetchDetectedObjects initially
fetchDetectedObjects();

// Use setInterval to call fetchDetectedObjects every 2 seconds
setInterval(fetchDetectedObjects, 2000);