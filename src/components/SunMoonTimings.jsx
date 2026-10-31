import { FiMoon } from "react-icons/fi";
import { RiSunLine } from "react-icons/ri";
import { formatToLocalTime, formatTimeDifference } from "../utils/utils";

const SunMoonTimings = ({ weather }) => {
    const sunrise = formatToLocalTime(
        weather?.sys?.sunrise,
        weather?.timezone,
        "HH:mm"
    );

    const sunset = formatToLocalTime(
        weather?.sys?.sunset,
        weather?.timezone,
        "HH:mm"
    );

    const localTime = formatToLocalTime(
        weather?.dt,
        weather?.timezone,
        "HH:mm"
    );

    const timeLeftStr = formatTimeDifference(weather?.dt, weather?.sys?.sunset);
    const beforeSunset = weather?.dt < weather?.sys?.sunset;

    const isDaytime = localTime >= sunrise && localTime < sunset;

    return (
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                    <RiSunLine
                        className="text-2xl text-yellow-300"
                        style={{ strokeWidth: 1 }}></RiSunLine>
                </div>
                Sun &amp; Moon
            </h3>
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <RiSunLine className="text-xl text-white"></RiSunLine>
                            </div>
                        </div>
                        <div>
                            <div className="text-white/80 text-sm">Sunrise</div>
                            <div className="text-white font-semibold text-lg">
                                {sunrise}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <FiMoon className="ri-moon-line text-xl text-white"></FiMoon>
                            </div>
                        </div>
                        <div>
                            <div className="text-white/80 text-sm">Sunset</div>
                            <div className="text-white font-semibold text-lg">
                                {sunset}
                            </div>
                        </div>
                    </div>
                    {beforeSunset && (
                        <div className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                            {timeLeftStr + " left"}
                        </div>
                    )}
                </div>
                <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="text-white/80 text-sm mb-1">Current Time</div>
                    <div className="text-white font-semibold text-xl">
                        {localTime}
                    </div>

                    {isDaytime ? (
                        <div className="text-sm mt-2 text-yellow-300">
                            ☀️ Daytime
                        </div>
                    ) : (
                        <div className="text-sm mt-2 text-blue-300">
                            🌙 Nighttime
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SunMoonTimings;
