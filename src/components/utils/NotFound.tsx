
const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto h-[calc(100vh-130px)] rounded-sm grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Something's missing.</p>
            <p className="mb-4 text-lg font-light text-gray-500">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <a href="#" className="inline-flex text-white bg-system hover:bg-system focus:ring-4 focus:outline-none focus:ring-system font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Back to Homepage</a>
        </div>   
    </div>
    </div>
  );
};

export default NotFound;
