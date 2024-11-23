const Loader = ({ color = "system", size = "md" }) => {

  const sizes = {
    xl: 'h-14 w-14 border-4',
    lg: 'h-10 w-10 border-4',
    md: 'h-8 w-8 border-4',
    sm: 'h-6 w-6 border-2',
    xs: 'h-3 w-3 border-2',
  }
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-solid border-${color} border-t-transparent`}
    ></div>
  );
};

export default Loader;
