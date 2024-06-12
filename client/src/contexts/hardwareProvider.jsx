import { HardwareContext } from '../contexts/hardwareContext';
import { useRef, useState } from 'react';
import propTypes from 'prop-types';

// header bytes
const DOWNLOAD_FINGERPRINT = 0x01;
const FINGERPRINT_TEMPLATE_SIZE = 768;
const READY_TO_SEND_FINGERPRINTS = [0x7A, 0x79];

const NO_DEVICE = 1;
const CANT_START_VOTING = 2;

// modes
const REGISTER_MODE = 0x02;
const LOAD_MODE = 0x03;
const VOTING_MODE = 0x04;

function HardwareProvider({ children }) {
    const [device, setDevice] = useState(null);
    const reader = useRef(null);
    const writer = useRef(null);
    const [fingerprint, setFingerprint] = useState([]);
    const fingerprintBuffer = useRef([]);
    const readUART = useRef(false);
    const mode = useRef(REGISTER_MODE);
    const votersToLoad = useRef([]);
    const ballotSelected = useRef(null);
    const [selectedBallotDisplay, setSelectedBallotDisplay] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });
    const votingEventId = useRef(null);

    async function startVotingEvent(id){
        const response = await fetch(`/test/api/events/${id}/start`);
        const data = await response.json();

        // check if response is not 200
        if(response.status !== 200) {
            return {
                code: CANT_START_VOTING,
                message: data.message
            }
        }

        // check if device is connected
        if(!device) {
            return {
                code: NO_DEVICE,
                message: "No device is connected"
            };
        }

        // success
        return {
            code: 0x00,
            message: "Success"
        }
    }
    
    function clearFingerprint() {
        fingerprintBuffer.current = [];
        setFingerprint([]);
    }

    function registerFingerprint(value) {
        if(!value) return;

        for(let i = 0; i < value.length; i++) {
            if(value[i] === DOWNLOAD_FINGERPRINT && !readUART.current) {
                clearFingerprint();
                readUART.current = true;
                continue;
            }

            if(readUART.current && fingerprintBuffer.current.length < FINGERPRINT_TEMPLATE_SIZE) {
                fingerprintBuffer.current.push(value[i]);
            }

            if(fingerprintBuffer.current.length === FINGERPRINT_TEMPLATE_SIZE) {
                readUART.current = false;
            }
        }
        
        if(fingerprintBuffer.current.length === FINGERPRINT_TEMPLATE_SIZE) {
            setFingerprint([...fingerprintBuffer.current]);
        }
    }
    
    async function switchToLoadMode() {
        if(votersToLoad.current.length === 0) {
            return;
        }

        // send code so hardware can change mode.
        const header = new Uint8Array([READY_TO_SEND_FINGERPRINTS[0], READY_TO_SEND_FINGERPRINTS[1]]);
        mode.current = LOAD_MODE;
        await writer.current.write(header);
    }

    async function loadFingerprints() {
        const votersCount = votersToLoad.current.length;

        for(let i = 0; i < votersCount; i++) {
            const voter = votersToLoad.current[i];
            const voterFingerprint = new Uint8Array(voter.fingerprint);

            // tell hardware that we are sending a fingerprint
            await writer.current.write(new Uint8Array([0xAA]));

            // send the fingerprint
            await writer.current.write(voterFingerprint);   

            // get ack
            const { value } = await reader.current.read();
            console.log(value);
            if(value[0] !== 0x00) {
                console.log('ack is not correct');
                mode.current = REGISTER_MODE;
                return 0x01;   
            } // if ack is not correct, return 0x01
            console.log('fingerprint sent idx:', i+1);
        }

        await writer.current.write(new Uint8Array([0x00])); // tell hardware that we are done sending fingerprints
        mode.current = VOTING_MODE;
        console.log('done sending fingerprints, switching to voting mode');
        console.log(votersToLoad.current);
    }

    async function castVote(value) {
        if(!value) return;

        if(ballotSelected.current === null) {
            setToast({ show: true, message: 'Please select a ballot' });
            setTimeout(() => {
                setToast({ show: false, message: '' });
            }, 3000);
            return;
        }

        const voterId = votersToLoad.current[value[0] - 1]._id;
        const selectedBallotId = ballotSelected.current._id;

        const response = await fetch(`/test/api/events/${votingEventId.current}/voters/${voterId}/vote`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selected_ballot_id: selectedBallotId
            })
        });

        const data = await response.json();

        if(response.status !== 200) {
            setToast({ show: true, message: data.message });
            setTimeout(() => {
                setToast({ show: false, message: '' });
            }, 3000);

            setSelectedBallotDisplay(null);
            ballotSelected.current = null;
            return;
        }

        setToast({ show: true, message: 'Vote has been casted'});
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 3000);

        setSelectedBallotDisplay(null);
        ballotSelected.current = null;

        return data;
    }

    async function connectToHardware() {
        try {
            const device = await navigator.serial.requestPort();
            setDevice(device);

            device.addEventListener('disconnect', () => {
                setDevice(null);
                fingerprintBuffer.current = [];
                reader.current = null;
                writer.current = null;
                setFingerprint([]);
                readUART.current = false;
            });

            await device.open({ baudRate: 9600 });
            const device_reader = device.readable.getReader();
            const device_writer = device.writable.getWriter();

            reader.current = device_reader;
            writer.current = device_writer;

            while(device) { // this code waits for reader.read() to read a data, hence it will block the code if there is no data being sent.
                const { value, done } = await device_reader.read();
                switch(mode.current) {
                    case REGISTER_MODE:
                        registerFingerprint(value);
                        break;
                    case LOAD_MODE:
                        if(value[0] !== 0x00) {
                            mode.current = REGISTER_MODE;
                            break;
                        }
                        console.log('entered load_mode');
                        await loadFingerprints();
                        break;
                    case VOTING_MODE:
                        // get matched fingerprint
                        // validify voter
                        console.log(votersToLoad.current[value[0] - 1]);
                        console.log(ballotSelected);

                        await castVote(value);
                        break;
                    default:
                        break;
                }

                if (done) break;
            }
        } catch(e) {
            console.error(e);
            setDevice(null); // this will trigger the error modal
        }
    }

    return (
        <HardwareContext.Provider value={{ device, fingerprint, setFingerprint, connectToHardware, startVotingEvent, clearFingerprint, votersToLoad, mode, switchToLoadMode, ballotSelected, selectedBallotDisplay, setSelectedBallotDisplay, toast, votingEventId }}>
            {children}
        </HardwareContext.Provider>
    )
}

HardwareProvider.propTypes = {
    children: propTypes.node.isRequired
}

export default HardwareProvider;
