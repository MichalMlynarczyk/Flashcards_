import React from "react";
import { useState, useEffect } from "react";
// import {TiChevronLeftOutline, TiChevronRightOutline} from 'https://cdn.skypack.dev/react-icons/ti';
import "../cart/cart.css";


export function Cart( { eng = "QUITE", pl = "CAŁKIEM", 
                        perspective = "1200px", 
                        rotateY = 45,
                        scale = 0.6,
                        zindex = -1,
                        flashcards,
                        blur = "2px" } ){

    // VARIABLES
    const [word, setWord] = useState(pl);
    const [referencePoint, setReferencePoint] = useState(0);
    const [referencePointY, setReferencePointY] = useState(0);
    const [rotate, setRotate] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [transformX, setTransformX] = useState(0); 
    const [transformY, setTransformY] = useState(0);


    // METHOD


    
    // RETURN STATEMENT
    return(

        <div className="cart-container" 

            onClick={() => { 
                // reverse cart
                setWord(word === pl ? eng : pl);
            }}

            onTouchStart={(e) => {
                setIsDragging(true); 
                setReferencePoint(e.touches[0].clientX); 
            }}

            onTouchMove={(e) => {
                if(isDragging){
                    setRotate(e.touches[0].clientX - referencePoint);
                }
            }}

            onTouchEnd={(e) => {
            
                if(rotate > -100){
                    setRotate(0);
                }
                else if(rotate < -100){
                    setTransformX(-100);
                    setRotate(0);
                }

                setIsDragging(false);
            }}

            onMouseDown={(e) => {
                setIsDragging(true);
                setReferencePointY(e.clientY);
                setReferencePoint(e.clientX);
            }}

            onMouseMove={(e) => {
                if(isDragging){
                    setTransformX(e.clientX - referencePoint);
                    setTransformY(e.clientY - referencePointY);
                
                        setRotate(e.clientX - referencePoint);
                    
                }
            }}

            onMouseUp = {(e) => {
                if(rotate > -100){
                    setRotate(0);
                }
                else if(rotate < -100){
                    // setTransformX(-100);
                    setRotate(0);
                }
                setTransformX(0);
                setTransformY(0);
                setIsDragging(false);
            }}


            style={{
                '--test' : 'red',
                '--scale' : scale,
                '--rotate' : rotate/12,
                '--transformX' : transformX,
                '--transformY': transformY,
                '--zindex' : zindex
            }}
        >

            <span> {word} </span>
        </div>
    );
}