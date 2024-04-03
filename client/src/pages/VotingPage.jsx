import { useState } from 'react';
import Header from '../components/VotingPage/Header';
import BallotChoices from '../components/VotingPage/BallotChoices';
import ErrorModal from '../components/VotingPage/ErrorModal';
import Toast from '../components/VotingPage/Toast';

const decoder = new TextDecoder('ascii');
const ballotChoices = [
    "Tomato",
    "Potato",
    "Carrot",
    "Cucumber",
    "Broccolli",
]

function VotingPage() {
    const [choice, setChoice] = useState(ballotChoices[0]);
    const [device, setDevice] = useState(null);
    const [toast, setToast] = useState(false);

    function handleVoteButton(choice) {
        setChoice(choice);
    }

    async function connectToHardware() {
        try {
            const device = await navigator.serial.requestPort();
            setDevice(device); // this will close the error modal

            device.addEventListener('disconnect', () => {
                setDevice(null); // this will trigger the error modal
            });

            await device.open({ baudRate: 9600 });
            const reader = device.readable.getReader();

            while(device) {
                const { value, done } = await reader.read();
                if (done) {
                    break;
                }
                
                const string = decoder.decode(value);
                
                if(string.includes("CAST_VOTE")){
                    setToast(true);
                    setTimeout(() => {
                        setToast(false);
                    }, 3500);
                }

                console.log(string);
            }

        } catch(e) {
            console.error(e);
            setDevice(null); // this will trigger the error modal
        }
    }

    return(
        <>
            { device ? null : <ErrorModal buttonHandler={ connectToHardware } />}
            <Toast show={toast}/>
            <div className="flex flex-col bg-gray-100 min-h-screen overflow-hidden">
                <Header/>

                {/* display all ballot choices */}
                <div className="flex justify-center flex-wrap gap-8 px-8 py-12">
                    {
                        ballotChoices.map((ballotChoice, index) => {
                            return <BallotChoices 
                                key={index} 
                                voteButtonHandler={handleVoteButton}
                                ballotChoice={ballotChoice}
                                selected={choice === ballotChoice}
                            />
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default VotingPage;