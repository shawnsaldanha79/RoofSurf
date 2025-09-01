import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signOutUserStart,
    signOutUserFailure,
    signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { LuCamera } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEdit } from "react-icons/md";

export default function Profile() {
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (err) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                );
            }
        );
    };

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.id]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (err) {
            dispatch(updateUserFailure(err.message));
        }
    };

    const handleDeleteUser = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        )
            return;
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (err) {
            dispatch(deleteUserFailure(err.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signout`);
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }
            dispatch(signOutUserSuccess(data));
        } catch (err) {
            dispatch(signOutUserFailure(err.message));
        }
    };

    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                return;
            }
            setUserListings(data);
        } catch (err) {
            setShowListingsError(true);
        }
    };

    const handleListingDelete = async (listingId) => {
        if (!window.confirm("Are you sure you want to delete this listing?"))
            return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/delete/${listingId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingId)
            );
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Profile Settings
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center mb-6">
                        <input
                            onChange={(evt) => setFile(evt.target.files[0])}
                            type="file"
                            ref={fileRef}
                            hidden
                            accept="image/*"
                        />
                        <div className="relative">
                            <img
                                onClick={() => fileRef.current.click()}
                                src={formData.avatar || currentUser.avatar}
                                alt="profile"
                                className="rounded-full h-28 w-28 object-cover cursor-pointer border-4 border-white shadow-lg"
                            />
                            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer">
                                <LuCamera className="text-white" />
                            </div>
                        </div>

                        <p className="text-sm mt-3 text-center">
                            {fileUploadError ? (
                                <span className="text-red-600">
                                    Error uploading image (max 2MB)
                                </span>
                            ) : filePerc > 0 && filePerc < 100 ? (
                                <span className="text-blue-600">{`Uploading ${filePerc}%`}</span>
                            ) : filePerc === 100 ? (
                                <span className="text-green-600">
                                    Image uploaded successfully!
                                </span>
                            ) : (
                                ""
                            )}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Username"
                                defaultValue={currentUser.username}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                id="username"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                defaultValue={currentUser.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                id="email"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            id="password"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Leave blank to keep current password
                        </p>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-md"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>

                    <Link
                        to={"/create-listing"}
                        className="block w-full bg-green-600 text-white text-center rounded-lg py-3 font-medium hover:bg-green-700 transition-colors shadow-md"
                    >
                        Create New Listing
                    </Link>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <button
                            onClick={handleShowListings}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            {userListings.length > 0
                                ? "Refresh Listings"
                                : "Show My Listings"}
                        </button>

                        <div className="flex gap-4">
                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Sign Out
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="mt-4 text-red-600 text-center">{error}</p>
                    )}
                    {updateSuccess && (
                        <p className="mt-4 text-green-600 text-center">
                            Profile updated successfully!
                        </p>
                    )}
                    {showListingsError && (
                        <p className="mt-4 text-red-600 text-center">
                            Error loading listings
                        </p>
                    )}
                </div>

                {userListings && userListings.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Your Listings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userListings.map((listing) => (
                                <div
                                    key={listing._id}
                                    className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center"
                                >
                                    <Link
                                        to={`/listing/${listing._id}`}
                                        className="flex-shrink-0"
                                    >
                                        <img
                                            src={listing.imageUrls[0]}
                                            alt="listing cover"
                                            className="h-20 w-20 object-cover rounded-lg"
                                        />
                                    </Link>
                                    <div className="flex-grow">
                                        <Link
                                            className="text-gray-800 font-semibold hover:text-blue-600 transition-colors line-clamp-1"
                                            to={`/listing/${listing._id}`}
                                        >
                                            {listing.name}
                                        </Link>
                                        <p className="text-gray-600 text-sm mt-1">
                                            $
                                            {listing.offer
                                                ? listing.discountPrice.toLocaleString()
                                                : listing.regularPrice.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleListingDelete(listing._id)
                                            }
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete listing"
                                        >
                                            <RxCross2 />
                                        </button>
                                        <Link
                                            to={`/update-listing/${listing._id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit listing"
                                        >
                                            <MdOutlineEdit />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
