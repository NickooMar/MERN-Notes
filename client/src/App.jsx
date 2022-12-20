import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import NotesList from "./features/notes/NotesList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";

import Prefetch from "./features/auth/Prefetch";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route element={<Prefetch />}>
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Welcome />} />

            <Route path="users">
              <Route index element={<UsersList />} />
              <Route path=":id" element={<EditUser />} />{" "}
              {/* http://localhost:5173/dash/users/{:id} */}
              <Route path="new" element={<NewUserForm />} />{" "}
              {/* http://localhost:5173/dash/users/new */}
            </Route>

            <Route path="notes">
              <Route index element={<NotesList />} />
              <Route path=":id" element={<EditNote />} />{" "}
              {/* http://localhost:5173/dash/notes/{:id} */}
              <Route path="new" element={<NewNote />} />{" "}
              {/* http://localhost:5173/dash/notes/new */}
            </Route>
          </Route>
        </Route>
        {/* END DASH (Privates routes) */}
      </Route>
    </Routes>
  );
}

export default App;
