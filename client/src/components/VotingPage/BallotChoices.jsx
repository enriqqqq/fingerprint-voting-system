import PropTypes from 'prop-types';

function BallotChoices({ voteButtonHandler, ballotChoice, selected }) {
    return (
        <div className="flex flex-col border border-black rounded">
            <div className="flex justify-center items-center h-80 w-72 bg-blue-50 rounded-t"> image placeholder </div>
            <div className="flex flex-col items-center px-4 py-4 bg-white rounded-b gap-4">
                <div className="text-black text-lg font-medium">{ballotChoice.name}</div>
                <button className={`${selected ? "bg-amber-200" : "bg-white"} hover:brightness-90 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow`} onClick={() => voteButtonHandler(ballotChoice) }>Vote</button>
            </div>
        </div>
    );
}

export default BallotChoices;

BallotChoices.propTypes = {
    voteButtonHandler: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    ballotChoice: PropTypes.shape({
        name: PropTypes.string.isRequired,
        _id: PropTypes.string.isRequired,
        event_id: PropTypes.string,
        eventDetails: PropTypes.object,
    })
};