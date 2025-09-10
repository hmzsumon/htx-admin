"use client";
import ToggleSwitch from "@/components/ToggleSwitch";
import CopyToClipboard from "@/lib/CopyToClipboard";
import {
  useGetIcmUserByIdQuery,
  useReadUserMutation,
  useWithdrawBlockMutation,
} from "@/redux/features/admin/adminApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import { ListGroup } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { LuMoveLeft } from "react-icons/lu";
import { BeatLoader, GridLoader } from "react-spinners";
import { toast } from "react-toastify";

const UserDetails = ({ params }: any) => {
  const router = useRouter();
  const { icm_id } = params;
  const { data, isLoading, isError, isSuccess, error } =
    useGetIcmUserByIdQuery(icm_id);
  const { user, wallet } = data || {};

  const [
    readUser,
    { isLoading: isBlocking, isError: isBlocError, error: blockError },
  ] = useReadUserMutation();
  const [
    withdrawBlock,
    { isLoading: isLoadingBlock, isSuccess: isSuccessBlock },
  ] = useWithdrawBlockMutation();

  // ✅ Two separate toggle states
  const [isUserBlocked, setIsUserBlocked] = useState(false);

  // ✅ Set values from user data
  useEffect(() => {
    if (user) {
      setIsUserBlocked(user?.is_active || false); // Assuming user has is_blocked field
    }
  }, [user]);

  // ✅ Handle user block toggle
  const handleToggleUserBlock = async (checked: boolean) => {
    setIsUserBlocked(checked);
    try {
      await readUser({ partner_id: user?.partner_id }).unwrap();
      toast.success("User Done/Undone successful");
    } catch (error) {
      setIsUserBlocked(!checked);
      console.error("User block toggle error:", error);
    }
  };

  useEffect(() => {
    if (isBlocError && blockError) {
      toast.error((blockError as fetchBaseQueryError).data?.message);
    }
  }, [isBlocError, blockError]);

  return (
    <div>
      <div>
        <button
          className="flex items-center gap-1"
          onClick={() => router.back()}
        >
          <LuMoveLeft />
          Go Back
        </button>
      </div>
      <div className="text-left">
        <h1 className="text-2xl font-semibold text-center">User details</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center my-6">
          <GridLoader color="#2563EB" size={30} />
        </div>
      ) : (
        <div className="my-4 space-y-4">
          {/* User Info */}
          <div>
            <h3 className="font-bold ml-2 my-1">
              User Info
              <span>
                {user?.is_active ? (
                  <span className="text-green-500 ml-2">Active</span>
                ) : (
                  <span className="text-red-500 ml-2">Inactive</span>
                )}
              </span>
            </h3>

            {/* 🔁 User Block Toggle */}
            <div className="my-2">
              {isBlocking ? (
                <BeatLoader color="#2563EB" size={10} />
              ) : (
                <ToggleSwitch
                  title={isUserBlocked ? "Click to Done" : "Click to Not Done"}
                  checked={isUserBlocked}
                  onChange={handleToggleUserBlock}
                />
              )}
            </div>

            <ListGroup>
              <ListGroup.Item>
                <span className="flex gap-4">
                  <span>User name:</span>
                  <span className="font-bold">{user?.name || "N/A"}</span>
                </span>
              </ListGroup.Item>

              <ListGroup.Item>
                <span className="flex gap-4 items-center">
                  <span>User Id:</span>
                  <span className="flex items-center gap-1 font-bold">
                    {user?.partner_id || "N/A"}
                  </span>
                </span>
                <CopyToClipboard text={user?.customer_id} />
              </ListGroup.Item>

              <ListGroup.Item>
                <span className="flex items-center gap-4 ">
                  <span>Mobile:</span>
                  <span className="font-bold">{user?.mobile}</span>
                </span>
                <CopyToClipboard text={user?.mobile} />
              </ListGroup.Item>

              <ListGroup.Item>
                <span className="flex items-center gap-4 ">
                  <span>Email:</span>
                  <span className="font-bold">{user?.email}</span>
                </span>
                <CopyToClipboard text={user?.customer_id} />
              </ListGroup.Item>
            </ListGroup>
          </div>

          {/* Wallet Info */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold ml-2 my-1">Wallet Info</h3>
              <Link
                href={`/transactions/${user?.customer_id}`}
                className="flex items-center gap-1"
              >
                <span className="text-blue-500">View Transactions</span>
                <FaExternalLinkAlt className="text-sm text-blue-500" />
              </Link>
            </div>
            <ListGroup>
              {[
                ["Total Invest", user?.total_investment],
                ["Total Withdraw", user?.total_withdraw],
                ["Total Earning", user?.total_earing],
                ["Total Member", user?.total_member],
                ["Total Sales", user?.total_sales],
              ].map(([label, value], i) => (
                <ListGroup.Item key={i}>
                  <span className="flex items-center gap-4">
                    <span>{label}:</span>
                    <span className="font-bold">
                      {Number(value).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
