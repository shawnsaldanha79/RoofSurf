import { useEffect, useState } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaUpload } from "react-icons/fa";

export default function UpdateListing() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        };
        fetchListing();
    }, [params.listingId]);

    const handleImageSubmit = (evt) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch((err) => {
                    setImageUploadError(
                        "Image upload failed (2 mb max per image)"
                    );
                    setUploading(false);
                });
        } else {
            setImageUploadError("You can only upload 6 images per listing");
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (err) => {
                    reject(err);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                            resolve(downloadURL);
                        }
                    );
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((url, i) => i !== index),
        });
    };

    const handleChange = (evt) => {
        if (evt.target.id === "sale" || evt.target.id === "rent") {
            setFormData({
                ...formData,
                type: evt.target.id,
            });
        }
        if (
            evt.target.id === "parking" ||
            evt.target.id === "furnished" ||
            evt.target.id === "offer"
        ) {
            setFormData({
                ...formData,
                [evt.target.id]: evt.target.checked,
            });
        }
        if (
            evt.target.type === "number" ||
            evt.target.type === "text" ||
            evt.target.type === "textarea"
        ) {
            setFormData({
                ...formData,
                [evt.target.id]: evt.target.value,
            });
        }
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            if (formData.imageUrls.length < 1) {
                return setError("You must upload at least one image");
            }
            if (+formData.regularPrice < +formData.discountPrice) {
                return setError(
                    "Discount price must be lower than regular price"
                );
            }
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors mb-4"
                        >
                            <FaArrowLeft />
                            Back
                        </button>
                        <h1 className="text-3xl font-bold">
                            Update Your Listing
                        </h1>
                        <p className="text-blue-100 mt-2">
                            Make changes to your property listing
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {/* Left Column - Property Details */}
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Property Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Modern Downtown Apartment"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    id="name"
                                    maxLength="62"
                                    minLength="10"
                                    required
                                    onChange={handleChange}
                                    value={formData.name}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Description *
                                </label>
                                <textarea
                                    placeholder="Describe your property in detail..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none h-32"
                                    id="description"
                                    required
                                    onChange={handleChange}
                                    value={formData.description}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Full Address *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter complete address"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    id="address"
                                    required
                                    onChange={handleChange}
                                    value={formData.address}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Property Type *
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            id="rent"
                                            className="w-4 h-4 text-blue-600"
                                            onChange={handleChange}
                                            checked={formData.type === "rent"}
                                        />
                                        <span className="text-gray-700">
                                            For Rent
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            id="sale"
                                            className="w-4 h-4 text-blue-600"
                                            onChange={handleChange}
                                            checked={formData.type === "sale"}
                                        />
                                        <span className="text-gray-700">
                                            For Sale
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="bedrooms"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Bedrooms
                                    </label>
                                    <input
                                        type="number"
                                        id="bedrooms"
                                        min="1"
                                        max="10"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        onChange={handleChange}
                                        value={formData.bedrooms}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="bathrooms"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Bathrooms
                                    </label>
                                    <input
                                        type="number"
                                        id="bathrooms"
                                        min="1"
                                        max="10"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        onChange={handleChange}
                                        value={formData.bathrooms}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="regularPrice"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Regular Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        id="regularPrice"
                                        min="50"
                                        max="10000000"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        onChange={handleChange}
                                        value={formData.regularPrice}
                                    />
                                </div>

                                {formData.offer && (
                                    <div>
                                        <label
                                            htmlFor="discountPrice"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Discounted Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            id="discountPrice"
                                            min="0"
                                            max="10000000"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                            onChange={handleChange}
                                            value={formData.discountPrice}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Features & Images */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Amenities
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            id="parking"
                                            className="w-4 h-4 text-blue-600"
                                            onChange={handleChange}
                                            checked={formData.parking}
                                        />
                                        <span className="text-gray-700">
                                            Parking Spot
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            id="furnished"
                                            className="w-4 h-4 text-blue-600"
                                            onChange={handleChange}
                                            checked={formData.furnished}
                                        />
                                        <span className="text-gray-700">
                                            Furnished
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            id="offer"
                                            className="w-4 h-4 text-blue-600"
                                            onChange={handleChange}
                                            checked={formData.offer}
                                        />
                                        <span className="text-gray-700">
                                            Special Offer
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Property Images *
                                    <span className="font-normal text-gray-500 ml-1">
                                        First image will be the cover (max 6)
                                    </span>
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        onChange={(evt) =>
                                            setFiles(evt.target.files)
                                        }
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        type="file"
                                        id="images"
                                        accept="image/*"
                                        multiple
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageSubmit}
                                        disabled={uploading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors whitespace-nowrap flex items-center gap-2"
                                    >
                                        <FaUpload className="text-sm" />
                                        {uploading ? "Uploading..." : "Upload"}
                                    </button>
                                </div>
                                {imageUploadError && (
                                    <p className="mt-2 text-red-600 text-sm">
                                        {imageUploadError}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {formData.imageUrls.map((url, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={url}
                                            alt="listing"
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(i)}
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTrash className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                disabled={loading || uploading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-md"
                            >
                                {loading
                                    ? "Updating Listing..."
                                    : "Update Listing"}
                            </button>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">
                                        {error}
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
