import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';
import log from "eslint-plugin-react/lib/util/log.js";

const MyPage = () => {
  const [ambulatori, setAmbulatori] = useState([]);
  const [ambulatorio, setAmbulatorio] = useState([1]);
  const [bodyParts, setBodyParts] = useState([]);
  const [bodyPart, setBodyPart] = useState([]);
  const [tests, setTests] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [noResultSearch, setNoResultSearch] = useState(false);
  const [loading, setLoading] = useState(false);
    const [esamiSelezionati, setEsamiSelezionati] = useState([]);


  const load = () => {
      // all ambulatori
      setAmbulatori([]);
      setSearchActive(false);
      setNoResultSearch(false);
      axios.get('https://mysql-app-1dc5cb1ca38d.herokuapp.com/ambulatori/', {})
          .then(res => {
              setAmbulatori(res.data);
              console.log("setAmbulatori  ", res.data)
          })
          .catch(err => console.log("error", err));

      // load body part relativi al Primo ambulatorio
      axios.get('https://mysql-app-1dc5cb1ca38d.herokuapp.com/body/', {params: {id: 1}})
          .then(res => {
                  setBodyParts(res.data);

              console.log("res.datares.datares.data  ", res.data)
                  axios.get('https://mysql-app-1dc5cb1ca38d.herokuapp.com/exams/', {params: {id: 1, id_bd: res.data[0].id}})
                      .then(res => {setTests(res.data)
                      })
                      .catch(err => console.log("error", err))
              }
          )
          .catch(err => console.log("error", err));
  }

    const loadEsamiSelezionati = () => {
        // all ambulatori
        axios.get('https://mysql-app-1dc5cb1ca38d.herokuapp.com/esami_selezionati/', {})
            .then(res => {
                setEsamiSelezionati(res.data);
                console.log("esamiiiiiiiii   ", res.data)
            })
            .catch(err => console.log("error", err));
    }

    const deleteEsame = (id) => {
        // all ambulatori

        console.log("idddddddddddd deleteee  ", id)
        axios.delete('https://mysql-app-1dc5cb1ca38d.herokuapp.com/delete/' + id, {params: { id: id}})
            .then(res => {
                console.log("esamiiiiiiiii   ", res)
                const esamiSelezionatiUpdated =  esamiSelezionati.filter((esami) => {
                    if(esami.id_esame != id)
                        return esami
                    return name
                })
                console.log(esamiSelezionatiUpdated)
            })
            .catch(err => console.log("error", err));
    }

    const insertEsame = () => {
        // all ambulatori
        axios.get('https://mysql-app-1dc5cb1ca38d.herokuapp.com/delete/', {})
            .then(res => {
                setEsamiSelezionati(res.data);
                console.log("esamiiiiiiiii   ", res.data)
            })
            .catch(err => console.log("error", err));
    }



  useEffect(() => {
      load();
      loadEsamiSelezionati();
      setNoResultSearch(false);
  }, []);


  useEffect(() => {
    if(!searchActive){

        setBodyParts([]);
        setTests([]);
      console.log("load body part relativi all' ambulatorio selezionato")
    // load body part relativi all' ambulatorio selezionato
    axios.get('https://mysql-app-1dc5cb1ca38d.herokuapp.com/body/', {params: {id: ambulatorio}})
         .then(res => {setBodyParts(res.data)

             console.log("sec 2 ambulatorio ", ambulatorio)
             console.log("sec 2  ", res.data)

         axios.get('https://mysql-app-1dc5cb1ca38d.herokuapp.com/exams/', {params: {id: ambulatorio, id_bd: res.data[0].id}})
              .then(res => { setTests(res.data)
              })
              .catch(err => console.log("error", err))
        })
    }
  }, [ambulatorio]);

  useEffect(() => {
      if(!searchActive){
          setTests([]);

          axios.get('https://mysql-app-1dc5cb1ca38d.herokuapp.com/exams/', {params: {id: ambulatorio, id_bd: bodyPart}})
          .then(res => {setTests(res.data)})
          .catch(err => console.log("error", err))
      }
  }, [ bodyPart]);

  const  searchFunc = (min_id, typeSearch) => {
      setNoResultSearch(false);
      axios.get('https://mysql-app-1dc5cb1ca38d.herokuapp.com/search/', {params: {id: min_id, typeSearch: typeSearch}})
          .then(res => {


              if(res.data[0]){

                  const ambulatoriSearch = [];
                  const bodyPartSearch = [];
                  const testSearch = [];
                  res.data.forEach((data) => {
                      if (!ambulatoriSearch.find(elem => elem.id === data.id_amb)){
                          ambulatoriSearch.push(  {id: data.id_amb , name: data.name})
                      }
                      if (!bodyPartSearch.find(elem => elem.id === data.body)){
                          bodyPartSearch.push({id: data.body , nome: data.nome})
                      }
                      if (!testSearch.find(elem => elem.id === data.id_esame)){
                          testSearch.push({id: data.id_esame , descrizione: data.descrizione})
                      }
                  });

                  console.log("res.datares.data ", res.data)
                 // const bodyPartSearch = [{id: res.data[0].body , nome: res.data[0].nome}];
                  console.log("res.datares.data bodyPartSearch", testSearch)

                  //const testSearch = [{id: res.data[0].id_esame , descrizione: res.data[0].descrizione}];
                  setAmbulatori(ambulatoriSearch);
                  setBodyParts(bodyPartSearch);
                  setTests(testSearch);
                  setSearchActive(true);
              }
              else {
                  setNoResultSearch(true);
                  setSearchActive(false);

              }
              setLoading(false);

          })
          .catch(err => {
              setLoading(false);

              console.log("error", err)

          })
  }

  return (
      <>
          <div className="search-container">
              <form className="row g-3"
                    onSubmit={e => {
                        setLoading(true);
                        e.preventDefault();
                        e.stopPropagation();

                        searchFunc(e.target[0].value, e.target[1].value)
                    }}
              >

                  <div className="row g-2">
                      <div className="col-md">
                          <div className="form-floating">
                              <input type="text" name="username"
                                     className="form-control" id="floatingInputGrid"/>
                              <label htmlFor="floatingInputGrid">Search</label>
                          </div>
                      </div>
                      <div className="col-md">
                          <div className="form-floating">
                              <select className="form-select" id="floatingSelectGrid">
                                  <option key="1" value="Codice Ministeriale">Codice Ministeriale</option>
                                  <option key="2" value="Codice interno">Codice Interno</option>
                                  <option key="3" value="descrizione">Descrizione Esame</option>
                              </select>
                              <label htmlFor="floatingSelectGrid">Seleziona il tipo di ricerca</label>
                          </div>
                      </div>
                  </div>
                  <div className="col-12">
                      {loading ?
                          <div className="spinner-border" role="status"/> :
                          <button type="submit" className="btn btn-primary">Avvia ricerca</button>
                      }

                      {noResultSearch && <div>Nessun risultato trovato</div>}

                  </div>
                  <div className="col-12">
                      <button type="reset" onClick={() => load()} className="btn btn-success">Reset</button>
                  </div>
              </form>
          </div>
          <div className="container d-flex">
              <div className="ambulatori">
                  <div className="title ">Ambulatori</div>
                  <div>
                      <div>
                          <select className="form-select" id="floatingSelect"
                                  onChange={(e) => setAmbulatorio(e.target.value)}
                          >
                              {ambulatori.map(amb => (
                                  <option key={amb.name} className="ambulatori" value={amb.id}>{amb.name}</option>
                              ))}
                          </select>
                      </div>
                  </div>
              </div>
              <div className="body-part">
                  <div className="title ">
                      Parti del corpo
                  </div>
                  <select className="form-select" id="floatingSelect-2"
                          onChange={(e) => setBodyPart(e.target.value)}
                  >
                      {bodyParts.map(bd => (
                          <option className="bodyparts" key={bd.nome} value={bd.id}>{bd.nome}</option>
                      ))}
                  </select>
              </div>
              <div className="exams">
                  <div className="title ">Esami</div>

                  <select className="form-select" size="3" aria-label="Size 3 select example">
                      {
                          tests.map(test => (
                              <option className="tests" key={test.descrizione}
                                      value={test.id}>{test.descrizione}</option>

                          ))
                      }

                  </select>
              </div>
              <div className="">
                  <button type="button" onClick={() => console.log("esame")} className="btn btn-success">Seleziona
                      esame
                  </button>
              </div>
          </div>


          <table className="table">
              <thead>
              <tr>
                  <th scope="col">#</th>
                  <th scope="col">Esame</th>
                  <th scope="col">Laboratorio</th>
                  <th scope="col">Codice ministeriale</th>
                  <th scope="col">Codice interno</th>
                  <th scope="col">Elimina</th>
              </tr>
              </thead>
              <tbody className="table-group-divider">
              {
                  esamiSelezionati.map((test,index) => (
                      <tr>
                          <th scope="row">{index + 1 }</th>
                          <td>{test.descrizione}</td>
                          <td>{test.name}</td>
                          <td>{test['codice Ministeriale']}</td>
                          <td>{test['codice interno']}</td>
                          <td>
                              <button type="button" className="btn btn-sm btn-outline-danger" id={test.id_esame}
                              onClick={(e) => deleteEsame(e.target.id)}
                              >Rimuovi</button>
                          </td>
                      </tr>

                  ))
              }
              </tbody>
          </table>
      </>

  )
}

export default MyPage;