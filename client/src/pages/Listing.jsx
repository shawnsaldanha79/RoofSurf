import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import "swiper/css/pagination";
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaShare,
    FaParking,
    FaTag,
} from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import Contact from "../components/Contact";

export default function Listing() {
    SwiperCore.use([Navigation, Pagination, Autoplay]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Something went wrong
                    </h2>
                    <p className="text-gray-600">
                        Unable to load the property details. Please try again
                        later.
                    </p>
                </div>
            </div>
        );

    return (
        listing && (
            <div className="min-h-screen bg-gray-50">
                {/* Image Gallery */}
                <div className="relative">
                    <Swiper
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        loop={true}
                        className="h-96 md:h-[500px]"
                    >
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className="h-full w-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${url})` }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Share Button */}
                    <div className="absolute top-4 right-4 z-10">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                );
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                            aria-label="Share listing"
                        >
                            <FaShare className="text-gray-600" />
                        </button>
                        {copied && (
                            <div className="absolute top-full right-0 mt-2 bg-white px-3 py-2 rounded-lg shadow-lg">
                                <p className="text-sm text-green-600">
                                    Link copied!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Property Details */}
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 md:p-8">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                        {listing.name}
                                    </h1>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaMapMarkerAlt className="text-blue-600" />
                                        <span>{listing.address}</span>
                                    </div>
                                </div>

                                <div className="text-2xl font-bold text-blue-600">
                                    $
                                    {listing.offer
                                        ? listing.discountPrice.toLocaleString(
                                              "en-US"
                                          )
                                        : listing.regularPrice.toLocaleString(
                                              "en-US"
                                          )}
                                    {listing.type === "rent" && (
                                        <span className="text-lg font-normal text-gray-600">
                                            /month
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                        listing.type === "rent"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-green-100 text-green-800"
                                    }`}
                                >
                                    {listing.type === "rent"
                                        ? "For Rent"
                                        : "For Sale"}
                                </span>

                                {listing.offer && (
                                    <span className="px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
                                        $
                                        {(
                                            +listing.regularPrice -
                                            +listing.discountPrice
                                        ).toLocaleString("en-US")}{" "}
                                        Discount
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Description
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {listing.description}
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                    <FaBed className="text-blue-600 text-xl" />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {listing.bedrooms}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Bedrooms
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                    <FaBath className="text-blue-600 text-xl" />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {listing.bathrooms}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Bathrooms
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                    <FaParking className="text-blue-600 text-xl" />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {listing.parking ? "Yes" : "No"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Parking
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                    <FaChair className="text-blue-600 text-xl" />
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {listing.furnished ? "Yes" : "No"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Furnished
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Section */}
                            {currentUser &&
                                listing.userRef !== currentUser._id &&
                                !contact && (
                                    <div className="text-center">
                                        <button
                                            onClick={() => setContact(true)}
                                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                                        >
                                            Contact Property Owner
                                        </button>
                                    </div>
                                )}

                            {contact && <Contact listing={listing} />}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
