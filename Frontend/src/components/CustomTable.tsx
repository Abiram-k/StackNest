import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import { IUser } from "../../../types/user";
import ConfirmationDialog from "./ui/confirmationDialog";
import toast from "react-hot-toast";

type customTableType = {
  data: IUser[] | undefined;
  isToggleblockUser: (value: string) => void;
};
const CustomTable = React.memo(
  ({ data, isToggleblockUser }: customTableType) => {
    const [isCheckedUser, setIsCheckedUser] = useState("");
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [localData, setLocalData] = useState(data);

    useEffect(() => {
      setLocalData(data);
    }, [data]);

    const handleToggle = (userName: string) => {
      setIsCheckedUser((prev) => (prev = userName));
      setIsConfirmationOpen(true);
    };

    const handleConfirm = () => {
      setIsConfirmationOpen(false);
      isToggleblockUser(isCheckedUser);
      setLocalData((prev) =>
        prev?.map((user) =>
          user.userName == isCheckedUser
            ? { ...user, isBlocked: !user.isBlocked }
            : user
        )
      );
    };

    const handleCancel = () => {
      toast.success("Action Cancelled");
      setIsConfirmationOpen(false);
    };

    return (
      <div>
        {isConfirmationOpen && (
          <ConfirmationDialog
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            message={`Are you sure for this action `}
          />
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" text-center font-extrabold">
                Sl.No
              </TableHead>
              <TableHead className="text-center font-extrabold">
                Profile
              </TableHead>
              <TableHead className="text-center font-extrabold">
                User Name
              </TableHead>
              <TableHead className="text-center font-extrabold">
                Email
              </TableHead>
              <TableHead className="text-center font-extrabold">
                Block/Unblock
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[16px]">
            {localData?.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <img
                    src={
                      user.avatar
                        ? user.avatar
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                    alt=" user profile"
                    width={50}
                    className="rounded-full  mx-auto"
                  />
                </TableCell>
                <TableCell className="text-center ">
                  {user.userName || "No name"}
                </TableCell>
                <TableCell className="text-center">
                  {user.email ? user.email : "noName@gmail.com"}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={user.isBlocked}
                    onCheckedChange={() => handleToggle(user.userName)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
);

export default CustomTable;
