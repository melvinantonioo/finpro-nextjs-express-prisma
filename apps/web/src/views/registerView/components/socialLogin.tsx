import { FaFacebook, FaApple } from 'react-icons/fa';

const SocialLogin: React.FC = () => (
    <div className="mt-4">
        <button className="flex items-center justify-center w-full p-2 mb-2 border border-gray-300 rounded">
            Sign in with Google
        </button>
        <div className="flex justify-center gap-4 mt-2">
            <FaFacebook size={32} className="text-blue-600 cursor-pointer" />
            <FaApple size={32} className="text-gray-800 cursor-pointer" />
        </div>
    </div>
);

export default SocialLogin;