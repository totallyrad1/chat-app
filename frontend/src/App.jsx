import {Routes, Route, Navigate} from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css"
import {Container, Nav} from "react-bootstrap"
import NavBar from "./components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import Settings from "./pages/Settings";

function App() {
  const {user} = useContext(AuthContext);

  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />}></Route>
          <Route path="/settings" element={user ? <Settings /> : <Login />}></Route>
          <Route path="/login" element={user ? <Chat /> : <Login />}></Route>
          <Route path="/register" element={user ? <Chat /> : <Register />}></Route>
          <Route path="*" element={<Navigate to="/"/>}></Route>
        </Routes>
      </Container>
    </ChatContextProvider>
  )
}

export default App
