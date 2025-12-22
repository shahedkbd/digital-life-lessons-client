import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Trash2, AlertTriangle, Eye, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/ui/Loading";

const ReportedLessons = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch grouped reports (list of lessons with reports)
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reported-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/reported-lessons");
      return res.data;
    },
  });

  // Fetch details for selected lesson
  const { data: reportDetails = [], isLoading: detailsLoading } = useQuery({
    queryKey: ["report-details", selectedLessonId],
    queryFn: async () => {
      if (!selectedLessonId) return [];
      const res = await axiosSecure.get(
        `/admin/reported-lessons/${selectedLessonId}`
      );
      return res.data;
    },
    enabled: !!selectedLessonId,
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId) => {
      // Admin lesson delete endpoint
      await axiosSecure.delete(`/admin/lessons/${lessonId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reported-lessons"]);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Lesson deleted",
        showConfirmButton: false,
        timer: 2000,
      });
      setSelectedLessonId(null);
    },
  });

  const handleDelete = (lessonId) => {
    Swal.fire({
      title: "Confirm",
      text: "Do you want to delete this lesson?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      customClass: { title: "bangla-text", htmlContainer: "bangla-text" },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLessonMutation.mutate(lessonId);
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <Helmet>
        <title>Reported Content | Digital Life Lessons</title>
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-red-500" />
          Reported Content
        </h1>
        <p className="text-gray-600 mt-1">
          {reports.length} lessons flagged by the community
        </p>
      </div>

      {/* Reported Lessons List */}
      <div className="grid grid-cols-1 gap-4">
        {reports
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-xl border border-red-100 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 max-w-xl truncate">
                    {report.lesson?.title || "Deleted Lesson"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                      <AlertTriangle className="w-4 h-4" />
                      {report.reportCount} Reports
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="small"
                    variant="outlined"
                    color="info"
                    startIcon={<Eye className="w-4 h-4" />}
                    onClick={() => setSelectedLessonId(report._id)}
                  >
                    Review
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    startIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDelete(report._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <TablePagination
          component="div"
          count={reports.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </div>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedLessonId}
        onClose={() => setSelectedLessonId(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="font-bold">Community Complaints</DialogTitle>

        <DialogContent dividers>
          {detailsLoading ? (
            <div className="flex justify-center py-6">
              <Loading fullScreen={false} />
            </div>
          ) : reportDetails.length ? (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <Link
                  to={`/lesson/${selectedLessonId}`}
                  target="_blank"
                  className="text-primary-700 font-bold hover:underline"
                >
                  Open Lesson in New Tab →
                </Link>
              </div>

              {reportDetails.map((detail) => (
                <div
                  key={detail._id}
                  className="relative pl-4 border-l-4 border-red-400 bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {detail.reporter?.name || "Anonymous"} (
                        {detail.reporter?.email})
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(detail.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">
                      {detail.reason}
                    </span>
                  </div>

                  {detail.message && (
                    <p className="text-sm text-gray-700 mt-2">
                      {detail.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No complaints found.
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedLessonId(null)}>Close</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(selectedLessonId)}
          >
            Delete Lesson
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportedLessons;
