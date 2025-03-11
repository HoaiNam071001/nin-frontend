import CourseDetail from "./_components/course-detail";
interface PageProps {
  params: { slug: string };
}
const CourseOverviewPage = ({ params }: PageProps) => {
  return (
    <div className="relative h-full">
      <CourseDetail slug={params.slug}/>
    </div>
  );
};

export default CourseOverviewPage;
