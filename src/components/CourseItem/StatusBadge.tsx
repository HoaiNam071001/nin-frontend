import { CourseStatus } from '@/constants';
import React from 'react';

interface StatusBadgeProps {
  status: CourseStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case CourseStatus.DRAFT:
        return {
          backgroundColor: '#E8F4FF',
          color: '#2B6CB0',
          borderColor: '#63B3ED',
          label: "Draft"
        };
      case CourseStatus.PENDING:
        return {
          backgroundColor: '#FFFAF0',
          color: '#D69E2E',
          borderColor: '#F6AD55',
          label: "Wait for approval"
        };
      case CourseStatus.READY:
        return {
          backgroundColor: '#F0FFF4',
          color: '#38A169',
          borderColor: '#68D391',
          label: "Published"
        };
      case CourseStatus.CLOSED:
        return {
          backgroundColor: '#FFF5F5',
          color: '#E53E3E',
          borderColor: '#FC8181',
          label: "Closed"
        };
      case CourseStatus.DELETED:
        return {
          backgroundColor: '#EDF2F7',
          color: '#718096',
          borderColor: '#CBD5E0',
          label: "Deleted"
        };
      default:
        return {};
    }
  };

  const { backgroundColor, color, borderColor, label } = getStatusStyle();

  return (
    <div
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor,
        color,
      }}
      className={`p-1 w-[150px] rounded-md inline-block text-center whitespace-nowrap`}
    >
      {label}
    </div>
  );
};

export default StatusBadge;
