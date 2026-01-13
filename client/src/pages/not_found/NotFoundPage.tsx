import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl text-center text-white max-w-md">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
                <p className="mb-6 text-gray-300">
                    The page you are looking for does not exist or has been moved
                </p>

                <Link
                    to="/"
                    className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                    Back to the home page
                </Link>
            </div>
        </main>
    );
}
