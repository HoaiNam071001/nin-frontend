import NEditor from "@/components/_commons/NEditor";

interface RejectionReasonProps {
  data: any; // Bạn có thể định nghĩa type cụ thể hơn nếu cần
}

const RejectionReason: React.FC<RejectionReasonProps> = ({ data }) => {
  return (
    <div className="mt-6 bg-red-50 p-4 rounded-lg border border-red-200">
      <h3 className="text-lg font-semibold text-red-800">
        Reason for Rejection
      </h3>
      <div className="mt-2 text-red-700">
        {data?.content ? (
          <NEditor value={data.content} readOnly={true} />
        ) : (
          <p>No reason provided.</p>
        )}
      </div>
    </div>
  );
};

export default RejectionReason;
