import React, {useState} from 'react'
import TagInput from "../../components/Input/TagInput.jsx";
import {MdClose} from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance.js";

const AddEditNotes = ({type,onClose,noteData,getAllNotes}) =>{

    const [title, SetTitle] = useState(noteData?.title||"");
    const [content, SetContent] = useState(noteData?.content||"");
    const [tags, SetTags] = useState(noteData?.tags||"");
    const [error, SetError] = useState(null);

    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("add-note", {
                title,
                content,
                tags,
            });
            if (response.data&&response.data.note) {
                getAllNotes()
                onClose()
            }
        }catch(error){
            if(
                error.response&&error.response.data&&error.response.data.message){
                SetError(error.response.data.message);
            }
        }
    };
    const editNote = async () => {

        const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("edit-note/"+noteId, {
                title,
                content,
                tags,
            });
            if (response.data&&response.data.note) {
                getAllNotes()
                onClose()
            }
        }catch(error){
            if(
                error.response && error.response.data && error.response.data.message){
                SetError(error.response.data.message);
            }
        }




    };

    const handleAddNote = () => {
        if(!title){
            SetError("Please enter the title");
            return;
        }
        if(!content){
            SetError("Please enter the content");
            return;
        }
        SetError("");

        if(type === "edit"){
            editNote();
        }else{
            addNewNote();
        }

    };



    return(
        <div  className={"relative"}>
            <button className={"w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50 cursor-pointer"}
                    onClick={onClose}>
                <MdClose className={"text-xl text-slate-400"}/>

            </button>
            <div className={"flex flex-col gap-2"}>
                <label className="input-label">TITLE</label>
                <input
                    type={"text"}
                    className={"text-2xl text-slate-950 outline-none"}
                    placeholder={"Go to the Gym At 6"}
                    value={title}
                    onChange={({target}) => SetTitle(target.value)}
                />
            </div>


            <div className={"flex flex-col gap-2 mt-4"}>
                <label className="input-label">CONTENT</label>
                <textarea
                    type={"text"}
                    className={"text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"}
                    placeholder={"Content"}
                    rows={10}
                    value={content}
                    onChange={({target}) => SetContent(target.value)}
                />

                <div className={"mt-3"}>
                    <label className="input-label">TAGS</label>
                    <TagInput tags={tags} setTags={SetTags}/>
                </div>

                {error&& <p className="text-red-500 text-xs pb-1">{error}</p> }

                <button className={"btn-primary font-medium mt-5 p-3 cursor-pointer"}
                        onClick={handleAddNote}>
                    {type==="add"? "ADD" : "UPDATE"}
                </button>
            </div>
        </div>

    )
    }
export default AddEditNotes