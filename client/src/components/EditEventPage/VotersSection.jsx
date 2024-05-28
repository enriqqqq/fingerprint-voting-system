import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import propTypes from "prop-types";

function VotersSection({ openFormModal }) {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [voters, setVoters] = useState([]);

    useEffect(() => {
        (async() => {
            try {
                setLoading(true);
                const response = await fetch(`/test/api/events/${id}/voters`);
                if(response.status != 200) {
                    setVoters([]);
                } else {
                    const data = await response.json();
                    setVoters(data.voters);
                }
            } catch(error) {
                console.log(error);
                setVoters([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);
    
    return (
        <div className="flex flex-col gap-3">
            <p className="font-bold text-lg mt-5">Voters</p>
            <div className={`flex flex-col border border-black h-60 overflow-auto px-2 bg-white ${voters.length === 0 && "items-center justify-center"}`}>
                {
                    loading 
                        ? <p className="text-sm text-slate-800">Loading...</p>
                        : voters.length === 0 
                            ? <p className="text-sm text-slate-800"> No Voters Found... </p>
                            : voters.map((voter) => {
                                return (
                                    <>
                                        <p>{voter}</p>
                                    </>
                                )
                            })
                }   
            </div>
            <div className="self-end grid grid-cols-[1fr_1fr] gap-3">
                <button className="border border-black px-2 py-1 text-sm bg-white" onClick={openFormModal}>Add...</button>
                <button className="border border-black px-2 py-1 text-sm bg-white" onClick={null}>Remove...</button>
            </div>
        </div>
    )
}

VotersSection.propTypes = {
    openFormModal: propTypes.func.isRequired
}

export default VotersSection;