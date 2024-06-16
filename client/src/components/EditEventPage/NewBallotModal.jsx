import propTypes from 'prop-types';
import { IoClose } from 'react-icons/io5';
import ErrorMessage from '../ErrorMessage';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function NewBallotModal({ setFetchBallots, closeModal }) {
    const [errors, setErrors] = useState({});
    const { id } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        
        const response = await fetch('/test/api/ballots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                event_id: id
            })
        });

        if(response.status === 201) {
            closeModal();
            setFetchBallots(true);
        }
        else if (response.status === 400) {
            const data = await response.json();
            setErrors(data.errors);
        }
        else {
            setErrors({ name: "An error occurred. Please try again." });
        }
    }

    return (
        <>
            <div className="w-full h-screen bg-black fixed z-10 opacity-75"></div>
            <div className="flex justify-center items-center h-screen w-full fixed z-20 border-box ">
                <div className="bg-white rounded flex flex-col py-6 px-6">
                    <div className="flex items-center">
                        <p className="font-bold text-xl mr-7">Create New Ballot</p>
                        <IoClose onClick={closeModal} className="text-2xl cursor-pointer ml-auto hover:fill-red-700" />
                    </div>
                    <form onSubmit={submitHandler} className="mt-5 flex flex-col">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-xs font-bold text-gray-600">NAME</label>
                            <input type="text" name="name" id="name" className="border border-black rounded px-2 py-2" />
                            { errors.name ? <ErrorMessage string={errors.name}/> : null }
                        </div>
                        <button type="submit" className="bg-slate-400 text-black mt-3 px-7 py-2 rounded hover:brightness-75 font-semibold">Create</button>
                    </form>
                </div>
            </div>
        </>
    )
}

NewBallotModal.propTypes = {
    setFetchBallots: propTypes.func.isRequired,
    closeModal: propTypes.func.isRequired
}

export default NewBallotModal;