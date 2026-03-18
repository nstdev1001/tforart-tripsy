import { Link } from "react-router-dom";

const SimpleFooter = () => {
  const getYear = () => {
    return new Date().getFullYear();
  };
  return (
    <footer className="flex flex-col gap-1 text-center text-xs mt-8 text-white drop-shadow-2xl">
      <p>© {getYear()} Tforart Tripsy</p>
      <p>Made by Nguyen Son Tung</p>
      <p className="font-light text-gray-300">
        <Link className="hover:underline" to="/privacy-policy">
          Privacy Policy
        </Link>{" "}
        ·{" "}
        <Link className="hover:underline" to="/data-deletion">
          Data Deletion
        </Link>
      </p>
      <br />
      <p className="font-semibold text-gray-300">
        Explore more:{" "}
        <Link
          className="underline "
          to="https://tforart.vn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tforart Production
        </Link>
      </p>
    </footer>
  );
};

export default SimpleFooter;
