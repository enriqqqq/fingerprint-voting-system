import propTypes from 'prop-types';

function DashboardInfo() {
    return (
        <div className="grid grid-cols-2 grid-rows-2 bg-white">
            <Items title="Ballots Registered" span={1} />
            <Items title="Voters Registered" span={1} />
            <Items title="Voting Events" span={2} />
        </div>
    )
}

function Items({ title, span }) {
    return (
        <div className={`col-span-${span} border px-7 py-5`}>
            <p className="">{title}</p>
            <p className="font-bold text-lg">30</p>
        </div>
    )
}

Items.propTypes = {
    title: propTypes.string.isRequired,
    span: propTypes.number
}

export default DashboardInfo;