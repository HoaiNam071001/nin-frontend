// components/CourseContainer.js
function CourseContainer({ children, className, ...rest }: {
  children: React.ReactNode;
  className?: string;
  [x: string]: any;
}) {
  return (
    <div className={`course-container ${className ? className : ''}`} {...rest}>
      <div className="course-grid">{children}</div>
    </div>
  );
}

export default CourseContainer;
