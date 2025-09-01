import { useEffect, useState } from "react";
import { FaSearch, FaHome, FaUser } from "react-icons/fa";
import { HiHomeModern } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
                <Link to={"/"} className="flex items-center gap-2">
                    <HiHomeModern className="text-blue-600 text-2xl" />
                    <h1 className="font-bold text-xl hidden sm:block">
                        <span className="text-blue-600">Roof</span>
                        <span className="text-gray-800">Surf</span>
                    </h1>
                </Link>

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 max-w-lg mx-4 bg-gray-100 rounded-full px-4 py-2 flex items-center border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-colors"
                >
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search properties..."
                        className="bg-transparent focus:outline-none w-full"
                        value={searchTerm}
                        onChange={(evt) => setSearchTerm(evt.target.value)}
                    />
                </form>

                <nav className="flex items-center gap-6">
                    <Link
                        to={"/"}
                        className="text-gray-600 hover:text-blue-600 transition-colors hidden md:block"
                    >
                        <div className="flex items-center gap-1">
                            <FaHome className="text-sm" />
                            <span>Home</span>
                        </div>
                    </Link>
                    <Link
                        to={"/about"}
                        className="text-gray-600 hover:text-blue-600 transition-colors hidden md:block"
                    >
                        About
                    </Link>
                    <Link
                        to={"/profile"}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full py-2 px-4 transition-colors"
                    >
                        {currentUser ? (
                            <div className="flex items-center gap-2">
                                <img
                                    className="rounded-full h-7 w-7 object-cover"
                                    src={currentUser.avatar}
                                    alt="profile"
                                />
                                <span className="text-sm hidden sm:block">
                                    {currentUser.username}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <FaUser className="text-gray-600" />
                                <span className="text-sm">Sign in</span>
                            </div>
                        )}
                    </Link>
                </nav>
            </div>

            <div className="border-t md:hidden">
                <div className="flex justify-around p-3">
                    <Link
                        to={"/"}
                        className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600"
                    >
                        <FaHome className="text-lg mb-1" />
                        <span>Home</span>
                    </Link>
                    <Link
                        to={"/search"}
                        className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600"
                    >
                        <FaSearch className="text-lg mb-1" />
                        <span>Search</span>
                    </Link>
                    <Link
                        to={"/profile"}
                        className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600"
                    >
                        <FaUser className="text-lg mb-1" />
                        <span>Profile</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
