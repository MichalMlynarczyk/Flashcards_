import { useRef, useState, useEffect } from 'react';
import React from 'react';
import './App.scss'; 
import { FaPlus, FaTrash, FaEdit, FaHornbill, FaExchangeAlt, FaSignOutAlt } from 'react-icons/fa';
import '../src/homepage.css';
import AppPhoto from "../src/app.png";
import Cookies from 'js-cookie';
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

  // LOGOWANIE / REJESTRACJA
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signin = useRef(null);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [registrationPassword, setRegistrationPassword] = useState("");
  const [repeatRegistrationPassword, setRepeatRegistrationPassword] = useState("");
  const registration = useRef(null);
  const [dialogText, setDialogText] = useState();

  const addCartDialog = useRef(null);
  const signout = useRef(null);

  const [page, setPage] = useState(true);
  // 0 -> homepage
  // 1 -> dla użytkownika


  const [state, saveState] = useState(0); // zapisz stan, tak aby po zmianie danych
  // aplikacja wróciła do momentu na którym użytkownik skończył

  const setState = (index) => {
    saveState(index);
  }

  const renderFlashcards = () => {


    const flaschcardsArray = [];

    for (let i=0; i<tab.length; i++){
console.log("dffd: " + state);
      

      if (i < state){
        flaschcardsArray.push(
            <Cart key={i} state={setState} reverse={reverseCart} zindex={i} eng ={tab[i][0]} pl = {tab[i][1]} method={deleteFlashcards} edit={editFlashcards}/>
        )
        }
    }

    return flaschcardsArray;
  }

  const deleteFlashcards = async (index) => {
    if (page == false){
      console.log("INDEX: " + index);
      await deleteFlashcardsFromServer(index+1);
    }
    saveState(index);
    const newTab = tab.filter((_, i) => i !== index);
    setTab(newTab);
  }

  const editFlashcards = (index, plFlash, engFlash) => {
    saveState(index+1);
    const newFlashcards = [...tab];
    newFlashcards[index][0] = engFlash.toUpperCase();
    newFlashcards[index][1] = plFlash.toUpperCase();
    setTab(newFlashcards);

    if (page == false){
      const SERVER_URL = "http://localhost:8080/editFlashcards";
      const REQUEST_BODY = JSON.stringify({index: index+1, eng: engFlash, pl: plFlash, tableName: email});
      const REQUEST = {method: 'POST',headers: {'Content-Type': 'application/json',},
        body: REQUEST_BODY, // Przesunięcie body do obiektu REQUEST
      };
    
      return fetch(SERVER_URL, REQUEST)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Przetwarzanie odpowiedzi jako JSON
        })
        .then((data) => {
        })
        .catch((error) => {
          console.log("Błąd: ", error);
        });
    }
  }

  

  const deleteFlashcardsFromServer = (index) =>{
    const SERVER_URL = "http://localhost:8080/deleteFlashcards";
    const REQUEST_BODY = JSON.stringify({index: index, tableName: email});
    const REQUEST = {method: 'POST',headers: {'Content-Type': 'application/json',},
      body: REQUEST_BODY, // Przesunięcie body do obiektu REQUEST
    };
  
    return fetch(SERVER_URL, REQUEST)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Przetwarzanie odpowiedzi jako JSON
      })
      .then((data) => {
      })
      .catch((error) => {
        console.log("Błąd: ", error);
      });
  }

  const getFlashcardsFromServer = (email, password) => {
    const SERVER_URL = "http://localhost:8080/getData";
    const REQUEST_BODY = JSON.stringify({email: email, password: password});
    const REQUEST = {method: 'POST',headers: {'Content-Type': 'application/json',},
      body: REQUEST_BODY, // Przesunięcie body do obiektu REQUEST
    };
  
    return fetch(SERVER_URL, REQUEST)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Przetwarzanie odpowiedzi jako JSON
      })
      .then((data) => {
        console.log(data);
        if (data != "false"){
          setPage(false);
          saveState(data.length);
          setTab(data);
          
          return true;
        }
        else{
          return false;
        }
      })
      .catch((error) => {
        console.log("Błąd: ", error);
      });
  };

  const downloadFlashcard = async () => {
    if(await getFlashcardsFromServer(email, password)){
      setCookieEmail(email);
      setCookiePassword(password);
      // setPage(false);
      // setTab(data);
    } else {
      signin.current.showModal();
    }

  }

  const addFlashcards = (index, pl, eng, tableName) => {
    const SERVER_URL = "http://localhost:8080/addFlashcards";
    const REQUEST_BODY = JSON.stringify({index: index, pl: pl, eng: eng, tableName: tableName});
    const REQUEST = {method: 'POST',headers: {'Content-Type': 'application/json',},
      body: REQUEST_BODY, // Przesunięcie body do obiektu REQUEST
    };
  
    return fetch(SERVER_URL, REQUEST)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Przetwarzanie odpowiedzi jako JSON
      })
      .then((data) => {
      })
      .catch((error) => {
        console.log("Błąd: ", error);
      });
  }

  const createUser = () => {
    const SERVER_URL = "http://localhost:8080/createUser";
    const REQUEST_BODY = JSON.stringify({email: registrationEmail, password: registrationPassword});
    const REQUEST = {method: 'POST',headers: {'Content-Type': 'application/json',},
      body: REQUEST_BODY, // Przesunięcie body do obiektu REQUEST
    };
  
    return fetch(SERVER_URL, REQUEST)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Przetwarzanie odpowiedzi jako JSON
      })
      .then((data) => {
        console.log(data);
        if (data != "false"){
          return true;
        }
        else{
          return false;
        }
      })
      .catch((error) => {
        console.log("Błąd: ", error);
      });
  }

  const setCookieEmail = (email) => {
    Cookies.set('myCookieEmail', email, {expires: 1});
  }

  const setCookiePassword = (password) => {
    Cookies.set('myCookiePassword', password, {expires: 1});
  }

  useEffect(() => {



    setEmail(Cookies.get('myCookieEmail'));
    setPassword(Cookies.get('myCookiePassword'));
    // Ten efekt zostanie wykonany tylko raz, po zamontowaniu komponentu.
    // Umieść tutaj kod, który ma być wykonany tylko raz.
  }, []);

  return (

  
    <div className='App'>

      <style>
        {`
          body {
            overflow-y: ${page ? 'visible' : 'hidden'};
            position: ${page ? 'absolute' : 'fixed'};
          
          }

          .App{
            background-color: ${page ? 'black' : '#32322c'};
            height: ${page ? '100%' : '100svh'}
          }
        `}
      </style>

      { page ? ( 
      <>

        <div className="title">
          <div className='logo'> <FaHornbill /> </div>
          <span>Flashcards</span>
        </div>

        <div className='background-logo' style={{opacity: '0.2', zIndex: '-1'}}> <FaHornbill size={100}/> </div>

        <div className='homepage-container'>

          <div className='web-test'>
            <button onClick={() => {
              
              getFlashcardsFromServer('defaultwords', 'none', 'staticUser');
              saveState(tab.length);
              setPage(false);
            }}>WYPRÓBUJ!</button>
          </div>

          

<div style={{padding: '18px', fontSize: '30px'}}>
Flashcards to aplikacja edukacyjna, która umożliwia użytkownikom skuteczne uczenie się i zapamiętywanie informacji przy użyciu elektronicznych wersji karteczek na urządzeniach mobilnych, takich jak smartfony i tablety. Ta aplikacja jest wyjątkowo przydatna dla studentów, uczniów, oraz każdej osoby, która pragnie usprawnić swoją naukę i pamięć.
</div>

<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
<img style={{width: '70%'}}src={AppPhoto}></img>
</div>

          <div className='sign-in'>
            <div style={{fontSize: '25px'}}>LOGOWANIE: </div>

            <div style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      width: '100%',
                      height: '2px',
                      background: 'black',
            }}></div>

            Username
            <br></br>
            <input 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
 
            />
            Hasło
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={() => {downloadFlashcard()}}>ZALOGUJ SIĘ</button>
          </div>

          <div className='sign-up'>
            <div style={{fontSize: '25px'}}>REJESTRACJA: </div>

            <div style={{
                      marginTop: '10px',
                      marginBottom: '10px',
                      width: '100%',
                      height: '2px',
                      background: 'black',
            }}></div>

            Username
            <br></br>
            <input 
              type='text'
              value={registrationEmail}
              onChange={(e) => {setRegistrationEmail(e.target.value)}}
            />
            Hasło
            <input 
              type='password'
              value={registrationPassword}
              onChange={(e) => {setRegistrationPassword(e.target.value)}}
            />

            Powtórz hasło
            <input 
              type='password'
              value={repeatRegistrationPassword}
              onChange={(e) => {setRepeatRegistrationPassword(e.target.value)}}
            />

            <button onClick={async () => {
              if (registrationPassword != repeatRegistrationPassword){
                setDialogText("Hasła się różnią!");
                registration.current.showModal();
                return;
              }

              if(await !createUser()){
                setDialogText("Taki użytkownik już istnieje!");
                registration.current.showModal();
                return;
              }

              setEmail(registrationEmail);
              setPassword(registrationPassword);

              setCookieEmail(registrationEmail);
              setCookiePassword(registrationPassword);

              setPage(false);
              const newTab = [];
              setTab(newTab);
            }}>ZAREJESTRUJ SIĘ</button>
          </div>
        </div>

        <dialog className="delete-dialog" ref={signin}
        style={{textAlign: 'center'}}>
                Błędna nazwa użytkownia lub hasło!
                <div style={{ justifyContent: 'space-between', display: 'flex', textAlign: 'center' }}>
                    <button className="dialog-btn"
                    style={{width: '100%'}}
                        onClick={() => {
                            // method(zindex);
                            // setListening(true);
                            signin.current.close();
                        }
                        }   > 
                    OK</button>
                </div>
        </dialog>

        <dialog className="delete-dialog" ref={registration}
        style={{textAlign: 'center'}}>
                {dialogText}
                <div style={{ justifyContent: 'space-between', display: 'flex', textAlign: 'center' }}>
                    <button className="dialog-btn"
                    style={{width: '100%'}}
                        onClick={() => {
                            // method(zindex);
                            // setListening(true);
                            registration.current.close();
                        }
                        }   > 
                    OK</button>
                </div>
        </dialog>

      </>
      ) : (
      <>
        <div className='background-logo'> <FaHornbill size={100}/> </div>

        <div className="title">
          <div className='logo'> <FaHornbill /> </div>
          <span>Flashcards</span>
          <button className='logo-button'>
            <div className='logo_' onClick={() => {
              signout.current.showModal();
            }}> 
            <FaSignOutAlt size={28}/> 
            </div></button>
          
        </div>

        <div className="cart-container-app">
          <div style={{width: '100%', height: '70px', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', marginTop: '40px',
            cursor: 'pointer', zIndex: '0'}}>
            <button className='restart-btn' onClick={ async() => {await getFlashcardsFromServer(email, password); saveState(tab.length); }}
              >ROZPOCZNIJ OD NOWA</button>
          </div>
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
                          onClick={async () => {

                            if (page == false) {
                              console.log("STATE: " + state);
                              await addFlashcards(state+1,newPl.toUpperCase(), newEng.toUpperCase(), email);
                            }

                            const flashtab = [];
                            for(let i=0; i<tab.length+1; i++ )
                            {
                              if (i < state){
                                  flashtab.push([tab[i][0], tab[i][1]]);
                                }
                                else if (i == state){
                                  flashtab.push([newPl.toUpperCase(), newEng.toUpperCase()]);
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

        <dialog className="delete-dialog" ref={signout}>
                Czy na pewno chcesz się wylogować ? 
                <div style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <button className="dialog-btn"
                        onClick={() => {
                           setPage(true);
                           setEmail("");
                           setPassword("");
                           console.log("test");

                            signout.current.close();
                        }
                        }   > 
                    TAK</button>
                    <button className="dialog-btn"
                        onClick={() => {
     
                            signout.current.close();
                        }}
                    >NIE</button>
                </div>
        </dialog>
      </>
    )}
    </div>
  );
}

export default App;
