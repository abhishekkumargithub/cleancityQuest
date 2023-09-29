import cv2
import json
from ultralytics import YOLO
import math
import time

detected_objects = []
object_time_map = {}

def generate_frames_web(path_x):
    yolo_output = video_detection(path_x)
    for detection_ in yolo_output:
        ref, buffer = cv2.imencode('.jpg', detection_)

        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def video_detection(path_x, confidence_threshold=0.5, num_classes=8):
    video_capture = path_x
    cap = cv2.VideoCapture(video_capture)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))

    model = YOLO("./OpenCVML/5type.pt")
    classNames = ["Biodegradable","Cardboard","Glass","Metal","Paper","Plastic"]

    while True:
        success, img = cap.read()
        results = model(img, stream=True)

        # keep track of class confidences
        class_confidences = {class_idx: 0.0 for class_idx in range(num_classes)}
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                conf = math.ceil((box.conf[0] * 100)) / 100
                cls = int(box.cls[0])
                class_confidences[cls] = max(class_confidences[cls], conf)
                if conf >= confidence_threshold:
                    cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)
                    cls = int(box.cls[0])
                    class_name = classNames[cls]
                    detected_objects.append(class_name)
                    object_time_map[class_name] = time.time()

                    label = f'{class_name}{conf}'
                    t_size = cv2.getTextSize(label, 0, fontScale=1, thickness=2)[0]
                    c2 = x1 + t_size[0], y1 - t_size[1] - 3
                    cv2.rectangle(img, (x1, y1), c2, [255, 0, 255], -1, cv2.LINE_AA)  # filled
                    cv2.putText(img, label, (x1, y1 - 2), 0, 1, [255, 255, 255], thickness=1, lineType=cv2.LINE_AA)

        # Check if all class confidences are below the threshold
        if all(conf < confidence_threshold for conf in class_confidences.values()):
            cv2.putText(img, 'NoDetections', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Remove items from detected_objects 2-second threshold
        current_time = time.time()
        for obj in list(detected_objects):
            if current_time - object_time_map.get(obj, 0) >= 2:
                detected_objects.remove(obj)

        yield img