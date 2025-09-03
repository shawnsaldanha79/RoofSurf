import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    const onChange = (evt) => {
        setMessage(evt.target.value);
    };

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/user/${
                        listing.userRef
                    }`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data = await res.json();
                setLandlord(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);

    return (
        <div className="mt-6">
            {landlord && (
                <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Contact Property Owner
                    </h3>

                    <div className="flex items-center gap-3 pb-4 border-b border-blue-100">
                        <img
                            src={landlord.avatar}
                            alt={landlord.username}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                            <p className="font-medium text-gray-800">
                                {landlord.username}
                            </p>
                            <p className="text-sm text-gray-600">
                                Property Owner
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-700">
                        Contact{" "}
                        <span className="font-semibold text-blue-600">
                            {landlord.username}
                        </span>{" "}
                        about
                        <span className="font-semibold text-blue-600">
                            {" "}
                            {listing.name}
                        </span>
                    </p>

                    <div>
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Your Message
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            rows={4}
                            value={message}
                            onChange={onChange}
                            placeholder="Introduce yourself and ask any questions about this property..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                        ></textarea>
                    </div>

                    <Link
                        to={`mailto:${landlord.email}?subject=Inquiry about ${
                            listing.name
                        }&body=${encodeURIComponent(message)}`}
                        className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Send Message
                    </Link>

                    <p className="text-xs text-gray-500 text-center">
                        Your message will be sent directly to the property
                        owner's email
                    </p>
                </div>
            )}
        </div>
    );
}
