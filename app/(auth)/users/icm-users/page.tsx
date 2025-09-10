"use client";
import { useGetAllIcmUsersQuery } from "@/redux/features/admin/adminApi";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Card } from "flowbite-react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";

const AllAgents = () => {
  const { data, isLoading, isError, isSuccess, error } =
    useGetAllIcmUsersQuery(undefined);
  const { users } = data || [];
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params: any) => (
        <div className="">
          <p>{params.row.name}</p>
        </div>
      ),
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 125,
      renderCell: (params: any) => (
        <div className="">
          <p>{params.row.mobile}</p>
        </div>
      ),
    },

    {
      field: "is_leader",
      headerName: "Leader/User",
      width: 100,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center">
            {params.row.is_leader ? (
              <p className="text-green-500 ">
                <span>Leader</span>
              </p>
            ) : (
              <p className="text-orange-500">
                <span>User</span>
              </p>
            )}
          </div>
        );
      },
    },

    {
      field: "is_active",
      headerName: "Status",
      width: 80,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center">
            {params.row.is_active ? (
              <p className="text-green-500 ">
                <span>Don</span>
              </p>
            ) : (
              <p className="text-orange-500">
                <span>Not</span>
              </p>
            )}
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 60,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center justify-center  w-full">
            <Link href={`/icm-users/${params.row.icm_id}`} passHref>
              <span className="text-center bg-red-500">
                <FaEye />
              </span>
            </Link>
          </div>
        );
      },
    },
  ];

  const rows: any = [];

  users &&
    users.map((user: any) => {
      return rows.unshift({
        id: user._id,
        icm_id: user._id,
        name: user.name,
        mobile: user.mobile,
        partner_id: user.partner_id,
        is_leader: user.is_leader,
        is_active: user.is_active,
      });
    });
  return (
    <div>
      <div style={{ height: "100%", width: "100%" }}>
        <Card className="my-2 d-flex align-items-center ">
          <div className="gap-2 flex list-none ">
            <li className="text-success h5"> Total Icm User:</li>
            <li className=" text-success h5">{users?.length}</li>
          </div>
        </Card>
        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid rows={rows} columns={columns} loading={isLoading} />
        </Box>
      </div>
    </div>
  );
};

export default AllAgents;
