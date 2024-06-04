import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebartest";
import EventForm from "../components/EditEventPage/EventForm";
import VotersSection from "../components/EditEventPage/VotersSection";
import BallotsSection from "../components/EditEventPage/BallotsSection";
import NewVoterModal from "../components/EditEventPage/NewVoterModal";
import NewBallotModal from "../components/EditEventPage/NewBallotModal";

function EditEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState({});
    const [showNewVoterModal, setShowNewVoterModal] = useState(false);
    const [showNewBallotModal, setShowNewBallotModal] = useState(false);
    const [fetchVoters, setFetchVoters] = useState(true);
    const [fetchBallots, setFetchBallots] = useState(true);

    useEffect(() => {
        (async() => {
            try {
                // Fetch the event data from the server
                setLoading(true);
                const response = await fetch(`/test/api/events/${id}`);
                
                // If the id is not a valid ObjectId or the event does not exist, redirect to the home page
                if(!id.match(/^[0-9a-fA-F]{24}$/) || response.status === 404) {
                    navigate('/');
                    return;
                }
    
                const data = await response.json();
                setEvent(data);
            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })()
    }, [id, navigate]);

    return (
        loading 
            ? <p>Loading...</p> 
            : 
            <>
                { showNewVoterModal && <NewVoterModal closeModal={() => {setShowNewVoterModal(false)}} setFetchVoters={setFetchVoters} /> }
                { showNewBallotModal && <NewBallotModal closeModal={()=> {setShowNewBallotModal(false)}} setFetchBallots={setFetchBallots}/>}
                <div className="grid grid-cols-[16rem_5fr] bg-slate-50 overflow-hidden">
                    <div>{/* Temporary fix for fixed sidebar */}</div>
                    <Sidebar />
                    <div className="px-10 py-10 flex flex-col">
                        <h1 className="font-bold text-xl">Edit Event</h1>
                        <p className="text-sm">{ id }</p>
                        <div className="flex flex-col flex-1">
                            <EventForm event={event} />
                            <VotersSection openFormModal={()=>{setShowNewVoterModal(true)}} fetchVoters={fetchVoters} setFetchVoters={setFetchVoters}/>
                            <BallotsSection openFormModal={()=>{setShowNewBallotModal(true)}} fetchBallots={fetchBallots} setFetchBallots={setFetchBallots}/>
                        </div>
                        <button className="bg-slate-400 text-black px-7 py-2 rounded hover:brightness-75 font-semibold self-start mt-auto">Start</button>
                    </div>
                </div>
            </>
    );
}

export default EditEventPage;