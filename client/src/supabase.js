import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});
export const storage = {
    uploadImage: async (file, folder) => {
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                throw new Error("User must be authenticated to upload files");
            }

            const { data, error } = await supabase.storage
                .from("RoofSurf")
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from("RoofSurf").getPublicUrl(data.path);

            return publicUrl;
        } catch (error) {
            console.log(error);
            throw new Error("Image upload failed: " + error.message);
        }
    },

    deleteImage: async (path) => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                throw new Error("User must be authenticated to delete files");
            }

            const pathParts = path.split("/RoofSurf/");
            const filePath = pathParts.length > 1 ? pathParts[1] : path;

            const { error } = await supabase.storage
                .from("RoofSurf")
                .remove([filePath]);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            throw new Error("Image deletion failed: " + error.message);
        }
    },

    uploadMultipleImages: async (files, folder) => {
        try {
            const fileArray = Array.from(files);
            const uploadPromises = fileArray.map((file) =>
                storage.uploadImage(file, folder)
            );
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.log(error);
            throw new Error("Multiple image upload failed");
        }
    },
};

export const auth = {
    signInWithGoogle: async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: "offline",
                        prompt: "consent",
                    },
                },
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        }
    },

    getSession: async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback);
    },
};

export default supabase;
