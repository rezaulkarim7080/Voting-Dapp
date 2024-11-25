import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Details from "./components/newCompolents/Details";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/newCompolents/Footer";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/polls/:id" element={<Details />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
