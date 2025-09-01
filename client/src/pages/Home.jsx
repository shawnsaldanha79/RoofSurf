import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { FaArrowRightLong } from "react-icons/fa6";

export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    SwiperCore.use([Navigation, Autoplay]);

    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch("/api/listing/get?offer=true&limit=4");
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings();
            } catch (err) {
                console.log(err);
            }
        };
        const fetchRentListings = async () => {
            try {
                const res = await fetch("/api/listing/get?type=rent&limit=4");
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings();
            } catch (err) {
                console.log(err);
            }
        };
        const fetchSaleListings = async () => {
            try {
                const res = await fetch("/api/listing/get?type=sale&limit=4");
                const data = await res.json();
                setSaleListings(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchOfferListings();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex flex-col gap-6 py-20 px-3 max-w-6xl mx-auto">
                <h1 className="text-gray-800 font-bold text-4xl lg:text-6xl">
                    Discover Your Dream{" "}
                    <span className="text-blue-600">Home</span>
                    <br />
                    with RoofSurf
                </h1>
                <div className="text-gray-600 text-lg max-w-2xl">
                    RoofSurf helps you find the perfect property, whether you
                    are looking to rent, buy, or explore special offers. Start
                    your journey to finding the perfect place today.
                </div>
                <Link
                    to={"/search"}
                    className="w-fit px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg transition-colors duration-300 hover:bg-blue-700 shadow-md"
                >
                    Explore Properties
                </Link>
            </div>

            <div className="mb-16 px-10">
                <Swiper
                    navigation
                    autoplay={{ delay: 5000 }}
                    loop={true}
                    className="rounded-xl overflow-hidden shadow-xl mx-3"
                >
                    {offerListings &&
                        offerListings.length > 0 &&
                        offerListings.map((listing) => (
                            <SwiperSlide key={listing._id}>
                                <div
                                    style={{
                                        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${listing.imageUrls[0]}) center no-repeat`,
                                        backgroundSize: "cover",
                                    }}
                                    className="h-[500px] flex items-end p-10"
                                    key={listing._id}
                                >
                                    <div className="text-white">
                                        <h3 className="text-2xl font-bold mb-2">
                                            {listing.name}
                                        </h3>
                                        <p className="mb-4 max-w-md">
                                            $
                                            {listing.offer
                                                ? listing.discountPrice.toLocaleString()
                                                : listing.regularPrice.toLocaleString()}{" "}
                                            •{" "}
                                            {listing.type === "rent"
                                                ? "For Rent"
                                                : "For Sale"}
                                        </p>
                                        <Link
                                            to={`/listing/${listing._id}`}
                                            className="px-5 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                </Swiper>

                <div className="max-w-6xl mx-auto p-3 flex flex-col gap-12 my-16">
                    {offerListings && offerListings.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Special Offers
                                </h2>
                                <Link
                                    to={"/search?offer=true"}
                                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    View all offers
                                    <FaArrowRightLong />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {offerListings.map((listing) => (
                                    <ListingItem
                                        listing={listing}
                                        key={listing._id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {rentListings && rentListings.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Properties for Rent
                                </h2>
                                <Link
                                    to={"/search?type=rent"}
                                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    View all rentals
                                    <FaArrowRightLong />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {rentListings.map((listing) => (
                                    <ListingItem
                                        listing={listing}
                                        key={listing._id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {saleListings && saleListings.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Properties for Sale
                                </h2>
                                <Link
                                    to={"/search?type=sale"}
                                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    View all properties
                                    <FaArrowRightLong />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {saleListings.map((listing) => (
                                    <ListingItem
                                        listing={listing}
                                        key={listing._id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-blue-600 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to find your perfect home?
                    </h2>
                    <p className="mb-8 text-blue-100 max-w-2xl mx-auto">
                        Join thousands of satisfied users who found their dream
                        property through RoofSurf.
                    </p>
                    <Link
                        to={"/search"}
                        className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition-colors"
                    >
                        Start Searching Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
