import { HardwareContext } from '../contexts/hardwareContext';
import { useRef, useState } from 'react';
import propTypes from 'prop-types';

const DOWNLOAD_FINGERPRINT = 0x01;

function HardwareProvider({ children }) {
    const [device, setDevice] = useState(null);
    const [fingerprint, setFingerprint] = useState([]);
    const fingerprintBuffer = useRef([]);
    const readUART = useRef(false);

    async function connectToHardware() {
        try {
            const device = await navigator.serial.requestPort();
            setDevice(device);

            device.addEventListener('disconnect', () => {
                setDevice(null);
                fingerprintBuffer.current = [];
                setFingerprint([]);
                readUART.current = false;
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
                        if(value[i] === DOWNLOAD_FINGERPRINT && !readUART.current) {
                            fingerprintBuffer.current = [];
                            setFingerprint([]);
                            readUART.current = true;
                            continue;
                        }

                        if(readUART.current && fingerprintBuffer.current.length < 512) {
                            fingerprintBuffer.current.push(value[i]);
                        }

                        if(fingerprintBuffer.current.length === 512) {
                            readUART.current = false;
                        }
                    }
                }

                if(fingerprintBuffer.current.length === 512) {
                    setFingerprint([...fingerprintBuffer.current]);
                }
            }
        } catch(e) {
            console.error(e);
            setDevice(null); // this will trigger the error modal
        }
    }


    return (
        <HardwareContext.Provider value={{ device, fingerprint, setFingerprint, connectToHardware }}>
            {children}
        </HardwareContext.Provider>
    )
}

HardwareProvider.propTypes = {
    children: propTypes.node.isRequired
}

export default HardwareProvider;
