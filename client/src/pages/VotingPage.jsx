import { useEffect, useState } from 'react';
import Header from '../components/VotingPage/Header';
import BallotChoices from '../components/VotingPage/BallotChoices';
import ErrorModal from '../components/VotingPage/ErrorModal';
import Toast from '../components/VotingPage/Toast';

// const decoder = new TextDecoder('ascii');
const ballotChoices = [
    "Tomato",
    "Potato",
    "Carrot",
    "Cucumber",
    "Broccolli",
]

const DOWNLOAD_FINGERPRINT = 0x01;
const fingerprint_template_buffer = [];
let startReadingUART = false;

function VotingPage() {
    const [choice, setChoice] = useState(ballotChoices[0]);
    const [device, setDevice] = useState(null);
    const [toast, setToast] = useState(false);

    useEffect(() => {
        // TODO:
        // 1. load ballot choices from mongodb server
        // 2. load voters fingerprint templates from mongodb server
        // 3. load voters fingerprint templates to hardware through UART
    }, []);

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
                
                if(value) {
                    for(let i = 0; i < value.length; i++) {
                        if(value[i] === DOWNLOAD_FINGERPRINT && !startReadingUART) {
                            startReadingUART = true;
                        }

                        if(startReadingUART && fingerprint_template_buffer.length < 512) {
                            fingerprint_template_buffer.push(value[i]);
                        }

                        if(fingerprint_template_buffer.length === 512) {
                            startReadingUART = false;
                        }
                    }
                }
                
                // testing purposes
                // const string = decoder.decode(value);
                // if(string.includes("CAST_VOTE")){
                //     setToast(true);
                //     setTimeout(() => {
                //         setToast(false);
                //     }, 3500);
                // }
                // console.log(string);
                // console.log(done);

                if(fingerprint_template_buffer.length === 512) {
                    // TODO: send fingerprint_template to hardware through UART
                    // and match with fingerprints uploaded
                    setToast(true);
                    setTimeout(() => {
                        setToast(false);
                    }, 3500);

                    fingerprint_template_buffer.length = 0;
                }
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