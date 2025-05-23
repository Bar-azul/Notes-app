import React, {useEffect, useState} from 'react'
import Navbar from "../../components/Navbar/Navbar.jsx";
import NoteCard from "../../components/Cards/NoteCard.jsx";
import {MdAdd} from "react-icons/md";
import AddEditNotes from "./AddEditNotes.jsx";
import Modal from "react-modal";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import moment from "moment";
import EmptyCard from "../../components/EmptyCard/EmptyCard.jsx";
import AddNotesImg from "../../assets/add2.svg"

const Home = () =>{

    const [openAddEditModal, setOpenAddEditModal] = useState({
       isShown:false,
       type:"add",
       data:null
    });

    const [allNotes, setAllNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();

    const handleEdit = async (noteDetails) =>{
        setOpenAddEditModal({isShown: true, data: noteDetails, type: "edit"})

    }

    const getUserInfo = async () => {
        try {
            const response = await  axiosInstance.get("/get-user");
            if(response.data && response.data.user){
                setUserInfo(response.data.user);
            }
        }
        catch(error)
        {
            if(error.response.status === 401){
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    const getAllNotes = async () =>{
        try{
            const response = await axiosInstance.get("/get-all-notes");

            if(response.data &&response.data.notes){
                setAllNotes(response.data.notes);
            }
        }
        catch(error){
            console.log("An unexpected error occurred. Please try again");

        }

    };

    const deleteNote = async (data) => {

        const noteId = data._id;
        try {
            const response = await axiosInstance.delete("delete-note/"+noteId);
            if (response.data&&response.data.note) {
                getAllNotes()
            }
        }catch(error){
            if(
                error.response && error.response.data && error.response.data.message){
                console.log("An unexpected error occurred. Please try again");
            }
        }
    };

    const onSearchNote = async (query)=>{
      try{
          const response = await axiosInstance.get("/search-notes",{
              params: {query},

          });
          if(response.data && response.data.notes){
              setIsSearch(true);
              setAllNotes(response.data.notes);
          }
      }catch (error){
        console.log(error);

      }
    };

    const handleClearSearch = ()=>{
        setIsSearch(false);
        getAllNotes();
    }

    const isPinnedNote = async (noteData) => {

        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("update-pinned-note/"+noteId,{
                "isPinned": !noteData.isPinned,
            });
            if (response.data && response.data.note) {
                getAllNotes()
            }
        }catch(error){
            if(
                error.response && error.response.data && error.response.data.message){
                console.log("An unexpected error occurred. Please try again");
            }
        }
    };


    useEffect(() => {
        getAllNotes();
        getUserInfo();
        return () =>{};
    }, []);


    return(
        <>
            <Navbar userInfo={userInfo}
                    onSearchNote={onSearchNote}
                    handleClearSearch={handleClearSearch}/>
            <div className={"container mx-auto"}>
                {allNotes.length>0?(
                    <div className={"grid grid-cols-3 gap-4 mt-8"}>
                    {allNotes.map((item, index) => (
                        <NoteCard
                            key={item._id}
                            title={item.title}
                            date={moment(item.createdOn).format("Do MMM YYYY")}
                            content={item.content}
                            tags={item.tags}
                            isPinned={item.isPinned}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => {
                                deleteNote(item)
                            }}
                            onPinNote={() => {
                                isPinnedNote(item)
                            }}
                        />
                    ))}
                </div>
                ):(
                    <EmptyCard
                        imgSrc={AddNotesImg}
                        message={"Start creating your first note! click the 'Add' button to write down your " +
                        "thoughts, ideas, and reminders. Let's get started!"}/>
                )}
            </div>

            <button
                className={"w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-400 hover:bg-blue-600 absolute right-10 bottom-10 cursor-pointer"}
                onClick={()=>{
                    setOpenAddEditModal({isShown: true, type:"add", data:null});
                }}
            >
                <MdAdd className={"text-[32px] text-white cursor-pointer"}/>
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={()=>{}}
                style={{
                    overlay:{
                        backgroundColor: "rgba(0,0,0,0.2)",
                    },
                }}
                contentLabel={""}
                className={"w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"}
            >

                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={()=>{
                        setOpenAddEditModal({isShown: false, type: "add", data: null});
                    }}
                    getAllNotes={getAllNotes}
                />
            </Modal>
        </>
    )

}
export default Home