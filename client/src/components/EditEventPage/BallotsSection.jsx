import { useEffect, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import propTypes from 'prop-types'
import ErrorMessage from '../ErrorMessage';
import { useParams } from 'react-router-dom';
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { IoMdSave } from "react-icons/io";

function BallotsSection({ openFormModal, fetchBallots, setFetchBallots }) {
    const [ballots, setBallots] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            try {
                if(fetchBallots) {
                    setLoading(true);
                    const response = await fetch(`/test/api/events/${id}/ballots`);
                    if(response.status != (200 || 304)) {
                        setBallots([]);
                    } else {
                        const data = await response.json();
                        console.log(data.ballots);
                        setBallots(data.ballots);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
                setFetchBallots(false);
            }
        })()
    }, [id, fetchBallots, setFetchBallots]);

    const removeHandler = async (ballot_id) => {
        try {
            const response = await fetch(`/test/api/events/${id}/ballots/${ballot_id}/delete`, {
                method: 'DELETE'
            });
            if(response.status === 200) {
                setBallots((prevBallots) => {
                    return prevBallots.filter((ballot) => ballot._id !== ballot_id);
                });
            }
        } catch (error) {
            console.log(error);
        } 
    }

    return (
        <div className="flex flex-col gap-3 mb-9">
            <p className="font-bold text-lg mt-5">Ballots</p>

            {/* 100vw = max width, 16rem = width of sidebar, 5rem = 2*padding-x, 17px = width of scrollbar-y (chrome) */}
            <div className="flex flex-1 overflow-auto w-[calc(100vw_-_16rem_-_5rem_-_17px)]">
                <div className="flex gap-2 items-center w-100 mb-2">
                    <div onClick={openFormModal} className="hover:cursor-pointer h-96 w-72 border-2 border-gray-400 border-dashed rounded-xl flex flex-col justify-center items-center">
                        <IoMdAdd className="text-3xl fill-gray-500"/>
                    </div>
                    {
                    loading 
                        ? <p>Loading</p>
                        : ballots.map((ballot) => {
                            return(
                                <Ballot key={ballot._id} ballot={ballot} removeHandler={()=>{removeHandler(ballot._id)}} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

function Ballot({ ballot, removeHandler }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(ballot.name);
    const [originalName, setOriginalName] = useState(ballot.name);
    const [errors, setErrors] = useState({});

    const submitHandler = async (e) => {
        e.preventDefault();
        if(!editing) {
            return;
        }

        if(editing) {
            try {
                const response = await fetch(`/test/api/events/${ballot.event_id}/ballots/${ballot._id}/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name
                    })
                });

                const data = await response.json();

                if(response.status === 200) {
                    setErrors({});
                    setOriginalName(name);
                    setName(name);
                } else if (response.status === 400) {
                    setErrors(data.errors);
                    setName(originalName);
                } else {
                    setErrors({ name: "An error occurred. Please try again." });
                    setName(originalName);
                }
            }
            catch (error) {
                console.log(error);
                setName(originalName);
            }

            setEditing(false);
        }
    }

    return (
        <div className="flex flex-col border border-black rounded w-72 h-96">
            <div className="flex justify-center items-center bg-blue-50 rounded-t flex-1"> image placeholder </div>
            <div className="flex flex-col items-center px-4 py-4 bg-white rounded-b gap-4 mt-auto">
                <form onSubmit={submitHandler} className="text-lg flex justify-center items-center font-medium">
                    <div className="flex-col">
                        <input className="disabled:bg-white bg-gray-50" size={name.length} type="text" value={name} onChange={(e)=>setName(e.target.value)} disabled={!editing}/>
                        { errors.name ? <ErrorMessage string={errors.name}/> : null }
                    </div>
                    {
                        editing
                            ? <>
                                <button type="submit">
                                    <IoMdSave className="cursor-pointer"/>
                                </button>
                                <IoClose className="cursor-pointer" onClick={()=>{setEditing(false); setName(originalName)}}/>
                              </> 
                            : <MdEdit className="cursor-pointer" onClick={ ()=>{setEditing(true); if(errors) setErrors({});} }/>
                            
                    }
                </form>
                <button className="hover:brightness-90 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow bg-white" onClick={removeHandler}>Remove</button>
            </div>
        </div>
    );
}

Ballot.propTypes = {
    ballot: propTypes.shape({
        _id: propTypes.string.isRequired,
        name: propTypes.string.isRequired,
        event_id: propTypes.string.isRequired,
        eventDetails: propTypes.object,
    }),
    removeHandler: propTypes.func.isRequired
}

BallotsSection.propTypes = {
    openFormModal: propTypes.func.isRequired,
    fetchBallots: propTypes.bool.isRequired,
    setFetchBallots: propTypes.func.isRequired
}

export default BallotsSection;
