import { useState } from "react";
import propTypes from 'prop-types';
import { IoClose } from "react-icons/io5";

function NewEventModal({ closeModal }) {
    const [error, setError] = useState(null);  

    return(
        <>
            <div onClick={null} className="w-full h-screen bg-black fixed z-10 opacity-75"></div>
            <div className="flex justify-center items-center h-screen w-full fixed z-20 border-box ">
                <div className="bg-white rounded flex flex-col py-6 px-6">
                    <div className="flex items-center">
                        <p className="font-bold text-xl">Create New Event</p>
                        <IoClose onClick={closeModal} className="text-2xl cursor-pointer ml-auto hover:fill-red-700" />
                    </div>
                    <form className="mt-5 flex flex-col" action="">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="title" className="text-xs font-bold text-gray-600">TITLE</label>
                            <input type="text" id="title" className="border border-black rounded px-2 py-2" />
                            { error && <errorMessage string='Title is required'/>}
                        </div>
                        <div className="flex flex-col mt-3 gap-1">
                            <label htmlFor="description" className="text-xs font-bold text-gray-600">DESCRIPTION</label>
                            <textarea name="" id="description" cols="30" rows="5" className="border border-black rounded px-2 py-2" placeholder='(Optional)'></textarea>
                        </div>
                        <button className="bg-slate-400 text-black mt-3 px-7 py-2 rounded hover:brightness-75 font-semibold">Create</button>
                    </form>
                </div>
            </div>
        </>
    )
}

function errorMessage({ string }) {
    return(
        <>
            <p className="text-xs text-red-500">{string}</p>
        </>
    )
}

errorMessage.propTypes = {
    string: propTypes.string.isRequired
}

NewEventModal.propTypes = {
    closeModal: propTypes.func.isRequired
}

export default NewEventModal;