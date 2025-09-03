import { auth } from "../supabase";
import { FcGoogle } from "react-icons/fc";

export default function OAuth() {
    const handleGoogleClick = async () => {
        try {
            await auth.signInWithGoogle();
        } catch (err) {
            console.log("Could not sign in with Google", err);
        }
    };

    return (
        <button
            onClick={handleGoogleClick}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 p-3 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
        </button>
    );
}
