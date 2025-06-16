/* eslint-disable */

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useParams, useLocation } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./styles/spaces.css";
import "./styles/_primeflex-custom.scss";
import "./App.scss";

function App() {
  let [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users`);
        const result = await res.json();
        if (res.ok) {
          setUsers(result);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [users.length]);

  function addUsers(user) {
    users = [...users, user];
    setUsers(users);
  }

  return (
    <Router>
      <div className="home bg-gray-100 w-full">
        <div
          id="title"
          className="title mt-40px text-center text-4xl sm:text-5xl md:text-5xl"
        >
          Exercise Tracker
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage addUsers={addUsers} users={users} setUsers={setUsers} />
            }
          />
          <Route path="/users/:id/logs" element={<UserDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage({ addUsers, setUsers, users }) {
  return (
    <>
      <Forms addUsers={addUsers} setUsers={setUsers} users={users} />
      <Users users={users} />
    </>
  );
}

function Users({ users }) {
  return (
    <DataTable
      value={users}
      className="w-10 mx-auto mt-8 mb-8 text-xs sm:text-sm md:text-base"
    >
      <Column
        field="username"
        header="Username"
        className="word-break w-4 text-center hyphenate"
      />
      <Column field="_id" header="_id" className="w-4 text-center" />
    </DataTable>
  );
}

function Forms({ addUsers, setUsers, users }) {
  return (
    <div className="flex flex-wrap justify-content-center mt-90px w-full mx-auto">
      <AddUser addUsers={addUsers} />
      <AddExercises />
      <ShowDetails />
      <DeleteUser setUsers={setUsers} users={users} />
    </div>
  );
}

function AddUser({ addUsers }) {
  const [username, setUsername] = useState("");
  const [dialog, setDialog] = useState({
    visible: false,
    message: "",
  });

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user = { username: "", _id: "" };
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        const result = await response.json();
        const { username, _id } = result;
        user = { _id, username };
        addUsers(user);
        setDialog({
          visible: true,
          message: `We have added ${username} to our list! <br/><br/>
      His/Her _id is: <br/><br/>
      <b> ${_id} </b>`,
        });
      }

      if (!response.ok) {
        const result = await response.json();
        setDialog({ visible: true, message: result.error });
      }
    } catch (error) {
      setDialog({
        visible: true,
        message: `Error has occurred. Please Try again.`,
      });
    }
  };

  return (
    <Card
      title="Add User"
      className="w-10 md:w-5 lg:w-25rem xl:w-17rem h-27rem m-4"
    >
      <form className="p-fluid" onSubmit={handleSubmit}>
        <div className="field mb-4">
          <FloatLabel className="mb-4">
            <InputText id="username" onChange={handleChange} required />
            <label htmlFor="username">Username</label>
          </FloatLabel>
        </div>
        <Button label="Add" type="submit" className="w-full" />
      </form>

      <Dialog
        header="Submission"
        visible={dialog.visible}
        style={{ width: "350px", wordBreak: "break-word" }}
        breakpoints={{ "400px": "300px", "338px": "250px" }}
        onHide={() => setDialog({ ...dialog, visible: false })}
        footer={
          <div>
            <Button
              label="OK"
              icon="pi pi-check"
              onClick={() => setDialog({ ...dialog, visible: false })}
              autoFocus
            />
          </div>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: dialog.message }} />
      </Dialog>
    </Card>
  );
}

function AddExercises() {
  const [exercise, setExercise] = useState({
    description: "",
    duration: 0,
    date: "",
  });
  const [dialog, setDialog] = useState({ visible: false, message: "" });
  const [id, setId] = useState("");

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleChange = (e) => {
    setExercise({ ...exercise, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${id}/exercises`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exercise),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const { description, duration, date, username } = result;
        setDialog({
          visible: true,
          message: `The exercise with<br/><br/>
      <b>Description:</b> ${description}<br/>
      <b>Duration:</b> ${duration} min<br/>
      <b>Date:</b> ${date}<br/><br />
      has been added to <b>${username}</b>'s list of exercises.`,
        });
      }
      if (!response.ok) {
        const result = await response.json();
        setDialog({ visible: true, message: result.error });
      }
    } catch (error) {
      setDialog({
        visible: true,
        message: `Error has occurred. Please Try again.`,
      });
    }
  };

  return (
    <Card
      title="Add Exercises"
      className="w-10 md:w-5 lg:w-25rem xl:w-17rem h-27rem m-4"
    >
      <form className="p-fluid" onSubmit={(e) => handleSubmit(e, id)}>
        <div className="field mb-4">
          <FloatLabel className="mb-5">
            <InputText id="_id" name="_id" onChange={handleIdChange} required />
            <label htmlFor="username">_id</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText
              id="description"
              name="description"
              onChange={handleChange}
              required
            />
            <label htmlFor="description">description*</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText
              id="duration"
              name="duration"
              onChange={handleChange}
              required
            />
            <label htmlFor="duration">duration*(min.)</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText id="date" name="date" onChange={handleChange} />
            <label htmlFor="date">date(yyyy-mm-dd)</label>
          </FloatLabel>
        </div>
        <Button label="Add" type="submit" className="w-full" />
      </form>

      <Dialog
        header="Submission"
        visible={dialog.visible}
        style={{ width: "350px", wordBreak: "break-word" }}
        breakpoints={{ "400px": "300px", "338px": "250px" }}
        onHide={() => setDialog({ ...dialog, visible: false })}
        footer={
          <div>
            <Button
              label="OK"
              icon="pi pi-check"
              onClick={() => setDialog({ ...dialog, visible: false })}
              autoFocus
            />
          </div>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: dialog.message }} />
      </Dialog>
    </Card>
  );
}

function ShowDetails() {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState({ visible: false, message: "" });
  const [id, setId] = useState("");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [limit, setLimit] = useState(null);

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setFrom(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setTo(e.target.value);
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };

  const handleSubmit = async (e, id, from, to, limit) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (from) params.append("from", from);
    if (to) params.append("to", to);
    if (limit) params.append("limit", limit);

    const url = `http://localhost:3000/api/users/${id}/logs?${params.toString()}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const result = await response.json();
        const { username, count } = result;
        if (username) params.append("username", username);
        if (count) params.append("count", count);

        navigate(`/users/${id}/logs?${params.toString()}`);
      }
      if (!response.ok) {
        const result = await response.json();
        setDialog({ visible: true, message: result.error });
      }
    } catch (error) {
      setDialog({
        visible: true,
        message: `Error has occurred. Please Try again.`,
      });
    }
  };

  return (
    <Card
      title="Show User Exercises"
      className="w-10 md:w-5 lg:w-25rem xl:w-17rem h-29rem sm:h-27rem m-4"
    >
      <form
        className="p-fluid"
        onSubmit={(e) => handleSubmit(e, id, from, to, limit)}
      >
        <div className="field mb-4">
          <FloatLabel className="mb-5">
            <InputText id="id" onChange={handleIdChange} required />
            <label htmlFor="id">_id</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText id="startDate" onChange={handleStartDateChange} />
            <label htmlFor="startDate">from (yyyy-mm-dd)</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText id="endDate" onChange={handleEndDateChange} />
            <label htmlFor="endDate">to (yyyy-mm-dd)</label>
          </FloatLabel>
          <FloatLabel className="mb-5">
            <InputText id="limit" onChange={handleLimitChange} />
            <label htmlFor="limit">number of exercises</label>
          </FloatLabel>
        </div>
        <Button label="Show" type="submit" className="w-full" />
      </form>
      <Dialog
        header="Submission"
        visible={dialog.visible}
        style={{ width: "350px", wordBreak: "break-word" }}
        breakpoints={{ "400px": "300px", "338px": "250px" }}
        onHide={() => setDialog({ ...dialog, visible: false })}
        footer={
          <div>
            <Button
              label="OK"
              icon="pi pi-check"
              onClick={() => setDialog({ ...dialog, visible: false })}
              autoFocus
            />
          </div>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: dialog.message }} />
      </Dialog>
    </Card>
  );
}

function DeleteUser({ setUsers, users }) {
  const [dialog, setDialog] = useState({ visible: false, message: "" });
  const [id, setId] = useState("");

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        const filteredUSers = users.filter((user) => user._id !== id);
        setUsers(filteredUSers);
        setDialog({ visible: true, message: result.message });
      }
      if (!response.ok) {
        const result = await response.json();
        setDialog({ visible: true, message: result.error });
      }
    } catch (error) {
      setDialog({
        visible: true,
        message: `Error has occurred. Please Try again.`,
      });
    }
  };

  return (
    <Card
      title="Delete User"
      className="w-10 md:w-5 lg:w-25rem xl:w-17rem h-29rem sm:h-27rem m-4"
    >
      <form className="p-fluid" onSubmit={(e) => handleSubmit(e, id)}>
        <div className="field mb-4">
          <FloatLabel className="mb-4">
            <InputText id="_id" onChange={handleIdChange} required />
            <label htmlFor="username">_id</label>
          </FloatLabel>
        </div>
        <Button label="Delete" type="submit" className="w-full" />
      </form>
      <Dialog
        header="Submission"
        visible={dialog.visible}
        style={{ width: "350px", wordBreak: "break-word" }}
        breakpoints={{ "400px": "300px", "338px": "250px" }}
        onHide={() => setDialog({ ...dialog, visible: false })}
        footer={
          <div>
            <Button
              label="OK"
              icon="pi pi-check"
              onClick={() => setDialog({ ...dialog, visible: false })}
              autoFocus
            />
          </div>
        }
      >
        <div dangerouslySetInnerHTML={{ __html: dialog.message }} />
      </Dialog>
    </Card>
  );
}

function UserDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [exercisesToShow, setExercisesToShow] = useState([]);
  const params = new URLSearchParams(location.search);
  const from = params.get("from");
  const to = params.get("to");
  const limit = params.get("limit");
  const username = params.get("username");
  const count = params.get("count");

  useEffect(() => {
    const fetchExercises = async () => {
      const query = new URLSearchParams();
      if (from) query.append("from", from);
      if (to) query.append("to", to);
      if (limit) query.append("limit", limit);
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${id}/logs?${query.toString()}`
        );
        const result = await res.json();
        if (res.ok) {
          const { log } = result;
          log.forEach((exercise) => (exercise.duration += "min"));
          setExercisesToShow(log);
        }
      } catch (err) {
        console.error("Failed to fetch exercises", err);
      }
    };

    fetchExercises();
  }, [id, from, to, limit]);

  return (
    <div>
      <p className="mt-40px text-center text-xl sm:text-2xl md:text-3xl">
        Welcome to {username}'s page
      </p>
      <p className="mt-40px text-center text-lg sm:text-xl md:text-2xl w-7 mx-auto">
        {count
          ? `${username} has ${count} exercises. In the table below the list of his/her exercises.`
          : "No exercises to show!"}
        {count &&
          (from || to || limit) &&
          ` ${
            from || to
              ? `We will show their exercises ${from ? `from the date ${from}` : ""}${to ? ` until the date ${to}` : ""}. `
              : ""
          }${limit ? `The limit of the number of exercises to show is ${limit}.` : ""}`}
      </p>

      <DataTable
        value={exercisesToShow}
        className="w-10 mx-auto mt-8 text-xs sm:text-sm md:text-base"
      >
        <Column
          field="description"
          header="Description"
          className="word-break w-4 text-center hyphenate"
        />
        <Column
          field="duration"
          header="Duration"
          className="w-4 text-center"
        />
        <Column
          field="date"
          header="Date"
          className="w-4 text-center no-wrap"
        />
      </DataTable>

      <Button
        label="Back to Home Page"
        icon="pi pi-home"
        className="block mt-8 mb-8 mx-auto w-40 h-10 text-sm whitespace-nowrap overflow-hidden text-ellipsis"
        onClick={() => navigate("/")}
      />
    </div>
  );
}

export default App;
