import propTypes from 'prop-types';

function Header({ exitHandler }) {
    return (
        <>
            <div className="flex bg-gray-200 py-8 px-8 justify-center items-center">
                <div className="mr-auto hover:cursor-pointer" onClick={exitHandler}>Exit</div>
                <h1 className="text-4xl font-bold mr-auto">Cast Your Votes!</h1>
            </div>
        </>
    );
}

Header.propTypes = {
    exitHandler: propTypes.func.isRequired
}

export default Header;