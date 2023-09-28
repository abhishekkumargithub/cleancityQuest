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
const cooldownTime = 5000;

async function fetchDetectedObjects() {
  const response = await fetch('/get_detected_objects');
  const data = await response.json();
  const detectedObjects = data.detected_objects;
  console.log('Detected Objects:', detectedObjects);
  const buttonsDiv = document.getElementById('buttons');
  detectedObjects.forEach(async (object) => {
    const currentTime = Date.now();
    if (!lastDetectedObjects[object] || currentTime - lastDetectedObjects[object] >= cooldownTime) {
      const button = document.createElement('button');
      button.textContent = `Do Challenge ${object}`;
      button.addEventListener('click', async () => {
        const pointSystemRef = db.collection('PointSystem');
        const query = pointSystemRef.where('user_email', '==', user_email);

        try {
          const querySnapshot = await query.get();
          querySnapshot.forEach(async (doc) => {
            await doc.ref.update({
              points: firebase.firestore.FieldValue.increment(50)
            });
          });
          console.log("Done updating points for matching user_email");
        } catch (error) {
          console.error("Error updating points:", error);
        }
      })
      buttonsDiv.appendChild(button);
      lastDetectedObjects[object] = currentTime;
      setTimeout(() => {
        buttonsDiv.removeChild(button);
        delete lastDetectedObjects[object];
      }, 5000);
    }
  });
}

fetchDetectedObjects();
setInterval(fetchDetectedObjects, 2000);
