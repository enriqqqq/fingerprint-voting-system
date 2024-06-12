import { useEffect, useState } from 'react';
import Header from '../components/VotingPage/Header';
import BallotChoices from '../components/VotingPage/BallotChoices';
import ErrorModal from '../components/VotingPage/ErrorModal';
import Toast from '../components/VotingPage/Toast';
import { useHardware } from '../contexts/hardwareContext';
import { useNavigate, useParams } from 'react-router-dom';

function VotingPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [ballots, setBallots] = useState([]);
    const { device, ballotSelected, selectedBallotDisplay, setSelectedBallotDisplay, toast, mode } = useHardware();

    useEffect(() => {
        // get ballots from the server
        (async() => {
            try {
                // verify if voting requirements is met
                const isValid = await fetch(`/test/api/events/${id}/start`);
                if(isValid.status !== 200 && isValid.status !== 304) {
                    navigate('/');
                    return;
                }

                // check if the event is valid
                const isValidJSON = await isValid.json();
                if(isValidJSON.code !== 0) {
                    navigate('/');
                    return;
                }

                // get ballots from the server
                const ballots = await fetch(`/test/api/events/${id}/ballots`);
                if(ballots.status !== 200) {
                    navigate('/');
                    return;
                }

                // get the ballots data
                const ballotsData = await ballots.json();
                setBallots(ballotsData.ballots);

                if(!device) {
                    navigate('/');
                    return;
                }
            } catch(error) {
                console.log(error);
            }
        })();

    }, [id, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

    function handleVoteButton(choice) {
        setSelectedBallotDisplay(choice._id);
        ballotSelected.current = choice;
    }

    return(
        <>
            { device ? null : <ErrorModal buttonHandler={ () => {navigate('/'); mode.current = 0x02} } />}
            <Toast show={toast.show} message={toast.message}/>
            <div className="flex flex-col bg-gray-100 min-h-screen overflow-hidden">
                <Header exitHandler={()=>{navigate('/'); mode.current = 0x02}}/>

                {/* display all ballot choices */}
                <div className="flex justify-center flex-wrap gap-8 px-8 py-12">
                    {
                        ballots.map((ballotChoice) => {
                            return <BallotChoices 
                                key={ballotChoice._id} 
                                ballotChoice={ballotChoice}
                                voteButtonHandler={handleVoteButton}
                                selected={selectedBallotDisplay === ballotChoice._id}
                            />
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default VotingPage;