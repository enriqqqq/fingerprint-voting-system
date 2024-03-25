import { useState } from 'react';
import Header from '../components/VotingPage/Header';
import BallotChoices from '../components/VotingPage/BallotChoices';
import ErrorModal from '../components/VotingPage/ErrorModal';

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

    function handleVoteButton(choice) {
        setChoice(choice);
    }

    async function connectToHardware () {
        try {
            const vendorID = 0x1A86; // Arduino Uno (find USBDevice.vendorID in browser's console)
            const newDevice = await navigator.usb.requestDevice({ filters: [ {vendorId: vendorID} ] });
            console.log(newDevice); // check vendorID

            navigator.usb.addEventListener('disconnect', () => {
                setDevice(null);
            })

            if(newDevice.vendorId !== vendorID) {
                setDevice(null);
            } else {
                setDevice(newDevice);
            }
        } catch (error) {
            setDevice(null);
        }
    }


    return(
        <>
            { device ? null : <ErrorModal buttonHandler={ connectToHardware } />}
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