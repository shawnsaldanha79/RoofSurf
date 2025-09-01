import { TfiWorld } from "react-icons/tfi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { PiLightning } from "react-icons/pi";

export default function About() {
    return (
        <div className="py-16 px-4 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">
                    About RoofSurf
                </h1>
                <div className="space-y-6 text-gray-700">
                    <p className="text-lg leading-relaxed">
                        At{" "}
                        <span className="font-semibold text-blue-600">
                            RoofSurf
                        </span>
                        , we're revolutionizing the way people find their
                        perfect homes. Our platform connects property seekers
                        with landlords in a seamless, intuitive experience.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Our team of dedicated professionals is passionate about
                        making the home search process enjoyable and
                        stress-free. With cutting-edge technology and
                        personalized service, we guide you through every step of
                        your real estate journey.
                    </p>
                    <p className="text-lg leading-relaxed">
                        Whether you're looking to rent, buy, or list your
                        property, RoofSurf provides the tools and expertise to
                        help you achieve your real estate goals with confidence
                        and ease.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TfiWorld className="text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Wide Selection
                        </h3>
                        <p className="text-gray-600">
                            Thousands of properties across various locations and
                            budgets
                        </p>
                    </div>

                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoShieldCheckmarkOutline className="text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Trusted Platform
                        </h3>
                        <p className="text-gray-600">
                            Verified listings and secure transactions for peace
                            of mind
                        </p>
                    </div>

                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <PiLightning className="text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Quick Response
                        </h3>
                        <p className="text-gray-600">
                            Instant notifications and fast communication with
                            property owners
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-6">
                        Ready to start your journey?
                    </p>
                    <a
                        href="/search"
                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Explore Properties
                    </a>
                </div>
            </div>
        </div>
    );
}
