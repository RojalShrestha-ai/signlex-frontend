import React, { useState, useEffect, useRef } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import * as tf from '@tensorflow/tfjs';
import { learningAPI, recognitionAPI } from '../../services/api';
import './DrillInterface.css';

const DrillInterface = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [currentSign, setCurrentSign] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [drillSession, setDrillSession] = useState(null);
  const [model, setModel] = useState(null);
  const [handsInstance, setHandsInstance] = useState(null);

  useEffect(() => {
    initializeDrill();
    return () => {
      if (handsInstance) {
        handsInstance.close();
      }
    };
  }, []);

  const initializeDrill = async () => {
    try {
      const response = await learningAPI.getDrillSession();
      setDrillSession(response.data);
      if (response.data.signs && response.data.signs.length > 0) {
        setCurrentSign(response.data.signs[0]);
      }
      await initializeCamera();
      await loadModel();
    } catch (error) {
      console.error('Failed to initialize drill:', error);
    }
  };

  const loadModel = async () => {
    try {
      const loadedModel = await tf.loadLayersModel('/models/asl_model/model.json');
      setModel(loadedModel);
    } catch (error) {
      console.error('Failed to load model:', error);
    }
  };

  const initializeCamera = async () => {
    try {
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      hands.onResults(onHandsResults);
      setHandsInstance(hands);

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });
        
        camera.start();
        setCameraReady(true);
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
    }
  };

  const onHandsResults = async (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = results.image.width;
    canvas.height = results.image.height;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      
      drawConnectors(ctx, landmarks);
      drawLandmarks(ctx, landmarks);

      if (model && currentSign) {
        const processedLandmarks = preprocessLandmarks(landmarks);
        const tensorInput = tf.tensor2d([processedLandmarks]);
        const predictions = await model.predict(tensorInput).data();
        
        const maxIndex = predictions.indexOf(Math.max(...predictions));
        const maxConfidence = predictions[maxIndex];
        
        setPrediction(drillSession?.labels[maxIndex] || 'Unknown');
        setConfidence(maxConfidence);

        if (drillSession?.labels[maxIndex] === currentSign.word && maxConfidence > 0.75) {
          handleCorrectSign();
        }
      }
    }

    ctx.restore();
  };

  const preprocessLandmarks = (landmarks) => {
    const flatLandmarks = [];
    landmarks.forEach(landmark => {
      flatLandmarks.push(landmark.x, landmark.y, landmark.z);
    });
    return flatLandmarks;
  };

  const drawConnectors = (ctx, landmarks) => {
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [5, 9], [9, 10], [10, 11], [11, 12],
      [9, 13], [13, 14], [14, 15], [15, 16],
      [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      ctx.beginPath();
      ctx.moveTo(startPoint.x * canvasRef.current.width, startPoint.y * canvasRef.current.height);
      ctx.lineTo(endPoint.x * canvasRef.current.width, endPoint.y * canvasRef.current.height);
      ctx.stroke();
    });
  };

  const drawLandmarks = (ctx, landmarks) => {
    ctx.fillStyle = '#ff0000';
    landmarks.forEach(landmark => {
      ctx.beginPath();
      ctx.arc(
        landmark.x * canvasRef.current.width,
        landmark.y * canvasRef.current.height,
        5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });
  };

  const handleCorrectSign = async () => {
    setScore(score + 1);
    setAttempts(attempts + 1);

    try {
      await learningAPI.submitDrillResult({
        signId: currentSign._id,
        correct: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to submit result:', error);
    }

    const nextIndex = drillSession.signs.findIndex(s => s._id === currentSign._id) + 1;
    if (nextIndex < drillSession.signs.length) {
      setCurrentSign(drillSession.signs[nextIndex]);
    } else {
      alert(`Drill complete! Score: ${score + 1}/${attempts + 1}`);
    }
  };

  const handleSkip = () => {
    setAttempts(attempts + 1);
    const nextIndex = drillSession.signs.findIndex(s => s._id === currentSign._id) + 1;
    if (nextIndex < drillSession.signs.length) {
      setCurrentSign(drillSession.signs[nextIndex]);
    }
  };

  if (!drillSession || !currentSign) {
    return <div className="drill-container loading">Loading drill session...</div>;
  }

  return (
    <div className="drill-container">
      <div className="drill-header">
        <h2>Practice Drill</h2>
        <div className="score-display">
          Score: {score}/{attempts}
        </div>
      </div>

      <div className="drill-content">
        <div className="target-sign">
          <h3>Sign this:</h3>
          <div className="target-word">{currentSign.word}</div>
          {currentSign.imageUrl && (
            <img src={currentSign.imageUrl} alt={currentSign.word} className="reference-image" />
          )}
        </div>

        <div className="camera-section">
          <div className="video-wrapper">
            <video ref={videoRef} className="input-video" autoPlay muted />
            <canvas ref={canvasRef} className="output-canvas" />
            
            {cameraReady && (
              <div className="prediction-overlay">
                {prediction && (
                  <div className={`prediction ${prediction === currentSign.word ? 'correct' : 'incorrect'}`}>
                    <span className="prediction-label">{prediction}</span>
                    <span className="confidence">{(confidence * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {!cameraReady && (
            <div className="camera-status">Initializing camera...</div>
          )}
        </div>

        <div className="drill-controls">
          <button onClick={handleSkip} className="btn-skip">
            Skip
          </button>
          <button onClick={initializeDrill} className="btn-restart">
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrillInterface;