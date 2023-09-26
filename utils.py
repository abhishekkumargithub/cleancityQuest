import cv2
import json


cap = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

font = cv2.FONT_HERSHEY_SIMPLEX
font_scale = 0.8
font_thickness = 2
detected_objects = []  # To store detected objects

def detect_object(frame):
    detected_objects.clear()  # Clear the list at the beginning of each frame

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 5)
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = frame[y:y + h, x:x + w]
        detected_objects.append('Face')
        eyes = eye_cascade.detectMultiScale(roi_gray, 1.3, 5)
        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 5)
            cv2.putText(frame, 'Eye', (x + ex, y + ey - 10), font, font_scale, (0, 255, 0), font_thickness)
            detected_objects.append('Eye')

    return frame




def genz():

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_with_boxes = detect_object(frame)
        _, jpeg = cv2.imencode('.jpg', frame_with_boxes)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
