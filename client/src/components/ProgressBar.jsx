import './landingPage.css';

export default function ProgressBar({ progress }) {
    const maxLevels = 5;
    const activeLevels = Math.floor(progress);

    return (
        <div className="flex space-x-1 mt-3">
            {[...Array(maxLevels)].map((_, index) => (
                <div
                    key={index}
                    className={`h-[11px] w-[31px] ${index < activeLevels
                        ? 'bg-gradient-to-r from-[#624BED] to-[#CE5682]'
                        : 'bg-gray-700'
                        } ${index === 0 ? 'rounded-l-full' : index === maxLevels - 1 ? 'rounded-r-full' : ''
                        }`}
                ></div>
            ))}
        </div>
    );
}