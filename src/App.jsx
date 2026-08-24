import { useState } from "react";
import "./App.css";
import PerfilUsuario from "./features/profile/PerfilUsuario";
import EditarPerfil from "./features/profile/EditarPerfil";

function App() {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EditarPerfil
        onCancel={() => setEditing(false)}
        onSave={(data) => {
          console.log("Datos guardados:", data);
          setEditing(false);
        }}
      />
    );
  }

  return <PerfilUsuario onEditClick={() => setEditing(true)} />;
}

export default App;