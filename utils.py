# import cv2
# import json

# from ultralytics import YOLO

# import math

# cap = cv2.VideoCapture(0)
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
# eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

# font = cv2.FONT_HERSHEY_SIMPLEX
# font_scale = 0.8
# font_thickness = 2
detected_objects = []  # To store detected objects

# def detect_object(frame):
#     detected_objects.clear()  # Clear the list at the beginning of each frame

#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray, 1.3, 5)
#     for (x, y, w, h) in faces:
#         cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 5)
#         roi_gray = gray[y:y + h, x:x + w]
#         roi_color = frame[y:y + h, x:x + w]
#         detected_objects.append('Face')
#         eyes = eye_cascade.detectMultiScale(roi_gray, 1.3, 5)
#         for (ex, ey, ew, eh) in eyes:
#             cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 5)
#             cv2.putText(frame, 'Eye', (x + ex, y + ey - 10), font, font_scale, (0, 255, 0), font_thickness)
#             detected_objects.append('Eye')

#     return frame




# def genz():

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break
#         frame_with_boxes = detect_object(frame)
#         _, jpeg = cv2.imencode('.jpg', frame_with_boxes)
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
# ==============================================================================================
import cv2
import json

from ultralytics import YOLO

import math

def generate_frames_web(path_x):
    yolo_output = video_detection(path_x)
    for detection_ in yolo_output:
        ref,buffer=cv2.imencode('.jpg',detection_)

        frame=buffer.tobytes()
        yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame +b'\r\n')
        


def video_detection(path_x, confidence_threshold=0.7, num_classes=8):
    video_capture = path_x
    cap = cv2.VideoCapture(video_capture)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))

    model = YOLO("./OpenCVML/best.pt")
    classNames = ["Garbage"]

    while True:
        success, img = cap.read()
        results = model(img, stream=True)

        # Initialize a dictionary to keep track of class confidences
        class_confidences = {class_idx: 0.0 for class_idx in range(num_classes)}

        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                conf = math.ceil((box.conf[0] * 100)) / 100

                cls = int(box.cls[0])
                class_confidences[cls] = max(class_confidences[cls], conf)

                # Check if confidence is above the threshold
                if conf >= confidence_threshold:
                    cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)
                    cls = int(box.cls[0])
                    class_name = classNames[cls]
                    label = f'{class_name}{conf}'
                    t_size = cv2.getTextSize(label, 0, fontScale=1, thickness=2)[0]
                    c2 = x1 + t_size[0], y1 - t_size[1] - 3
                    cv2.rectangle(img, (x1, y1), c2, [255, 0, 255], -1, cv2.LINE_AA)  # filled
                    cv2.putText(img, label, (x1, y1 - 2), 0, 1, [255, 255, 255], thickness=1, lineType=cv2.LINE_AA)

        # Check if all class confidences are below the threshold
        if all(conf < confidence_threshold for conf in class_confidences.values()):
            cv2.putText(img, 'NoDetections', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                
        yield img
      
cv2.destroyAllWindows()