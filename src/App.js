import React, { useEffect, useRef, useState } from 'react';
import { initNotifications, notify } from '@mycv/f8-notification';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier'
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import './App.css';
import { Howl } from 'howler';
import soundURL from './assets/hey_sondn.mp3'
tf.setBackend('webgl');
var sound = new Howl({
  src: [soundURL]
});
const NOT_TOUCH_LABEL = 'not touch';
const TOUCHED_LABEL = 'touched';
const TOUCH_CONFIDENCE = 0.8;
const TRAINING_TIMES = 50;
function App() {
  const video = useRef();
  const classifier = useRef();
  const canPlaySound = useRef(true);
  const mobilenetModule = useRef();
  const [touched, setTouched] = useState(false);

  const init = async () => {
    console.log('init...')
    await setupCamera();
    console.log('camera success');

    mobilenetModule.current = await mobilenet.load();

    classifier.current = knnClassifier.create();

    initNotifications({ cooldown: 3000 });


  }

  const setupCamera = () => {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.mozGetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          {
            video: true
          },
          stream => {
            video.current.srcObject = stream;
            video.current.addEventListener('loadeddata', resolve);
          },
          error => reject(error)
        );
      }
      else {
        reject();
      }
    });
  }
  const train = async label => {
    console.log(`[${label}] Dang train...`)
    for (let i = 0; i < TRAINING_TIMES; ++i) {
      console.log(`Progress ${(i + 1) / TRAINING_TIMES * 100}%`)
      await training(label);
    }
  }
  /**
   * B1: Train chos may khuon mat khong cham tay
   * B2: Train cho may khuon mat co cham tay 
   * B3: Lay hinh anh hien tai, phan tich va so sanh voi data da hoc truoc do
   * @param {*} label 
   * @returns 
   */
  const training = label => {
    return new Promise(async resolve => {
      const embedding = mobilenetModule.current.infer(
        video.current,
        true
      );
      classifier.current.addExample(embedding, label);
      await sleep(100);
      resolve();
    });
  }
  const run = async () => {
    const embedding = mobilenetModule.current.infer(
      video.current,
      true
    );
    const result = await classifier.current.predictClass(embedding);


    if (result.label === TOUCHED_LABEL
      && result.confidences[result.label] > TOUCH_CONFIDENCE
    ) {
      console.log('Touched');
      if (canPlaySound.current) {
        canPlaySound.current = false;
        sound.play();
      }
      notify('Bo tay ra', { body: 'Ban vua cham tay vao mat' });
      setTouched(true);
    }
    else {
      console.log('Not touch');
      setTouched(false);
    }
    await sleep(200);
    run();
  }
  const sleep = (ms = 0) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  useEffect(() => {
    init();

    sound.on('end', function () {
      canPlaySound.current = true;
    })
    // clean up
    return () => {

    }

  }, []);
  return (
    <div className={`main ${touched ? 'touched' : ''}`}>
      <video className="video"
        autoPlay
        ref={video}
      />
      <div className="control">
        <button className="btn" onClick={() => train(NOT_TOUCH_LABEL)}>Train 1</button>
        <button className="btn" onClick={() => train(TOUCHED_LABEL)}>Train 2</button>
        <button className="run" onClick={() => run()}>Run</button>
      </div>
    </div>

  );
}

export default App;