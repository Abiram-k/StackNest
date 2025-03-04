import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { IUser } from "../../../types/user";

type customTableType = {
  data: IUser[] | undefined;
};
const CustomTable = ({ data }: customTableType) => {
  const [isChecked, setIsChecked] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (userName: string, isBlocked: boolean) => {
    setIsChecked((prev) => ({
      ...prev,
      [userName]: !isBlocked,
    }));
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=" text-center font-extrabold">Sl.No</TableHead>
            <TableHead className="text-center font-extrabold">
              Profile
            </TableHead>
            <TableHead className="text-center font-extrabold">
              User Name
            </TableHead>
            <TableHead className="text-center font-extrabold">Email</TableHead>
            <TableHead className="text-center font-extrabold">
              Block/Unblock
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[16px]">
          {data?.map((user, index) => (
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
                {user.firstName || "No name"}
              </TableCell>
              <TableCell className="text-center">
                {user.email ? user.email : "noName@gmail.com"}
              </TableCell>
              <TableCell className="text-center">
                <Switch
                  checked={isChecked[user.userName] ?? user.isBlocked}
                  onCheckedChange={() =>
                    handleToggle(
                      user.userName,
                      isChecked[user.userName] || user.isBlocked
                    )
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomTable;
