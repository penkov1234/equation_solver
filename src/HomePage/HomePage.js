import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import GridList from '@material-ui/core/GridList';
import { makeStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import Slika1 from '../Images/slika1.png';
import Slika2 from '../Images/slika2.png';
import Slika3 from '../Images/slika3.png';
import Slika4 from '../Images/slika4.png';
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
      img: Slika2,
    },
    {
      img: Slika3,
    },
    {
      img: Slika2,
    },
    {
      img: Slika3,
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
  }, [ctx]);

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
    axios
      .post(`http://2.56.212.201:8000/api/mer_predict/`, {
        image: imageToPredict.replace('data:image/png;base64,', ''),
      })
      .then((res) => {
        //setiraj go rezultato ovde
        console.log(res);
        setEquation('Equation: $' + res.data.latex_string + '$');
        setResult(res.data.latex_string);
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
        <button onClick={() => {}}>Test</button>
      </div>
      <div>
        <Modal show={open} size="lg" centered>
          <Modal.Header closeButton onClick={() => setIsOpen(false)}>
            <Modal.Title>Predict</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <button
              className={'btn btn-outline-secondary'}
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            <button
              className={'btn btn-outline-primary'}
              onClick={() => predict(imageToPredict)}
            >
              Predict
            </button>
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
