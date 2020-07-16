import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import GridList from '@material-ui/core/GridList';
import { makeStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import Slika1 from '../Images/slikce2.png';
import Slika2 from '../Images/slikce3.png';
import Slika3 from '../Images/slikce4.png';
import Slika4 from '../Images/slikce5.png';
import Slika5 from '../Images/slikce9.png';
import Slika7 from '../Images/slikce10.png';
import Slika8 from '../Images/slikce11.png';
import Slika9 from '../Images/slikce15.png';
import Slika10 from '../Images/slikce16.png';
import Slika11 from '../Images/slikce20.png';
import Slika12 from '../Images/slikce21.png';
import Slika13 from '../Images/slikce25.png';
import Slika14 from '../Images/slikce28.png';
import Slika15 from '../Images/slikce27.png';
import Slika16 from '../Images/slikce31.png';
import Slika17 from '../Images/slikce35.png';
import Slika18 from '../Images/slikce39.png';
import Slika19 from '../Images/slikce43.png';

import Slika20 from '../Images/slikce41.png';
import Slika21 from '../Images/slikce45.png';
import Slika22 from '../Images/slikce46.jpg';
import Slika23 from '../Images/slikce48.JPEG';
import Slika24 from '../Images/slikce54.JPEG';
import Slika25 from '../Images/slikce56.JPEG';
import Slika26 from '../Images/slikce57.JPEG';
import Loader from 'react-loader-spinner';

import axios from 'axios';

export default function HomePage() {
  const tileData = [
    {
      img: Slika1,
    },
    {
      img: Slika2,
    },
    {
      img: Slika3,
    },
    {
      img: Slika4,
    },
    {
      img: Slika5,
    },

    {
      img: Slika7,
    },
    {
      img: Slika8,
    },
    {
      img: Slika9,
    },
    {
      img: Slika10,
    },
    {
      img: Slika11,
    },
    {
      img: Slika12,
    },
    {
      img: Slika13,
    },
    {
      img: Slika14,
    },
    {
      img: Slika15,
    },
    {
      img: Slika16,
    },

    {
      img: Slika17,
    },
    {
      img: Slika18,
    },
    {
      img: Slika19,
    },
    {
      img: Slika20,
    },
    {
      img: Slika21,
    },
    {
      img: Slika22,
    },
    {
      img: Slika23,
    },
    {
      img: Slika24,
    },

    {
      img: Slika25,
    },
    {
      img: Slika26,
    },
  ];
  const Latex = require('react-latex');

  const [data, setData] = useState(tileData);
  const classes = useStyles();
  const canvasRef = useRef(null);
  const [paint, setPaint] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [canvasObj, setCanvasObj] = useState(null);
  const [currentPos, setCurrentPos] = useState({ x: null, y: null });
  const [imageToPredict, setImageToPredict] = useState(null);
  const [open, setIsOpen] = useState(false);
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState('');
  const [solutionPods, setSolutionPods] = useState([]);
  const [solutionStatus, setSolutionStatus] = useState({});
  const [showPredictLoader, setShowPredictLoader] = useState(false);

  useEffect(() => {
    if (!open) {
      setEquation('');
    }
  }, [open]);
  useEffect(() => {
    setCanvasObj(canvasRef.current);

    setCtx(canvasRef.current.getContext('2d'));
  }, [canvasRef]);

  useEffect(() => {
    if (ctx) {
      ctx.beginPath();
      ctx.rect(0, 0, canvasObj.width, canvasObj.height);
      ctx.fillStyle = 'white';
      ctx.fill();
    }
  }, [canvasObj, ctx]);

  // useEffect(() => {
  //     setData(tileData);
  // }, [tileData])

  function getPosition(event) {
    let x2 = event.clientX - document.documentElement.clientWidth * 0.025;
    let y2 = event.clientY - document.documentElement.clientHeight * 0.15;
    setCurrentPos({ x: x2, y: y2 });
  }

  function startPainting(event) {
    setPaint(true);
    getPosition(event);
  }
  function stopPainting(event) {
    let x2 = event.clientX - document.documentElement.clientWidth * 0.025;
    let y2 = event.clientY - document.documentElement.clientHeight * 0.15;

    if (paint) {
      sketch(ctx, currentPos.x, currentPos.y, x2, y2);
      getPosition(event);
      setPaint(false);
    }
  }

  function painting(event) {
    if (!paint) {
      return;
    }
    let x2 = event.clientX - document.documentElement.clientWidth * 0.025;
    let y2 = event.clientY - document.documentElement.clientHeight * 0.15;
    sketch(ctx, currentPos.x, currentPos.y, x2, y2);
    getPosition(event);
  }

  function generateCanvasImageToPredict() {
    const image = canvasObj.toDataURL('image/png');

    setImageToPredict(image);

    setIsOpen(true);
  }

  function sketch(context, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.lineCap = 'butt';

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }
  function setImageForPredict(img) {
    setImageToPredict(img);

    setIsOpen(true);
  }
  function clear() {
    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
    ctx.beginPath();
    ctx.rect(0, 0, canvasObj.width, canvasObj.height);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
  function imageUploaded(event) {
    let file = event.target.files[0];
    let imgFile = {
      img: URL.createObjectURL(file),
    };

    setData([imgFile, ...data]);
  }

  function predict() {
    setShowPredictLoader(true);
    const url = 'http://2.56.212.201:8000/api/mer_predict/';
    // const url = 'http://172.20.10.3:8000/api/mer_predict/';
    axios
      .post(url, {
        image: imageToPredict.replace('data:image/png;base64,', ''),
      })
      .then((res) => {
        //setiraj go rezultato ovde
        console.log(res);
        setEquation('Equation: $' + res.data.latex_string + '$');
        setResult(res.data.latex_string);
        setSolutionPods(res.data.solution_pods);
        setSolutionStatus(res.data.solution_status);
        setShowPredictLoader(false);
      })
      .catch((e) => {
        setShowPredictLoader(false);
      });
  }

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div className={'row'} style={{ paddingLeft: '5vh', paddingRight: '5vh' }}>
      <div className="col-12" style={{ height: '15vh' }}>
        <h1>Equation solver</h1>
      </div>

      <div className="col-5 shadow-sm">
        <canvas
          className={''}
          ref={canvasRef}
          //   style={{ backgroundColor: 'red' }}
          fill={'red'}
          width={document.documentElement.clientWidth * 0.4}
          height={document.documentElement.clientHeight * 0.5}
          onMouseDown={(event) => startPainting(event)}
          onMouseUp={(event) => stopPainting(event)}
          onMouseMove={(event) => painting(event)}
        ></canvas>
      </div>
      <div className="col-6 shadow-sm ml-auto">
        <GridList cellHeight={200} className={classes.gridList} cols={3}>
          {data.map((data) => (
            <GridListTile key={data.img} cols={3}>
              <img
                style={{ width: '100%', height: '100%' }}
                onClick={() => {
                  //   var reader = new FileReader();
                  var request = new XMLHttpRequest();
                  request.open('GET', data.img, true);
                  request.responseType = 'blob';
                  request.onload = function () {
                    var reader = new FileReader();
                    reader.readAsDataURL(request.response);
                    reader.onload = function (e) {
                      console.log('DataURL:', e.target.result);
                      setImageForPredict(e.target.result);
                    };
                  };
                  request.send();
                  //   console.log(data.img);
                  //   let file = new File(data.img);
                  //   console.log(file);
                  //   reader.readAsDataURL(file);
                  //   print();
                  //   reader.onloadend = function () {
                  //     var base64data = reader.result;
                  //     console.log(base64data);

                  //     setImageForPredict(base64data);
                  //   };
                }}
                src={data.img}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
      <div className="col-5 mt-2 d-flex flex-row">
        <button className={'btn btn-outline-secondary'} onClick={clear}>
          Clear
        </button>
        <button
          className={'btn btn-outline-secondary ml-auto'}
          onClick={generateCanvasImageToPredict}
        >
          Predict
        </button>
      </div>
      <div className="col-6 mt-2 d-flex flex-row ml-auto">
        <input
          type="file"
          id="img"
          name="img"
          accept="image/*"
          onChange={(event) => imageUploaded(event)}
        />
      </div>
      <div>
        <Modal show={open} size="lg" centered>
          <Modal.Header closeButton onClick={() => setIsOpen(false)}>
            <Modal.Title>
              {equation.length > 0 ? 'Prediction' : 'Predict'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              {showPredictLoader && (
                <Loader type="Puff" color="#00BFFF" height={100} width={100} />
              )}
            </div>
            {(equation.length <= 0 && !showPredictLoader && (
              <>
                <img
                  src={imageToPredict}
                  alt=""
                  style={{ maxHeight: '40vh', maxWidth: '40vw' }}
                />
                <div hidden={false}>
                  <hr />

                  <h4>{equation.length > 0 && <Latex>{equation}</Latex>}</h4>
                  <h4>
                    {/* {result.length > 0 && <Latex>Result: ${String(result)}$</Latex>} */}
                  </h4>
                </div>
              </>
            )) ||
              (!showPredictLoader && (
                <>
                  <h4>{equation.length > 0 && <Latex>{equation}</Latex>}</h4>
                  {(solutionStatus.success && (
                    <div style={{ marginTop: '20px' }}>
                      <h2>Solution:</h2>
                      <div style={{ marginTop: '20px' }}>
                        {solutionPods.map((sp) => (
                          <div>
                            {sp.title}:
                            <div>
                              {sp.subpods.map((subp) => (
                                <div>
                                  <img src={subp.img.src} alt="prediction" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) || (
                    <div style={{ marginTop: '20px' }}>
                      <p>{solutionStatus.message}</p>
                      {solutionStatus.didyoumean && (
                        <h4>Did you mean: {solutionStatus.didyoumean}</h4>
                      )}
                    </div>
                  )}
                </>
              ))}
          </Modal.Body>
          <Modal.Footer>
            <button
              className={'btn btn-outline-secondary'}
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            {equation.length <= 0 && !showPredictLoader && (
              <button
                className={'btn btn-outline-primary'}
                onClick={() => predict(imageToPredict)}
                disabled={showPredictLoader}
              >
                Predict
              </button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: document.documentElement.clientHeight * 0.5,
  },
}));
