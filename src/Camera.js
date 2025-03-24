import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import "./App.css"; // ✅ Custom styling added

const Camera = ({ onDetect }) => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [detectionResult, setDetectionResult] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(false);

  // ✅ Load MobileNet Model
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // ✅ Run Detection
  const detectObject = async () => {
    if (model && webcamRef.current && isCameraOn) {
      const video = webcamRef.current.video;
      const prediction = await model.classify(video);

      if (prediction.length > 0) {
        const detectedItem = prediction[0].className;
        setDetectionResult(detectedItem);
        console.log("Detected:", detectedItem);

        // ✅ Check if it's a recyclable item
        if (detectedItem.includes("bottle") || detectedItem.includes("can")) {
          onDetect(detectedItem); // Send detection result to parent component
        }
      }
    }
  };

  // ✅ Auto-detect every 2 seconds
  useEffect(() => {
    let interval;
    if (isCameraOn) {
      interval = setInterval(detectObject, 2000);
    }
    return () => clearInterval(interval);
  }, [model, isCameraOn]);

  return (
    <div className="camera-container">
      {isCameraOn ? (
        <Webcam ref={webcamRef} />
      ) : (
        <div className="black-screen"></div> // ✅ Black screen placeholder
      )}
      <button onClick={() => setIsCameraOn(!isCameraOn)} className="camera-btn">
        {isCameraOn ? "Stop Camera" : "Start Camera"}
      </button>
    </div>
  );
};

export default Camera;
