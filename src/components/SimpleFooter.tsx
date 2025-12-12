const SimpleFooter = () => {
  const getYear = () => {
    return new Date().getFullYear();
  };
  return (
    <footer className="text-center text-xs mt-8 text-white drop-shadow-2xl">
      <p>© {getYear()} Tforart Tripsy</p>
      <p>Made by Nguyen Son Tung</p>
      <p className="font-light text-gray-300">
        Explore more:{" "}
        <a
          className="underline "
          href="https://tforart.vn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tforart Production
        </a>
      </p>
    </footer>
  );
};

export default SimpleFooter;
