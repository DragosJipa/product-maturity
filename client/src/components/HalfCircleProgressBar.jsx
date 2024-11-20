import './landingPage.css';

export default function HalfCircleProgressBar({ progress, level }) {
    const radius = 100;
    const strokeWidth = 10;
    const circumference = Math.PI * radius;
    const offset = circumference - (progress / 5) * circumference;

    return (
        <div className="relative w-80 h-40">
            <svg
                className="absolute top-0 left-0"
                viewBox="0 0 220 110"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="
              M 10 110
              A 100 100 0 0 1 210 110
            "
                    fill="none"
                    stroke="#333"
                    strokeWidth={strokeWidth}
                />
                <path
                    d="
              M 10 110
              A 100 100 0 0 1 210 110
            "
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(98, 75, 237, 1)" />
                        <stop offset="100%" stopColor="rgba(206, 86, 130, 1)" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold gradient-color-text">Lv.{level}</div>
                <div className="text-sm text-gray-400">Defined</div>
            </div>
        </div>
    );
}