import CoursePage from "./ClientCoursePage";
interface PageProps {
  params: { slug: string }; // Next.js tự động cung cấp params
}
const CourseOverviewPage = ({ params }: PageProps) => {

  return (
    <div>
        <CoursePage slug={params.slug}></CoursePage>
    </div>
  );
};

export default CourseOverviewPage;
