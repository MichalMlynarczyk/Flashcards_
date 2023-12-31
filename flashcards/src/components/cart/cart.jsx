import React from "react";
import { useState, useEffect, useRef } from "react";
// import {TiChevronLeftOutline, TiChevronRightOutline} from 'https://cdn.skypack.dev/react-icons/ti';
import "../cart/cart.css";
import { FaPlus, FaTrash, FaEdit, FaHornbill } from 'react-icons/fa';

export function Cart( { eng = "QUITE", pl = "CAŁKIEM", 
                        perspective = "1200px", 
                        rotateY = 45,
                        scale = 0.6,
                        zindex = -1,
                        flashcards,
                        blur = "2px",
                        method,
                        reverse,
                        edit,
                        state } ){

    // VARIABLES
    const [word, setWord] = useState(reverse ? pl : eng);
    const [referencePoint, setReferencePoint] = useState(0);
    const [referencePointY, setReferencePointY] = useState(0);
    const [rotate, setRotate] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [transformX, setTransformX] = useState(0); 
    const [transformY, setTransformY] = useState(0);
    const [display, setDisplay] = useState('flex');
    const [listening, setListening] = useState(true);

    const [currentPl, setCurrentPl] = useState(pl);
    const [currentEng, setCurrentEng] = useState(eng);

    const [newEng, setNewEng] = useState(eng);
    const [newPl, setNewPl] = useState(pl);

    const deleteDialog = useRef(null);
    const editDialog = useRef(null);



    // METHOD
    useEffect(() => {
        setCurrentEng(newEng.toUpperCase());
        setCurrentPl(newPl.toUpperCase());
    }, [newEng, newPl])

    useEffect(() => {
        setWord(eng);
        setCurrentEng(eng);
        setCurrentPl(pl);
        setNewEng(eng);
        setNewPl(pl);
    }, [pl])

    useEffect(() => {
        setWord(reverse ? pl : eng);
        setDisplay('flex');
    }, [reverse])

    
    // RETURN STATEMENT
    return(

        <div className="cart-container" 

            onClick={() => { 
                // reverse cart
                setWord(word === currentPl ? currentEng : currentPl);
            }}

            onTouchStart={(e) => {

                if (listening){
                    e.preventDefault();
                    setIsDragging(true);
                    setReferencePointY(e.touches[0].clientY);
                    setReferencePoint(e.touches[0].clientX);
                }
            }}

            onTouchMove={(e) => {
                if(isDragging && listening){
                        e.preventDefault();

                        setTransformX(e.touches[0].clientX - referencePoint);
                        setTransformY(e.touches[0].clientY - referencePointY);
                        setRotate(e.touches[0].clientX - referencePoint);
                }
            }}

            onTouchEnd={(e) => {
                if (listening){
                    if(rotate > -100){
                        setRotate(0);
                    }
                    else if(rotate < -100){
                        setDisplay('none');
                        setRotate(0);
                        state(zindex);
                    }

                    setTransformX(0);
                    setTransformY(0);
                    setIsDragging(false);
                }
            }}

            onMouseDown={(e) => {
                if (listening){
                    setIsDragging(true);
                    setReferencePointY(e.clientY);
                    setReferencePoint(e.clientX);
                }
            }}

            onMouseMove={(e) => {
                if (listening){
                    if(isDragging){
                        setTransformX(e.clientX - referencePoint);
                        setTransformY(e.clientY - referencePointY);
                    
                            setRotate(e.clientX - referencePoint);
                        
                    }
                }
            }}

            onMouseUp = {(e) => {
                if (listening){
                    if(rotate > -100){
                        setRotate(0);
                    }
                    else if(rotate < -100){
                        setDisplay('none');
                        setRotate(0);
                        state(zindex);
                    }

                    setTransformX(0);
                    setTransformY(0);
                    setRotate(0); 
                    setIsDragging(false);
                }
            }}

            onMouseLeave={(e) => {

                if(isDragging){
                    setDisplay('none');
                    setRotate(0);
                    // state(zindex);
                    setTransformX(0);
                    setTransformY(0);
                    setRotate(0); 
                    setIsDragging(false);
                }
            }}

            style={{
                '--test' : 'red',
                '--scale' : scale,
                '--rotate' : rotate/20,
                '--transformX' : transformX,
                '--transformY': transformY,
                '--zindex' : zindex,
                '--display' : display,
            }}
        >

            <span> {word} </span>

            <div className="cart-menu">
                <button onClick={(e) => {
                    e.stopPropagation();
                    setListening(false);
                    deleteDialog.current.showModal();
                    }}>
                <FaTrash size={30}/></button>

                <button onClick={(e) => {
                    e.stopPropagation();
                    setListening(false);
                    editDialog.current.showModal();
                    }}>
                <FaEdit size={30}/></button>
            </div>

            <dialog className="delete-dialog" ref={deleteDialog}>
                Czy na pewno chcesz usunąć ten element ? 
                <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <button className="dialog-btn"
                        onClick={() => {
                            method(zindex);
                            setListening(true);
                            deleteDialog.current.close();
                        }
                        }   > 
                    TAK</button>
                    <button className="dialog-btn"
                        onClick={() => {
                            setListening(true);
                            deleteDialog.current.close();
                        }}
                    >NIE</button>
                </div>
            </dialog>

            <dialog className="edit-dialog" ref={editDialog}>
                EDYTUJ FISZKĘ:
                <div style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                    width: '100%',
                    height: '2px',
                    background: 'black',
                }}>

                </div>
                <div style={{
                    with: '100%',
                    float: 'left',
                    fontSize: '20px',
                }}>POLSKA STRONA:</div>
                
                <input
                        style={{textTransform: 'uppercase',}}
                        className=""
                        type="text"
                        // placeholder="Nazwa lokalizacji"
                        value={newPl}
                        onChange={(e) => setNewPl(e.target.value)}
                />   

                <div style={{
                    marginTop: '5px',
                    with: '100%',
                    float: 'left',
                    fontSize: '20px',
                }}>ANGIELSKA STRONA:</div>

                <input
                    style={{textTransform: 'uppercase',}}
                    className=""
                    type="text"
                    // placeholder="Nazwa lokalizacji"
                    value={newEng}
                    onChange={(e) => setNewEng(e.target.value)}
                />

                <div style={{ justifyContent: 'space-between', 
                              display: 'flex',
                              marginTop: '10px' }}>
                    <button className="dialog-btn"
                        onClick={() => {
                           
                            setListening(true);
                            editDialog.current.close();
                        }
                        }   > 
                    ANULUJ</button>
                    <button className="dialog-btn"
                        onClick={() => {
                            
                            setListening(true);
                            edit(zindex, newPl, newEng);
                            editDialog.current.close();
                            
                        }}
                    >ZAPISZ</button>
                </div>
            </dialog>

        </div>
    );
}