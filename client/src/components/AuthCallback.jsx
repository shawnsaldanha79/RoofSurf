import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../supabase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function AuthCallback() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const finishAuth = async () => {
            try {
                const session = await auth.getSession();
                if (session) {
                    const user = session.user;

                    const res = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/auth/google`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                name:
                                    user.user_metadata.full_name || user.email,
                                email: user.email,
                                photo: user.user_metadata.avatar_url,
                            }),
                            credentials: "include",
                        }
                    );

                    if (res.ok) {
                        const userData = await res.json();
                        dispatch(signInSuccess(userData));
                        navigate("/");
                    } else {
                        console.error("Failed to authenticate with backend");
                        navigate("/sign-in");
                    }
                } else {
                    navigate("/sign-in");
                }
            } catch (error) {
                console.error("Error finishing OAuth:", error);
                navigate("/sign-in");
            }
        };

        finishAuth();
    }, [navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                    Completing authentication...
                </p>
            </div>
        </div>
    );
}
