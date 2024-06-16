import { useState } from "react";
import propTypes from 'prop-types';
import { IoClose } from "react-icons/io5";
import { useUser } from "../../contexts/userContext";
import ErrorMessage from "../ErrorMessage";

function NewEventModal({ closeModal, fetchEvents }) {
    const [errors, setErrors] = useState({});  
    const { user } = useUser();

    const submitHandler = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        
        const response = await fetch('/test/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                user_id: user._id
            })
        });

        if(response.status === 201) {
            closeModal();
            fetchEvents();
        }
        else if (response.status === 400) {
            const data = await response.json();
            setErrors(data.errors);
        }
        else {
            setErrors({ title: "An error occurred. Please try again." });
        }
    }

    return(
        <>
            <div className="w-full h-screen bg-black fixed z-20 opacity-75"></div>
            <div className="flex justify-center items-center h-screen w-full fixed z-30 border-box ">
                <div className="bg-white rounded flex flex-col py-6 px-6">
                    <div className="flex items-center">
                        <p className="font-bold text-xl">Create New Event</p>
                        <IoClose onClick={closeModal} className="text-2xl cursor-pointer ml-auto hover:fill-red-700" />
                    </div>
                    <form onSubmit={submitHandler} className="mt-5 flex flex-col">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="title" className="text-xs font-bold text-gray-600">TITLE</label>
                            <input type="text" name="title" id="title" className="border border-black rounded px-2 py-2" />
                            { errors.title ? <ErrorMessage string={errors.title}/> : null }
                        </div>
                        <div className="flex flex-col mt-3 gap-1">
                            <label htmlFor="description" className="text-xs font-bold text-gray-600">DESCRIPTION</label>
                            <textarea name="description" id="description" cols="30" rows="5" className="border border-black rounded px-2 py-2" placeholder='(Optional)'></textarea>
                            { errors.description ? <ErrorMessage string={errors.description}/> : null }
                        </div>
                        <button type="submit" className="bg-slate-400 text-black mt-3 px-7 py-2 rounded hover:brightness-75 font-semibold">Create</button>
                    </form>
                </div>
            </div>
        </>
    )
}

NewEventModal.propTypes = {
    fetchEvents: propTypes.func.isRequired,
    closeModal: propTypes.func.isRequired
}

export default NewEventModal;