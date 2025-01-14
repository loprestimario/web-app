import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css'
import MyPage from "./MyPage.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <MyPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
