import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import propTypes from "prop-types";

function VotersSection({ openFormModal, fetchVoters, setFetchVoters}) {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [voters, setVoters] = useState([]);
    const [removeList, setRemoveList] = useState(new Set());
    const [remove, setRemove] = useState(false);

    useEffect(() => {
        (async() => {
            try {
                if(fetchVoters) {
                    setLoading(true);
                    const response = await fetch(`/test/api/events/${id}/voters`);
                    if(response.status != 200) {
                        setVoters([]);
                    } else {
                        const data = await response.json();
                        setVoters(data.voters);
                    }
                }
            } catch(error) {
                console.log(error);
                setVoters([]);
            } finally {
                setLoading(false);
                setFetchVoters(false);
            }
        })();
    }, [id, fetchVoters, setFetchVoters]);
    
    const addToRemoveList = (e) => {
        if(e.target.checked) {
            setRemoveList([...removeList, e.target.value]);
        } else {
            setRemoveList(Array.from(removeList).filter((id) => id !== e.target.value));
        }
    }

    const addAllToRemoveList = (e) => {
        if(e.target.checked) {
            const uniqueIds = new Set([...removeList, ...voters.map((voter) => voter._id)]);
            setRemoveList(uniqueIds);
        } else {
            setRemoveList(new Set());
        }
    }

    const removeVoters = async () => {
        try {
            Array.from(removeList).forEach(async (voterId) => {
                const response = await fetch(`/test/api/events/${id}/voters/${voterId}/delete`, {
                    method: "DELETE"
                });
                if(response.status === 200) {
                    setVoters(voters.filter((voter) => voter._id !== voterId));
                }
            });
        } catch(error) {
            console.log(error);
        } finally {
            setFetchVoters(true);
        }
    }

    const allVoterInRemoveList = () => {
        return voters.every((voter) => Array.from(removeList).includes(voter._id));
    }

    return (
        <div className="flex flex-col gap-3">
            <p className="font-bold text-lg mt-5">Voters</p>
            { remove && 
                <div className="flex gap-2 items-center">
                    <input type="checkbox" onChange={addAllToRemoveList} checked={allVoterInRemoveList()}/>
                    <p>Select All</p>
                    <button className="border border-black px-2 py-1 text-sm bg-white" onClick={removeVoters}>Remove</button>
                </div>
            }
            <div className={`flex flex-col border gap-2 border-black h-60 overflow-auto px-2 pt-2 bg-white ${voters.length === 0 && "items-center justify-center"}`}>
                {
                    loading 
                        ? <p className="text-sm text-slate-800">Loading...</p>
                        : voters.length === 0 
                            ? <p className="text-sm text-slate-800"> No Voters Found... </p>
                            : voters.map((voter) => {
                                return (
                                    <div key={voter._id} className="flex gap-2">
                                        {remove && <input onChange={addToRemoveList} value={voter._id} type="checkbox" checked={Array.from(removeList).includes(voter._id)}/>}
                                        <EditableInput voter={voter} />
                                    </div>
                                )
                            })
                }   
            </div>
            <div className="self-end flex gap-3">
                <button className="border border-black px-2 py-1 text-sm bg-white" onClick={openFormModal}>Add...</button>
                {
                    voters.length > 0 
                        ? remove
                            ? <button className="border border-black px-2 py-1 text-sm bg-white" onClick={()=>{setRemove(false); setRemoveList(new Set())}}>Cancel</button>
                            : <button className="border border-black px-2 py-1 text-sm bg-white" onClick={()=>{setRemove(true)}}>Remove...</button>
                        : null
                }
            </div>
        </div>
    )
}

function EditableInput({ voter }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(voter.name);
    const [originalValue, setOriginalValue] = useState(voter.name);
    const [error, setError] = useState("");

    const updateValue = async () => {
        try {
            const response = await fetch(`/test/api/events/${voter.event_id}/voters/${voter._id}/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: value
                })
            });
            
            if(response.status === 200) {
                setValue(value);
                setOriginalValue(value);
            } else {
                const data = await response.json();
                if(data.errors.name) {
                    setError(data.errors.name);
                } else {
                    setError("An error occurred. Please try again.");
                }
                setValue(originalValue);
                setEditing(false);
            }
            
        } catch(error) {
            console.log(error);
        } finally {
            setEditing(false);
        }
    }

    return (
        <div className="flex gap-2">
            <div className="flex flex-col gap-1">
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} disabled={!editing} className={`rounded px-2 py-2 ${editing ? "border border-black" : ''}`}/>
                { error && <p className="text-sm text-red-600">{error}</p> }
            </div>
            {
                editing 
                    ? <>
                        <button onClick={() => updateValue()}>Save</button>
                        <button 
                            onClick={() => {
                                    setEditing(false);
                                    setValue(originalValue);
                                }
                            }>Cancel</button>
                      </>
                    : <button onClick={() => {setEditing(true); if(error) {setError("")}}}>Edit</button>
            }
        </div>
    )
}

VotersSection.propTypes = {
    openFormModal: propTypes.func.isRequired,
    fetchVoters: propTypes.bool.isRequired,
    setFetchVoters: propTypes.func.isRequired,
}

EditableInput.propTypes = {
    voter: propTypes.shape({
        name: propTypes.string.isRequired,
        _id: propTypes.string.isRequired,
        event_id: propTypes.string.isRequired,
        user_id: propTypes.string,
        fingerprint: propTypes.array
    })
}

export default VotersSection;