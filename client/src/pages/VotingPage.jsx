import { useState } from 'react';
import Header from '../components/VotingPage/Header';
import BallotChoices from '../components/VotingPage/BallotChoices';

const ballotChoices = [
    "Tomato",
    "Potato",
    "Carrot",
    "Cucumber",
    "Broccoli",
]

function VotingPage() {
    const [choice, setChoice] = useState(ballotChoices[0]);

    function handleVoteButton(choice) {
        setChoice(choice);
    }

    return(
        <div className="flex flex-col bg-gray-100 min-h-screen">
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
    )
}

export default VotingPage;