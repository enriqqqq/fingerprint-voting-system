import propTypes from 'prop-types';

function NumericDataBlock({ data, text, icon, bgcolor }) {
    return(
        <div className={`flex-1 h-32 px-6 py-6 ${bgcolor} relative rounded shadow-sm`}>
            {/* This is the text */}
            <div className="flex w-full h-full justify-between items-center relative z-10">
                <div className="flex justify-center items-center">
                    {icon}
                </div>
                <div className="flex flex-col items-end justify-center text-white">
                    <p className="text-2xl font-bold">{data}</p>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    )
}

NumericDataBlock.propTypes = {
    data: propTypes.number.isRequired,
    text: propTypes.string.isRequired,
    icon: propTypes.node.isRequired,
    bgcolor: propTypes.string.isRequired
}

export default NumericDataBlock;