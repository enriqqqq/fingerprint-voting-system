import propTypes from 'prop-types';

function ErrorMessage({ string }) {
    return(
        <>
            <p className="text-xs text-red-500">{string}</p>
        </>
    )
}

ErrorMessage.propTypes = {
    string: propTypes.string.isRequired
}

export default ErrorMessage;