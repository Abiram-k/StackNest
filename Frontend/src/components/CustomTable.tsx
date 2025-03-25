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
import { Pencil, Trash2 } from "lucide-react";

export type Column<T extends { _id: string | undefined }> = {
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
  handleEdit?: (id: string) => void;
  handleRemove?: (id: string) => void;
};

const CustomTableComponent = <T extends { _id: string }>({
  data,
  columns,
  onToggleAction,
  toggleKey,
  onViewMore,
  handleEdit,
  handleRemove,
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
    // <div>
    //   {isConfirmationOpen && (
    //     <ConfirmationDialog
    //       onConfirm={handleConfirm}
    //       onCancel={handleCancel}
    //       message={`Are you sure you want to perform this action?`}
    //     />
    //   )}
    //   <Table className="w-full shadow-lg border border-gray-300 dark:border-gray-900 rounded-lg ">
    //     <TableHeader>
    //       <TableRow className="bg-primary-500 rounded-full  hover:bg-primary-500/90 dark:hover:bg-primary-600/90 dark:bg-primary-600 p-3">
    //         <TableHead className="text-center font-extrabold text-white">
    //           Sl.No
    //         </TableHead>
    //         {columns.map((column) => (
    //           <TableHead
    //             key={column.key.toString()}
    //             className="text-center font-extrabold text-white"
    //           >
    //             {column.header}
    //           </TableHead>
    //         ))}
    //         {onToggleAction && (
    //           <TableHead className="text-center font-extrabold text-white">
    //             Action
    //           </TableHead>
    //         )}
    //         <TableHead className="text-center"></TableHead>
    //       </TableRow>
    //     </TableHeader>

    //     <TableBody className="text-[16px]">
    //       {localData?.map((item, index) => (
    //         <TableRow
    //           key={index}
    //           className={`cursor-pointer ${
    //             item?._id?.startsWith("67d4844c8f2468a") &&
    //             "dark:bg-gray-900 bg-gray-200 "
    //           } `}
    //           onClick={() => onViewMore?.(item._id)}
    //         >
    //           <TableCell className="text-center font-medium p-3">
    //             {index + 1}
    //           </TableCell>
    //           {columns.map((col) => (
    //             <TableCell key={col.key.toString()} className="text-center p-3">
    //               {col.render
    //                 ? col.render(item)
    //                 : String(item[col.key]).length > 32
    //                 ? String(item[col.key]).slice(0, 32) + "..."
    //                 : String(item[col.key]) == "General Community"
    //                 ? String(item[col.key]).toUpperCase() + " 🌟"
    //                 : String(item[col.key])}
    //             </TableCell>
    //           ))}

    //           {onToggleAction && toggleKey && (
    //             <TableCell className="text-center p-3">
    //               <Switch
    //                 checked={!!item[toggleKey]}
    //                 onCheckedChange={() => handleToggle(item)}
    //               />
    //             </TableCell>
    //           )}

    //           <TableCell className=" text-center">
    //             {handleEdit && (
    //               <button onClick={() => handleEdit(item._id)}>
    //                 <Pencil className="w-5 h-5 me-2 md:me-4 text-blue-500 hover:text-blue-700 cursor-pointer" />
    //               </button>
    //             )}
    //             {handleRemove && (
    //               <button onClick={() => handleRemove(item._id)}>
    //                 <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer" />
    //               </button>
    //             )}
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </div>
    <div className="w-full">
      {isConfirmationOpen && (
        <ConfirmationDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          message={`Are you sure you want to perform this action?`}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-900 shadow-lg">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-primary-500 dark:bg-primary-600 hover:bg-primary-500/90 dark:hover:bg-primary-600/90">
              <TableHead className="text-center font-extrabold text-white text-sm sm:text-base whitespace-nowrap p-2 sm:p-3">
                Sl.No
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.key.toString()}
                  className="text-center font-extrabold text-white text-sm sm:text-base whitespace-nowrap p-2 sm:p-3"
                >
                  {column.header}
                </TableHead>
              ))}
              {onToggleAction && (
                <TableHead className="text-center font-extrabold text-white text-sm sm:text-base whitespace-nowrap p-2 sm:p-3">
                  Action
                </TableHead>
              )}
              <TableHead className="text-center p-2 sm:p-3"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-sm sm:text-base">
            {localData?.map((item, index) => (
              <TableRow
                key={index}
                className={`cursor-pointer ${
                  item?._id?.startsWith("67d4844c8f2468a") &&
                  "dark:bg-gray-900 bg-gray-200"
                }`}
                // onClick={() => handleRowClick(item._id)}
                onClick={() => onViewMore?.(item._id)}
              >
                <TableCell className="text-center font-medium p-2 sm:p-3">
                  {index + 1}
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.key.toString()}
                    className="text-center p-2 sm:p-3 max-w-[150px] sm:max-w-none overflow-hidden text-ellipsis"
                  >
                    {col.render
                      ? col.render(item)
                      : String(item[col.key]).length > 32
                      ? String(item[col.key]).slice(0, 32) + "..."
                      : String(item[col.key]) == "General Community"
                      ? String(item[col.key]).toUpperCase() + " 🌟"
                      : String(item[col.key])}
                  </TableCell>
                ))}

                {onToggleAction && toggleKey && (
                  <TableCell className="text-center p-2 sm:p-3">
                    <div onClick={(e) => handleToggle(item)}>
                      <Switch
                        checked={!!item[toggleKey]}
                        // className="data-[state=checked]:bg-primary-500"
                      />
                    </div>
                  </TableCell>
                )}

                <TableCell className="text-center p-2 sm:p-3 whitespace-nowrap">
                  <div className="flex justify-center items-center gap-1 sm:gap-2">
                    {handleEdit && (
                      <button
                        onClick={(e) => handleEdit(item._id)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 hover:text-blue-700" />
                      </button>
                    )}
                    {handleRemove && (
                      <button
                        onClick={(e) => handleRemove(item._id)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 hover:text-red-700" />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const CustomTable = React.memo(CustomTableComponent) as <
  T extends { _id: string }
>(
  props: CustomTableProps<T>
) => JSX.Element;

export default CustomTable;
