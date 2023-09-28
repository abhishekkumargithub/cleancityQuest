from ultralytics import YOLO


model=YOLO('./best.pt')

model.predict(source=0,show=True ,conf=0.7)

