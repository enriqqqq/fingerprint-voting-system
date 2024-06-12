import NoConnectionImage from '../../assets/no-connection.png' // "https://www.flaticon.com/free-icons/no-connection"
import propTypes from 'prop-types'

function ErrorModal({ buttonHandler }) {
    return (
        <>
            <div className="w-full h-screen bg-black fixed z-1 opacity-75"></div>
            <div className="flex justify-center items-center h-screen w-full fixed z-10 border-box ">
                <div className="bg-white rounded flex flex-col items-center">
                    <div className="py-6">
                        <img className="h-40 w-auto" src={NoConnectionImage} alt="" />
                    </div>
                    <div className="px-5 py-5 flex flex-col items-center gap-1">
                        <p className="font-bold text-lg text-center">Hardware Disconnected</p>
                        <p className="text-sm text-center">Please restart the event</p>
                        <button className="mt-3 bg-slate-400 px-7 py-2 rounded hover:brightness-75 font-semibold" onClick={buttonHandler}>Go to Dashboard</button>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default ErrorModal;

ErrorModal.propTypes = {
    buttonHandler: propTypes.func.isRequired
}