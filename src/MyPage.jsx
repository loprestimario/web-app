import React, {useEffect, useState} from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios';

const PATH_BASE = "https://mysql-app-1dc5cb1ca38d.herokuapp.com"

const MyPage = () => {
  const [ambulatori, setAmbulatori] = useState([]);
  const [ambulatorio, setAmbulatorio] = useState([1]);
  const [bodyParts, setBodyParts] = useState([]);
  const [bodyPart, setBodyPart] = useState([]);
  const [tests, setTests] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [noResultSearch, setNoResultSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [esamiSelezionati, setEsamiSelezionati] = useState([]);


  const load = () => {
    // all ambulatori
    setAmbulatori([]);
    setNoResultSearch(false);
    setSearchText("")

    axios.get(`${PATH_BASE}/ambulatori`, {})
      .then(res => {
        setAmbulatori(res.data);
      })
      .catch(err => console.log("error", err));

    // load body part relativi al Primo ambulatorio
    axios.get(`${PATH_BASE}/body`, {params: {id: 1}})
      .then(res => {
        setBodyParts(res.data);
        axios.get(`${PATH_BASE}/exams`, {params: {id: 1, id_bd: res.data[0].id}})
          .then(res => {
            setTests(res.data)
          })
          .catch(err => console.log("error", err))
      }).catch(err => console.log("error", err));
  }

  const loadEsamiSelezionati = () => {
    // all ambulatori
    axios.get(`${PATH_BASE}/esami_selezionati`, {})
      .then(res => {
        setEsamiSelezionati(res.data);
      })
      .catch(err => console.log("error", err));
  }

  const deleteEsame = (id) => {
    axios.delete(`${PATH_BASE}/delete/` + id, {params: {id: id}})
      .then(res => {
        const esamiSelezionatiUpdated = esamiSelezionati.filter((esami) => {
          if (esami.id_esame != id)
            return esami
          return name
        })
        setEsamiSelezionati(esamiSelezionatiUpdated)
      })
      .catch(err => console.log("error", err));
  }

  const insertEsame = (id) => {
    // all ambulatori
    axios.post(`${PATH_BASE}/insert/` + id, {params: {id: 1}})
      .then(res => {
        loadEsamiSelezionati();
      })
      .catch(err => console.log("error", err));
  }


  useEffect(() => {
    load();
    loadEsamiSelezionati();
    setNoResultSearch(false);
  }, []);


  useEffect(() => {
      setBodyParts([]);
      setTests([]);
      // load body part relativi all' ambulatorio selezionato
      axios.get(`${PATH_BASE}/body`, {
        params: {
          id: ambulatorio,
          searchText: searchText
        }
      })
        .then(res => {
          setBodyParts(res.data)
          axios.get(`${PATH_BASE}/exams`, {
            params: {
              id: ambulatorio,
              id_bd: res.data[0].id
            }
          })
            .then(res => {
              setTests(res.data)
            })
            .catch(err => console.log("error", err))
        })

  }, [ambulatorio]);

  useEffect(() => {
      setTests([]);
      axios.get(`${PATH_BASE}/exams`, {
        params: {
          id: ambulatorio,
          id_bd: bodyPart
        }
      })
        .then(res => {
          setTests(res.data)
        })
        .catch(err => console.log("error", err))

  }, [bodyPart]);

  const searchFunc = (min_id, typeSearch) => {
    setNoResultSearch(false);
    setSearchText(min_id);
    axios.get(`${PATH_BASE}/search`, {params: {id: min_id, typeSearch: typeSearch}})
      .then(res => {

        if (res.data[0]) {
          const ambulatoriSearch = [];
          const bodyPartSearch = [];
          const testSearch = [];
          res.data.forEach((data) => {
            if (!ambulatoriSearch.find(elem => elem.id === data.id_amb)) {
              ambulatoriSearch.push({id: data.id_amb, name: data.name})
            }
          });

          setAmbulatorio(ambulatoriSearch[0].id);
          res.data.forEach((data) => {
            if (!bodyPartSearch.find(elem => elem.id === data.body)) {
              if (ambulatoriSearch[0].id == data.id_amb)
                bodyPartSearch.push({id: data.body, nome: data.nome})
            }
          });

          res.data.forEach((data) => {
            if (!testSearch.find(elem => elem.id === data.id_esame)) {
              if (bodyPartSearch[0].id == data.body)
                testSearch.push({id: data.id_esame, descrizione: data.descrizione})
            }
          });

          setAmbulatori(ambulatoriSearch);
          setBodyParts(bodyPartSearch);
          setTests(testSearch);
        } else {
          setNoResultSearch(true);
        }
        setLoading(false);

      })
      .catch(err => {
        setLoading(false);
        console.log("error", err)
      })
  }

  const enableButton = () => {
    if (document.getElementById("searchText").value === "") {
      document.getElementById('searchButton').disabled = true;
    }
    else {
      document.getElementById('searchButton').disabled = false;
    }
  }

  return (
    <>
      <div className="search-container-form">
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
                <input type="text"
                       className="form-control" id="searchText" onChange={() => enableButton()}/>
                <label htmlFor="floatingInputGrid">Search</label>
              </div>
            </div>
            <div className="col-md">
              <div className="form-floating" onChange={() => enableButton()}>
                <select className="form-select" id="floatingSelectGrid">
                  <option key="1" value="Codice Ministeriale">Codice Ministeriale</option>
                  <option key="2" value="Codice interno">Codice Interno</option>
                  <option key="3" value="descrizione">Descrizione Esame</option>
                </select>
                <label htmlFor="floatingSelectGrid">Seleziona il tipo di ricerca</label>
              </div>
            </div>
          </div>
          <div className="buttons-container d-flex justify-content-center mx-auto">
            <div className="search-container">
              {loading ?
                <div className="spinner-border" role="status"/> :
                <button type="submit" className="btn btn-primary" disabled={true} id="searchButton">Avvia ricerca</button>
              }
            </div>
            <div className="reset-container">
              <button type="reset" onClick={() => load()} className="btn btn-danger">Reset</button>
            </div>
          </div>
          <div className="no-result">{noResultSearch && <p> Nessun risultato trovato</p>}</div>
        </form>
      </div>
      <div className="container-panel d-flex">
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
          <select className="form-select" size="3" aria-label="Size 3 select" id="selectExam">
            {
              tests.map((test, index) => (
                <option className="tests" key={test.descrizione}
                        value={test.id_esame} selected={index == 0}
                        onChange={() => console.log("test.id_esame")}>{test.descrizione}</option>
              ))
            }
          </select>
        </div>
        <div className="select-button">
          <button type="button"
                  onClick={() => insertEsame(document.getElementById('selectExam').selectedOptions[0].value)}
                  className="btn btn-success">Seleziona
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
          esamiSelezionati.map((test, index) => (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{test.descrizione}</td>
              <td>{test.name}</td>
              <td>{test['codice Ministeriale']}</td>
              <td>{test['codice interno']}</td>
              <td>
                <button type="button"
                        className="btn btn-sm btn-outline-danger"
                        id={test.id_esame}
                        onClick={(e) => deleteEsame(e.target.id)}>
                    Rimuovi
                </button>
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