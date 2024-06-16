import propTypes from 'prop-types';
import { FaFingerprint } from 'react-icons/fa6';
function Header({ exitHandler }) {
    return (
        <>
            <div className="flex bg-slate-900 py-8 px-8 justify-center items-center">
                <div className="mr-auto hover:cursor-pointer text-white font-semibold" onClick={exitHandler}>Exit</div>
                <FaFingerprint className="text-white text-5xl mr-5"/>
                <h1 className="text-4xl font-bold mr-auto text-white">Cast Your Votes!</h1>
            </div>
        </>
    );
}

Header.propTypes = {
    exitHandler: propTypes.func.isRequired
}

export default Header;