import CourseDetail from "@/components/CourseDetail";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
interface PageProps {
  params: { slug: string }; // Next.js tự động cung cấp params
}
const CourseOverviewPage = ({ params }: PageProps) => {
  return (
    <DefaultLayout>
      <CourseDetail slug={params.slug}/>
    </DefaultLayout>
  );
};

export default CourseOverviewPage;
