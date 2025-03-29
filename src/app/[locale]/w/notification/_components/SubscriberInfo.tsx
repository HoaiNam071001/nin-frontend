import NAvatar from "@/components/_commons/NAvatar";
import { User } from "@/models";

interface SubscriberInfoProps {
  sender: User;
}

const SubscriberInfo: React.FC<SubscriberInfoProps> = ({ sender }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Subscriber Information
      </h3>
      {sender ? (
        <div className="flex">
          <NAvatar
            src={sender.avatar}
            name={sender.firstName || "Unknown"}
            showName={true}
            userId={sender.id}
            email={sender.email || "No email provided"}
          />
        </div>
      ) : (
        <p className="text-gray-500">No subscriber information available.</p>
      )}
    </div>
  );
};

export default SubscriberInfo;
