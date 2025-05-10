"use client";

import StatusBadge from "@/components/CourseItem/StatusBadge";
import { CourseStatus, Role } from "@/constants";
import { DashboardReport } from "@/models/admin/course-admin.model";
import { adminService } from "@/services/admin/admin.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useState } from "react";
import RoleLabel from "../users/_components/RoleLabel";
import FilePanel from "./_component/FileCount";

const SystemPanel = () => {
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const item = await adminService.getSystemInfo();
        setReport(item);
        setLoading(false);
      } catch (error: any) {
        toastService.error(error?.message || "500 Error");
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg mx-auto max-w-md mt-8">
        Failed to load report data.
      </div>
    );
  }

  return (
    <div className="p-4 shadow bg-gray-50">
      <FilePanel />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Users</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Users */}
            <div className="bg-white rounded-xl shadow-lg p-3 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-600">
                    Total Users
                  </h3>
                  <p className="text-title-lg font-bold text-blue-600">
                    {report.users.totalUsers}
                  </p>
                </div>
              </div>
            </div>
            {/* Active Users */}
            <div className="bg-white rounded-xl shadow-lg p-3 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-600">
                    Active Users
                  </h3>
                  <p className="text-title-lg font-bold text-green-600">
                    {report.users.activeUsers}
                  </p>
                </div>
              </div>
            </div>
            {/* Inactive Users */}
            <div className="bg-white rounded-xl shadow-lg p-3 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-600">
                    Inactive Users
                  </h3>
                  <p className="text-title-lg font-bold text-red-600">
                    {report.users.inactiveUsers}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Roles */}
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(report.users.role).map(([role, count]) => (
                <div
                  key={role}
                  className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-transform duration-300"
                >
                  <RoleLabel role={role as Role} />
                  <span className="text-2xl font-bold text-gray-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Course Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Courses */}
            <div className="bg-white rounded-xl shadow-lg p-4 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-600">
                    Total Courses
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {report.courses.totalCourses}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Status */}
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(report.courses.status).map(([status, count]) => (
                <div
                  key={status}
                  className="bg-white rounded-xl shadow-lg p-4 flex items-center justify-between transform hover:scale-105 transition-transform duration-300"
                >
                  <StatusBadge status={status as CourseStatus} />
                  <span className="text-2xl font-bold text-gray-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SystemPanel;
