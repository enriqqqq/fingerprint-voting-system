import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHardware } from "../contexts/hardwareContext";
import Sidebar from "../components/Sidebar";
import EventForm from "../components/EditEventPage/EventForm";
import VotersSection from "../components/EditEventPage/VotersSection";
import BallotsSection from "../components/EditEventPage/BallotsSection";
import NewVoterModal from "../components/EditEventPage/NewVoterModal";
import NewBallotModal from "../components/EditEventPage/NewBallotModal";
import SmallNav from "../components/SmallNav";

function EditEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState({});
    const [showNewVoterModal, setShowNewVoterModal] = useState(false);
    const [showNewBallotModal, setShowNewBallotModal] = useState(false);
    const [fetchVoters, setFetchVoters] = useState(true);
    const [fetchBallots, setFetchBallots] = useState(true);
    const { connectToHardware, startVotingEvent, switchToLoadMode, votersToLoad, votingEventId } = useHardware();

    useEffect(() => {
        (async() => {
            try {
                // Fetch the event data from the server
                setLoading(true);

                // Set the fetchVoters and fetchBallots to true to fetch the voters and ballots
                setFetchVoters(true);
                setFetchBallots(true);

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

    const startVoting = async () => {
        const res = await startVotingEvent(event._id);

        if(res.code == 0x01) {
            await connectToHardware();
            return;
        }

        if(res.code == 0x02) {
            // show the message
            console.log(res.message);
            return;
        }

        const response = await fetch(`/test/api/events/${event._id}/voters`);

        if(response.status !== 200) {
            console.log('Error');
            return;
        }

        const data = await response.json();

        votersToLoad.current = data.voters;
        votingEventId.current = event._id;

        await switchToLoadMode();

        if(res.code == 0x00) {
            navigate(`/voting/${event._id}`);
        }
    }

    return (
        <>
            { showNewVoterModal && <NewVoterModal closeModal={() => {setShowNewVoterModal(false)}} setFetchVoters={setFetchVoters} /> }
            { showNewBallotModal && <NewBallotModal closeModal={()=> {setShowNewBallotModal(false)}} setFetchBallots={setFetchBallots}/>}
            <div className="bg-slate-50 overflow-hidden">
                <Sidebar />
                <div className="px-10 py-10 flex flex-col ml-64 transition-all duration-300 ease-out max-sm:ml-0">
                    <SmallNav />
                    <h1 className="font-bold text-xl">Edit Event</h1>
                    <p className="text-sm">{ id }</p>
                    <div className="flex flex-col flex-1">
                        {
                            loading 
                                ? <p>Loading...</p>
                                : <>
                                    <EventForm event={event} />
                                    <VotersSection openFormModal={()=>{setShowNewVoterModal(true)}} fetchVoters={fetchVoters} setFetchVoters={setFetchVoters}/>
                                    <BallotsSection openFormModal={()=>{setShowNewBallotModal(true)}} fetchBallots={fetchBallots} setFetchBallots={setFetchBallots}/>
                                  </>
                        }
                    </div>
                    <button className="bg-slate-400 text-black px-7 py-2 rounded hover:brightness-75 font-semibold self-start mt-auto" onClick={startVoting}>Start</button>
                </div>
            </div>
        </>
    );
}

export default EditEventPage;