import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import ConfirmationDialog from "./modal/confirmationDialog";
import toast from "react-hot-toast";

export type Column<T extends { _id: string }> = {
  render?: (item: T) => React.ReactNode;
  key: keyof T;
  header: string;
};

type CustomTableProps<T extends { _id: string }> = {
  data: T[] | undefined;
  columns: Column<T>[];
  onToggleAction?: (item: T) => void;
  toggleKey?: keyof T;
  onViewMore?: (id: string) => void;
};

const CustomTableComponent = <T extends { _id: string }>({
  data,
  columns,
  onToggleAction,
  toggleKey,
  onViewMore,
}: CustomTableProps<T>) => {
  const [isCheckedItem, setIsCheckedItem] = useState<T | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [localData, setLocalData] = useState<T[] | undefined>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleToggle = (item: T) => {
    setIsCheckedItem(item);
    setIsConfirmationOpen(true);
  };

  const handleConfirm = () => {
    if (onToggleAction && isCheckedItem) {
      onToggleAction(isCheckedItem);
      setLocalData((prev) =>
        prev?.map((item) =>
          item === isCheckedItem
            ? { ...item, [toggleKey as keyof T]: !item[toggleKey as keyof T] }
            : item
        )
      );
    }
    setIsConfirmationOpen(false);
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
          message={`Are you sure you want to perform this action?`}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-extrabold">Sl.No</TableHead>
            {columns.map((column) => (
              <TableHead
                key={column.key.toString()}
                className="text-center font-extrabold"
              >
                {column.header}
              </TableHead>
            ))}
            {onToggleAction && toggleKey && (
              <TableHead className="text-center font-extrabold">
                Action
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody className="text-[16px]">
          {localData?.map((item, index) => (
            <TableRow
              key={index}
              className="cursor-pointer"
              onClick={() => onViewMore?.(item._id)}
            >
              <TableCell className="text-center font-medium">
                {index + 1}
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col.key.toString()} className="text-center">
                  {col.render
                    ? col.render(item)
                    : String(item[col.key]).length > 32
                    ? String(item[col.key]).slice(0, 32) + "..."
                    : String(item[col.key])}
                </TableCell>
              ))}

              {onToggleAction && toggleKey && (
                <TableCell className="text-center">
                  <Switch
                    checked={!!item[toggleKey]}
                    onCheckedChange={() => handleToggle(item)}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const CustomTable = React.memo(CustomTableComponent) as <
  T extends { _id: string }
>(
  props: CustomTableProps<T>
) => JSX.Element;

export default CustomTable;
