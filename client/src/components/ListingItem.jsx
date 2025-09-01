import { Link } from "react-router-dom";
import { MdLocationOn, MdKingBed, MdBathtub } from "react-icons/md";
import { BiArea } from "react-icons/bi";

export default function ListingItem({ listing }) {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
            <Link to={`/listing/${listing._id}`}>
                <div className="relative overflow-hidden">
                    <img
                        src={listing.imageUrls[0]}
                        alt="listing cover"
                        className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                listing.type === "rent"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                        >
                            {listing.type === "rent" ? "For Rent" : "For Sale"}
                        </span>
                    </div>
                    {listing.offer && (
                        <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                                Special Offer
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 truncate mb-2 group-hover:text-blue-600 transition-colors">
                        {listing.name}
                    </h3>

                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                        <MdLocationOn className="h-4 w-4 text-blue-600" />
                        <p className="text-sm truncate">{listing.address}</p>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {listing.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-bold text-blue-600">
                            $
                            {listing.offer
                                ? listing.discountPrice.toLocaleString("en-US")
                                : listing.regularPrice.toLocaleString("en-US")}
                            {listing.type === "rent" && (
                                <span className="text-sm font-normal text-gray-600">
                                    /month
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-1 text-gray-600">
                            <MdKingBed className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">
                                {listing.bedrooms}{" "}
                                {listing.bedrooms === 1 ? "Bed" : "Beds"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-600">
                            <MdBathtub className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">
                                {listing.bathrooms}{" "}
                                {listing.bathrooms === 1 ? "Bath" : "Baths"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 text-gray-600">
                            <BiArea className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">
                                {listing.area} sqft
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
