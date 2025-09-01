import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";

export default function Search() {
    const navigate = useNavigate();
    const location = useLocation(); // Add useLocation hook
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "createdAt",
        order: "desc",
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        // This will run every time the URL search params change
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const typeFromUrl = urlParams.get("type");
        const parkingFromUrl = urlParams.get("parking");
        const furnishedFromUrl = urlParams.get("furnished");
        const offerFromUrl = urlParams.get("offer");
        const sortFromUrl = urlParams.get("sort");
        const orderFromUrl = urlParams.get("order");

        // Update sidebar data from URL params
        setSidebarData({
            searchTerm: searchTermFromUrl || "",
            type: typeFromUrl || "all",
            parking: parkingFromUrl === "true",
            furnished: furnishedFromUrl === "true",
            offer: offerFromUrl === "true",
            sort: sortFromUrl || "createdAt",
            order: orderFromUrl || "desc",
        });

        // Fetch listings based on current URL params
        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]); // Depend on location.search instead of just running once

    const handleChange = (evt) => {
        if (
            evt.target.id === "all" ||
            evt.target.id === "rent" ||
            evt.target.id === "sale"
        ) {
            setSidebarData({
                ...sidebarData,
                type: evt.target.id,
            });
        }
        if (evt.target.id === "searchTerm") {
            setSidebarData({
                ...sidebarData,
                searchTerm: evt.target.value,
            });
        }
        if (
            evt.target.id === "parking" ||
            evt.target.id === "furnished" ||
            evt.target.id === "offer"
        ) {
            setSidebarData({
                ...sidebarData,
                [evt.target.id]: evt.target.checked,
            });
        }
        if (evt.target.id === "sort_order") {
            const sort = evt.target.value.split("_")[0] || "createdAt";
            const order = evt.target.value.split("_")[1] || "desc";
            setSidebarData({
                ...sidebarData,
                sort: sort,
                order: order,
            });
        }
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("type", sidebarData.type);
        urlParams.set("parking", sidebarData.parking);
        urlParams.set("furnished", sidebarData.furnished);
        urlParams.set("offer", sidebarData.offer);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("order", sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
        setShowMobileFilters(false);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    const clearFilters = () => {
        setSidebarData({
            searchTerm: "",
            type: "all",
            parking: false,
            furnished: false,
            offer: false,
            sort: "createdAt",
            order: "desc",
        });
        navigate("/search");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Filter Button */}
            <div className="lg:hidden p-4 border-b bg-white">
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                >
                    <FaFilter className="text-sm" />
                    Filters
                </button>
            </div>

            <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
                {/* Sidebar Filters */}
                <div
                    className={`lg:w-80 bg-white lg:border-r lg:min-h-screen p-6 fixed lg:static inset-0 z-50 transform ${
                        showMobileFilters
                            ? "translate-x-0"
                            : "-translate-x-full"
                    } lg:translate-x-0 transition-transform duration-300 overflow-y-auto`}
                >
                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                        <h2 className="text-xl font-bold text-gray-800">
                            Filter Properties
                        </h2>
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes className="text-lg" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Search Term */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="searchTerm"
                                    placeholder="Enter location, property type..."
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    onChange={handleChange}
                                    value={sidebarData.searchTerm}
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Property Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Property Type
                            </label>
                            <div className="space-y-2">
                                {[
                                    { id: "all", label: "All Properties" },
                                    { id: "rent", label: "For Rent" },
                                    { id: "sale", label: "For Sale" },
                                ].map((type) => (
                                    <label
                                        key={type.id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="type"
                                            id={type.id}
                                            className="w-4 h-4 text-blue-600"
                                            onChange={handleChange}
                                            checked={
                                                sidebarData.type === type.id
                                            }
                                        />
                                        <span className="text-gray-700">
                                            {type.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Amenities
                            </label>
                            <div className="space-y-2">
                                {[
                                    { id: "offer", label: "Special Offers" },
                                    { id: "parking", label: "Parking" },
                                    { id: "furnished", label: "Furnished" },
                                ].map((amenity) => (
                                    <label
                                        key={amenity.id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            id={amenity.id}
                                            className="w-4 h-4 text-blue-600 rounded"
                                            onChange={handleChange}
                                            checked={sidebarData[amenity.id]}
                                        />
                                        <span className="text-gray-700">
                                            {amenity.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <select
                                id="sort_order"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                onChange={handleChange}
                                value={`${sidebarData.sort}_${sidebarData.order}`}
                            >
                                <option value="createdAt_desc">
                                    Newest First
                                </option>
                                <option value="createdAt_asc">
                                    Oldest First
                                </option>
                                <option value="regularPrice_desc">
                                    Price: High to Low
                                </option>
                                <option value="regularPrice_asc">
                                    Price: Low to High
                                </option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                            >
                                Apply Filters
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {listings.length}{" "}
                            {listings.length === 1 ? "Property" : "Properties"}{" "}
                            Found
                        </h1>
                        {listings.length > 0 && (
                            <p className="text-gray-600 text-sm">
                                Showing {listings.length} results
                            </p>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && listings.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-blue-50 rounded-full p-4 inline-flex mb-4">
                                <FaSearch className="text-3xl text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                No properties found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your search criteria or filters
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Results Grid */}
                    {!loading && listings.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((listing) => (
                                    <ListingItem
                                        key={listing._id}
                                        listing={listing}
                                    />
                                ))}
                            </div>

                            {/* Show More Button */}
                            {showMore && (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={onShowMoreClick}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                                    >
                                        Load More Properties
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            {showMobileFilters && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setShowMobileFilters(false)}
                />
            )}
        </div>
    );
}
