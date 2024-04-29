import React, { useEffect, useState } from "react";
import HelloWorld from "./components/screens/HelloWorld";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SingleView from "./components/screens/SingleView";
import SignUpPage from "./components/screens/SignUpPage";
import LoginPage from "./components/screens/LoginPage";
// import Basic from "./components/screens/Basic";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HelloWorld />} />
        <Route path="/singleView/:itemId/:status" element={<SingleView />} />
      </Routes>
    </Router>
  );
}

export default App;
