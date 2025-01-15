import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NodeModal from "../components/NoteModal";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import NoteCard from "../components/NoteCard";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredNotes, setfilteredNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(false);
  const [query, setQuery] = useState("");

  // Fetch notes function
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/note", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotes(data.notes);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch notes when the component is mounted
  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    console.log("filtering notes", query, notes);
    setfilteredNotes(
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, notes]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onEdit = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const addNote = async ({ title, description }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/note/add",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
          },
        }
      );

      if (response.data.success) {
        closeModal();
        // Refresh the notes after adding a new note
        fetchNotes();
      }
    } catch (error) {
      console.error(
        "Error adding note:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const editNote = async (id, title, description) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/note/${id}`,
        { id, title, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
          },
        }
      );

      if (response.data.success) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === id ? { ...note, title, description } : note
          )
        );
        closeModal();
        fetchNotes(); // Refresh the notes after editing
      }
    } catch (error) {
      console.error(
        "Error editing note:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/note/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
          },
        }
      );

      if (response.data.success) {
        fetchNotes(); // Refresh the notes after deletion
      }
    } catch (error) {
      console.error(
        "Error deleting note:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar setQuery={setQuery} />
      {notes.length === 0 ? (
        <div className="flex justify-center items-center min-h-screen">
          <h2>NOTHING IS THERE TO DISPLAY ADD NEW NOTE</h2>
          <lottie-player
            src="https://lottie.host/01d026af-c19a-4e9e-99c9-40f173871b4e/KRyjBjNXDE.json"
            speed="1"
            style={{ width: "250px", height: "250px" }}
            loop
            autoplay
            direction="1"
            mode="normal"
          ></lottie-player>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex- justify-center items-center min-h-screen ">
          <lottie-player
            src="https://lottie.host/b2374421-1a07-4eda-9dcd-cdcfc1a53831/OdAb8XiVSI.json"
            speed="1"
            style={{ width: "350px", height: "350px" }}
            loop
            autoplay
            direction="1"
            mode="normal"
          ></lottie-player>
        </div>
      ) : (
        <div className="px-8 pt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={onEdit}
              deleteNote={deleteNote}
            />
          ))}
        </div>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed right-4 bottom-4 text-2xl bg-teal-500 text-white font-bold p-4 rounded-full"
      >
        +
      </button>
      {isModalOpen && (
        <NodeModal
          closeModal={closeModal}
          addNote={addNote}
          currentNote={currentNote}
          editNote={editNote}
        />
      )}
    </div>
  );
};

export default Home;
