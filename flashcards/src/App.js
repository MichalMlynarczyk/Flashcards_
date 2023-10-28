import { useRef, useState } from 'react';
import React from 'react';
import './App.scss'; 
import { FaPlus, FaTrash, FaEdit, FaHornbill, FaExchangeAlt } from 'react-icons/fa';



import { Cart } from './components/cart/cart';

function App() {

  const [tab, setTab] = useState([
    ["QUITE", "CAŁKIEM"],
    ["ACTIVE", "AKTYWNY"],
    ["HANDED", "WRĘCZYĆ"],
    ["QUITE", "CAŁKIEM"],
    ["ACTIVE", "AKTYWNY"],
    ["HANDED", "WRĘCZYĆ"],
    ["QUITE", "CAŁKIEM"],
    ["ACTIVE", "AKTYWNY"],
    ["HANDED", "WRĘCZYĆ"]
  ]);

  const [referencePoint, setReferencePoint] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [active, setActive] = useState(0); // która karta w danej chwili jest widoczna ! 
  const [animatedCart, setAnimatedCart] = useState( false );
  const [reverseCart, setReverseCart] = useState(false);
  const [newPl, setNewPl] = useState("");
  const [newEng, setNewEng] = useState("");

  const addCartDialog = useRef(null);


  const [state, saveState] = useState(tab.length); // zapisz stan, tak aby po zmianie danych
  // aplikacja wróciła do momentu na którym użytkownik skończył

  const setState = (index) => {
    saveState(index);
  }

  const renderFlashcards = () => {


    const flaschcardsArray = [];

    for (let i=0; i<tab.length; i++){

      

      if (i < state){
        flaschcardsArray.push(
            <Cart key={i} state={setState} reverse={reverseCart} zindex={i} eng ={tab[i][0]} pl = {tab[i][1]} method={deleteFlashcards} edit={editFlashcards}/>
        )
        }
    }

    return flaschcardsArray;
  }

  const deleteFlashcards = (index) => {
    saveState(index-1);
    const newTab = tab.filter((_, i) => i !== index);
    setTab(newTab);

  }

  const editFlashcards = (index, plFlash, engFlash) => {
    saveState(index+1);
    const newFlashcards = [...tab];
    newFlashcards[index][0] = engFlash.toUpperCase();
    newFlashcards[index][1] = plFlash.toUpperCase();
    setTab(newFlashcards);
  }

  return (
    <div className="App">

      <div className='background-logo'>
        <FaHornbill size={100}/>
      </div>
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

        <button
          onClick={() => {setReverseCart(!reverseCart)}}  
        ><FaExchangeAlt size={25}/></button>
        <button
          onClick={() => {
            addCartDialog.current.showModal();
          }}
        ><FaPlus size={25}/></button>
      </div>

      <dialog className="edit-dialog" ref={addCartDialog}>
                DODAJ FISZKĘ:
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
                           
           
                          addCartDialog.current.close();
                        }
                        }   > 
                    ANULUJ</button>
                    <button className="dialog-btn"
                        onClick={() => {
                          const flashtab = [];
                          for(let i=0; i<tab.length+1; i++ )
                          {
                            if (i < state){
                                flashtab.push([tab[i][0], tab[i][1]]);
                              }
                              else if (i == state){
                                flashtab.push([newPl, newEng]);
                              }
                              else if (i > state){
                                flashtab.push([tab[i-1][0], tab[i-1][1]]);
                              }
                          }
                          setTab(flashtab);
                          addCartDialog.current.close();
                          setNewEng("");
                          setNewPl("");
                          saveState(state+1);
                        }}
                    >ZAPISZ</button>
                </div>
            </dialog>

    </div>
  );
}

export default App;
