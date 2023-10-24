import { useRef, useState } from 'react';
import React from 'react';
import './App.scss'; 
import { FaPlus, FaTrash, FaEdit, FaHornbill } from 'react-icons/fa';

import { FiEdit2 } from "react-icons/fi";

import { Cart } from './components/cart/cart';

function App() {
  const tab = [
    ["QUITE", "CAŁKIEM"],
    ["ACTIVE", "AKTYWNY"],
    ["HANDED", "WRĘCZYĆ"],
    ["QUITE", "CAŁKIEM"],
    ["ACTIVE", "AKTYWNY"],
    ["HANDED", "WRĘCZYĆ"],
    ["QUITE", "CAŁKIEM"],
    ["ACTIVE", "AKTYWNY"],
    ["HANDED", "WRĘCZYĆ"]
  ];

  const [referencePoint, setReferencePoint] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [active, setActive] = useState(0); // która karta w danej chwili jest widoczna ! 
  const [animatedCart, setAnimatedCart] = useState( false );

  const handleMouseDown = (e) => {
    console.log("FIRST STATE");
    setIsDragging(true);
    setReferencePoint(e.clientX);
  } 

  const handleMouseMove = (e) => {
    if(isDragging){
      const mousePos_x = e.clientX;
      const vector_x = mousePos_x - referencePoint;
      setRotate(vector_x);
      console.log("Vector: " + vector_x);
    }
  }

  const handleMouseUp = () => {

    if (rotate < -100){
      setActive(active+1);
    }

    if(rotate == 0){
      reverseCart();
    }


    setRotate(0);
    setIsDragging(false);
  }

  const renderFlashcards = () => {
    const flaschcardsArray = [];

    for (let i=0; i<tab.length; i++){
      flaschcardsArray.push(
          <Cart zindex={i} eng ={tab[i][0]} pl = {tab[i][1]}/>
      )
    }

    return flaschcardsArray;
  }

  function reverseCart(){
    console.log("click");
    setAnimatedCart(!animatedCart);
  }

  return (
    <div className="App">
      <div className="title">

        <div className='logo'>
          <FaHornbill />
        </div>

        <span>
          Flashcards
        </span>
      </div>

      <div className="cart-container-app">
        { renderFlashcards() }
      </div>

      <div className="menu">

        <button><FiEdit2 size={25}/></button>
        <button><FaPlus size={25}/></button>
      </div>

    </div>
  );
}

export default App;
