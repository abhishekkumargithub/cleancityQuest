import cv2
import numpy as np

cap=cv2.VideoCapture(0)
face_cascade=cv2.CascadeClassifier(cv2.data.haarcascades +'haarcascade_frontalface_default.xml')
eye_cascade=cv2.CascadeClassifier(cv2.data.haarcascades +'haarcascade_eye.xml')

while True:
    ret,frame=cap.read()
    cv2.imshow('frame',frame)
    gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    face =face_cascade.detectMultiScale(gray,1.3,5)
    for(x,y,w,h) in face:
        cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),5)
        roi_gray=gray[y:y+h,x:x+w] #->y shd come 1st x comes 2 nd bec rows 1st coloumn 2nd
        roi_color=frame[y:y+h,x:x+w]

        eye=eye_cascade.detectMultiScale(roi_gray,1.3,5)
        for(ex,ey,ew,eh) in eye:
            cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),5)

    cv2.imshow('frame',frame)
    if cv2.waitKey(1)==ord('x'):
        break
cap.release()
cv2.destroyAllWindows()