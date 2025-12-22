import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Search, Trash2, UserCog, ShieldCheck, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Avatar,
  TablePagination,
} from "@mui/material";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/ui/Loading";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterRole, setFilterRole] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users");
      return res.data;
    },
  });

  const filteredUsers = users.filter((user) => {
    // Search Filter
    const matchesSearch =
      !searchTerm ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Role Filter
    const matchesRole = filterRole === "all" || user.role === filterRole;

    // Plan Filter
    // Note: user.isPremium is boolean
    let matchesPlan = true;
    if (filterPlan === "premium") matchesPlan = user.isPremium === true;
    if (filterPlan === "free") matchesPlan = user.isPremium === false;

    return matchesSearch && matchesRole && matchesPlan;
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      await axiosSecure.patch(`/admin/users/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Role updated",
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });

  const handleRoleUpdate = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    Swal.fire({
      title: "Change role?",
      text: `Do you want to make ${user.name}'s role ${
        newRole === "admin" ? "Admin" : "User"
      }?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserRoleMutation.mutate({ id: user._id, role: newRole });
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
    <div className="space-y-6">
      <Helmet>
        <title>Manage Users | Digital Life Lessons</title>
      </Helmet>

      {/* Header + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold text-gray-900">{users.length}</h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-sm text-gray-500">Premium Members</p>
          <h2 className="text-3xl font-bold text-yellow-600">
            {users.filter((u) => u.isPremium).length}
          </h2>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <p className="text-sm text-gray-500">Admins</p>
          <h2 className="text-3xl font-bold text-primary-600">
            {users.filter((u) => u.role === "admin").length}
          </h2>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search user name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-gray-50"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-gray-50"
          >
            <option value="all">All Plans</option>
            <option value="premium">Premium</option>
            <option value="free">Free</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border">
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Lessons</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar src={user.photoURL}>
                          {user.name?.charAt(0)}
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        icon={
                          user.role === "admin" ? (
                            <ShieldCheck size={14} />
                          ) : (
                            <User size={14} />
                          )
                        }
                        label={user.role}
                        color={user.role === "admin" ? "primary" : "default"}
                      />
                    </TableCell>

                    <TableCell>{user.totalLessons || 0}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={user.isPremium ? "Premium" : "Free"}
                        color={user.isPremium ? "warning" : "default"}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Change Role">
                        <IconButton onClick={() => handleRoleUpdate(user)}>
                          <UserCog className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
    </div>
  );
};

export default ManageUsers;
