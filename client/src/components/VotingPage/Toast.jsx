import propTypes from 'prop-types';

function Toast({ show, message }) {
    return (
        <div className={`fixed bg-green-400 z-10 px-6 py-2 font-semibold text-green-950 rounded mt-4 ${ show ? "transition-transform ease-out duration-300 ml-4" : "transition-transform ease-out duration-300 -translate-x-full -ml-4" }`}>
            <p>{message}</p>
        </div>
    );
}

export default Toast;

Toast.propTypes = {
    show: propTypes.bool.isRequired,
    message: propTypes.string.isRequired
}