import { useState } from "react";
import { IoIosSearch } from "react-icons/io";

const SearchBar = ({ setCity, unit, setUnit }) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!input) return;

        setCity(input); // only set city, App will fetch automatically
        setInput("");
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="flex gap-4 items-center">
                {/* Search Box */}
                <div className="flex-1 relative">
                    <div className="relative">
                        {/* Icon */}
                        <div className="absolute inset-y-0 left-0 pl-4 flex z-1000 items-center pointer-events-none">
                            <div className="w-30 h-30 flex items-center justify-self-start">
                                <IoIosSearch
                                    className="text-gray-400 mr-2"
                                    size={30}
                                />
                            </div>
                        </div>

                        {/* Input */}
                        <input
                            placeholder="Search for a city..."
                            aria-label="Search for a city"
                            className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                </div>

                {/* Unit Toggle */}
                <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1 border border-white/30">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer whitespace-nowrap ${
                            unit === "metric"
                                ? "bg-white text-blue-600 font-semibold"
                                : "text-white hover:bg-white/20"
                        }`}
                        onClick={() => setUnit("metric")}>
                        °C
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer whitespace-nowrap ${
                            unit === "imperial"
                                ? "bg-white text-blue-600 font-semibold"
                                : "text-white hover:bg-white/20"
                        }`}
                        onClick={() => setUnit("imperial")}>
                        °F
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchBar;
