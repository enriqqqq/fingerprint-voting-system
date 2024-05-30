import propTypes from "prop-types";
import ErrorMessage from "../ErrorMessage";
import { useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { TbFingerprintOff, TbFingerprint } from "react-icons/tb";
import { useHardware } from "../../contexts/hardwareContext";
import { useState } from "react";

function NewVoterModal({ closeModal, setFetchVoters }) {
    const { device, fingerprint, setFingerprint, connectToHardware } = useHardware();
    const [errors, setErrors] = useState({});

    const { id } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;

        // Send the data to the server 
        const response = await fetch('/test/api/voters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, fingerprint, event_id: id })
        });

        if (response.status === 201) {
            closeModal();
            setFingerprint([]);
            setFetchVoters(true);
        } else if (response.status === 400) {
            const data = await response.json();
            setErrors(data.errors);
            if(data.errors.fingerprint) {
                setFingerprint([]);
            }
        } else {
            console.log("An error occurred");
        }
    }

    return (
        <>
            <div className="w-full h-screen bg-black fixed z-10 opacity-75"></div>
            <div className="flex justify-center items-center h-screen w-full fixed z-20 border-box ">
                <div className="bg-white rounded flex flex-col py-6 px-6">
                    <div className="flex items-center">
                        <p className="font-bold text-xl">New Voter</p>
                        <IoClose onClick={closeModal} className="text-2xl cursor-pointer ml-auto hover:fill-red-700" />
                    </div>
                    <form className="mt-5 flex flex-col" onSubmit={submitHandler}>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="name" className="text-xs font-bold text-gray-600">NAME</label>
                            <input type="text" name="name" id="name" className="border border-black rounded px-2 py-2" />
                            { errors.name ? <ErrorMessage string={errors.name}/> : null }
                        </div>
                        <div className="mt-5 flex gap-3">
                            {fingerprint.length === 512 ? <TbFingerprint className="text-6xl"/> : <TbFingerprintOff className="text-6xl"/>}
                            <div className="flex flex-col justify-center">                  
                                {device ? <p className="bg-amber-400 rounded text-sm font-bold self-start px-1">Connected</p> : <button className="text-sm border border-black px-1 bg-gray-100 rounded self-start" onClick={(e) => {e.preventDefault(); connectToHardware()}}>Connect</button>}
                                {fingerprint.length === 512 
                                    ? <p className="text-sm">Fingerprint loaded</p>
                                    : <p className="text-sm">No Fingerprint loaded</p>}
                                { errors.fingerprint ? <ErrorMessage string={errors.fingerprint}/> : null }
                            </div>
                        </div>
                        <button type="submit" className="bg-slate-400 text-black mt-3 px-7 py-2 rounded hover:brightness-75 font-semibold">Create</button>
                    </form>
                </div>
            </div>
        </>
    )
}

NewVoterModal.propTypes = {
    closeModal: propTypes.func.isRequired,
    setFetchVoters: propTypes.func.isRequired
}

export default NewVoterModal;