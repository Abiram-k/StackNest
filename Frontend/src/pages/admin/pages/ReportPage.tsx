import NotificationCard from "@/components/card/NotificationCard";
import { FallBackTable } from "@/components/FallBackTable";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllReports } from "@/hooks/admin/reportManagement/useGetAllReports";
import { useRejectReport } from "@/hooks/admin/reportManagement/useRejectReport";
import { useResolveReport } from "@/hooks/admin/reportManagement/useResolveReport";
import { useState } from "react";

const filterOptions = [
  { value: "Resolved" },
  { value: "Rejected" },
  { value: "Pending" },
  { value: "HighPriority", label: "High Priority" },
  { value: "MediumPriority", label: "Medium Priority" },
  { value: "LowPriority", label: "Low Priority" },
];
const sortOptions = [{ value: "Latest" }, { value: "Oldest" }];

export default function ReportsPage() {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: reportData, isLoading: fetchIsLoading } = useGetAllReports({
    filter,
    sort,
    currentPage,
  });

  const { mutate: resolveMutate, isPending: resolving } = useResolveReport();
  const { mutate: rejectMutate, isPending: rejecting } = useRejectReport();
  const handleResolveReport = (reportId: string) => {
    resolveMutate(reportId);
  };
  const handleRejectReport = (reportId: string) => {
    rejectMutate(reportId);
  };

  return (
    <div className="flex h-content mt-20">
      {(fetchIsLoading || resolving || rejecting) && <Spinner />}
      <div className="flex-1  p-8">
        <div className=" flex justify-between mb-10 flex-col md:flex-row">
          <h1 className="text-2xl font-bold mb-8 border-b pb-2">Reports</h1>

          <FilterBar
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            setFilterQuery={setFilter}
            setSortedOrder={setSort}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {reportData?.reports.map((report) => (
            <NotificationCard
              key={report._id}
              notificationId={report._id}
              onAccept={handleResolveReport}
              onReject={handleRejectReport}
              name={report.userName}
              timeAgo={report.createdAt}
              reason={report.reason}
              message={report.message}
              profileImage={report.userAvatar}
              priority={report.priority}
              status={report.status}
              reportedId={report.reportedEntityId}
              type={report.type}
            />
          ))}
        </div>
        {reportData?.reports && reportData.reports.length > 0 && (
          <Pagination
            onPageChange={setCurrentPage}
            totalPages={reportData?.totalPages || 1}
          />
        )}
        {!reportData?.reports ||
          (reportData.reports.length == 0 && (
            <FallBackTable
              mainTitle="No Reports yet"
              subTitle="We will notify once report update"
            />
          ))}
      </div>
    </div>
  );
}
