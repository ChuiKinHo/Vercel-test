const Overlay = ({ children }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-400/50 z-50">
      <div className="flex w-full h-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Overlay;
