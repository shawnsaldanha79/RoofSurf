import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { HiHomeModern } from "react-icons/hi2";


export default function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (evt) => {
        setFormData({
            ...formData,
            [evt.target.id]: evt.target.value,
        });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        try {
            setLoading(true);
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                return;
            }
            setLoading(false);
            setError(null);
            navigate("/sign-in");
        } catch (err) {
            setLoading(false);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <HiHomeModern className="text-white text-3xl" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-600">
                        Join RoofSurf to find your perfect home
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            id="username"
                            onChange={handleChange}
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
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            id="email"
                            onChange={handleChange}
                        />
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
                            placeholder="Create a password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            id="password"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-md"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <OAuth />
                </form>

                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to={"/sign-in"}
                            className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {error && (
                    <p className="mt-4 text-red-600 text-center">{error}</p>
                )}
            </div>
        </div>
    );
}
