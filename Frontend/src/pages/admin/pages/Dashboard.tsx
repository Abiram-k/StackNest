import { ChevronLeft, Download,  TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  RadialBarChart,
  PolarGrid,
  RadialBar,
  PolarRadiusAxis,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState } from "react";
import { useGetUserEngagement } from "@/hooks/admin/dashboard/useGetUserEngagement";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGetSalesDetails } from "@/hooks/admin/dashboard/useGetSalesDetails";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
type reportDataType = {
  userName: string;
  amount: number;
  planName: string;
  purchasedAt: string;
  endedAt: string;
}[];
export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedRange, setSelectedRange] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() || 0
  );
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  };

  const { data: userEngagementData } =
    useGetUserEngagement(selectedYear);

  const { data: salesDetailsData } =
    useGetSalesDetails(selectedRange, monthNames[selectedMonth]);

  const radialChartData = [
    {
      name: "Total Sales",
      value: salesDetailsData?.totalSales ?? 0,
      fill: "#3b82f6",
    },
  ];
  const downloadSalesReportExcel = (reportData: reportDataType) => {
    const worksheetData = reportData.map((item) => ({
      Username: item.userName,
      Plan: item.planName,
      Amount: item.amount,
      "Purchased At": item.purchasedAt,
      "Ended At": item.endedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    XLSX.writeFile(workbook, "sales_report.xlsx");
  };
  const downloadSalesReportPDF = (reportData: reportDataType) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Sales Report", 14, 22);

    const tableColumn = [
      "Username",
      "Plan",
      "Amount (₹)",
      "Purchased At",
      "Ended At",
    ];

    const tableRows = reportData.map((item) => [
      item.userName,
      item.planName,
      `₹${item.amount}`,
      item.purchasedAt,
      item.endedAt,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    doc.save("sales_report.pdf");
  };
  return (
    <div className="flex h-screen  my-30">
      
      <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Analytics Overview</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Users Engagement Chart */}
            <div className=" p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Users Engagement</h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedYear((prev: number) => prev - 1)}
                    disabled={selectedYear <= 2025}
                    className="p-1.5 hover:bg-gray-100  dark:hover:bg-gray-800  rounded-full transition-colors"
                    aria-label="Previous year"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>

                  <span className="w-20 text-center font-medium">
                    {selectedYear}
                  </span>

                  <button
                    onClick={() => setSelectedYear((prev: number) => prev + 1)}
                    className="p-1.5 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800 transition-colors"
                    aria-label="Next year"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              <Card className="border-0 ">
                <CardHeader>
                  {/* <CardTitle>Bar Chart</CardTitle> */}
                  <CardDescription>
                    January - December {selectedYear}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart
                      accessibilityLayer
                      data={userEngagementData?.userEngagement}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="userCount" fill="#1E90FF" radius={8} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  {userEngagementData?.thisMonthPercentage ? (
                    <div className="flex gap-2 font-medium leading-none">
                      Growth up to{" "}
                      <span
                        className={
                          userEngagementData.thisMonthPercentage > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {userEngagementData.thisMonthPercentage}%
                      </span>
                      this month compare to previous month
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  ) : (
                    <p>No data available</p>
                  )}
                  <div className="leading-none text-muted-foreground">
                    Showing total users joined on each month
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="p-6 rounded-lg shadow-sm h-fit border">
              <div className="w-full flex justify-between items-end mb-4">
                <h2 className="text-lg font-semibold mb-1">
                  Premium sales overview
                </h2>
                <ToggleGroup
                  type="single"
                  value={selectedRange}
                  onValueChange={(value) =>
                    setSelectedRange(value as "monthly" | "yearly")
                  }
                  className="gap-2"
                >
                  <ToggleGroupItem
                    value="monthly"
                    aria-label="Toggle monthly"
                    className="data-[state=on]:bg-blue-500 data-[state=on]:text-white px-4 py-2"
                  >
                    Monthly
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="yearly"
                    aria-label="Toggle yearly"
                    className="data-[state=on]:bg-blue-500 data-[state=on]:text-white px-4 py-2"
                  >
                    Yearly
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              {selectedRange == "monthly" && (
                <div className="flex items-center gap-2 mb-3 ">
                  <button
                    onClick={() => setSelectedMonth((prev: number) => prev - 1)}
                    disabled={selectedMonth <= 0}
                    className="p-1.5 hover:bg-gray-100  dark:hover:bg-gray-800  rounded-full transition-colors"
                    aria-label="Previous Month"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>

                  <span className="w-20 text-center font-medium">
                    {monthNames[selectedMonth]}
                  </span>

                  <button
                    onClick={() => setSelectedMonth((prev: number) => prev + 1)}
                    disabled={selectedMonth >= 11}
                    className="p-1.5 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800 transition-colors"
                    aria-label="Next year"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardDescription>
                    {selectedRange == "monthly"
                      ? "Monday - Sunday"
                      : "January - December"}{" "}
                    [ 2024 ]
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart
                      accessibilityLayer
                      data={salesDetailsData?.data}
                      layout="vertical"
                      margin={{
                        right: 16,
                      }}
                    >
                      <CartesianGrid horizontal={false} />
                      <YAxis
                        dataKey={selectedRange === "yearly" ? "month" : "week"}
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) =>
                          selectedRange === "yearly" ? value.slice(0, 3) : value
                        }
                        hide
                      />
                      <XAxis dataKey="totalSales" type="number" hide />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent indicator="line" color="#fff" />
                        }
                      />
                      <Bar
                        dataKey="totalSales"
                        layout="vertical"
                        fill="#1E90FF"
                        radius={4}
                      >
                        <LabelList
                          dataKey={
                            selectedRange === "yearly" ? "month" : "week"
                          }
                          position="insideLeft"
                          offset={8}
                          className=" #1E90FF"
                          fontSize={12}
                        />
                        <LabelList
                          dataKey="desktop"
                          position="right"
                          offset={8}
                          className="fill-foreground"
                          fontSize={12}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="leading-none text-muted-foreground">
                    Showing total sales from
                    {selectedRange == "monthly"
                      ? " Week 1 to Week 4"
                      : " Januray to December"}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border">
              <h3 className="text-gray-500 mb-2">Total Users</h3>
              <p className="text-3xl font-bold">
                {userEngagementData?.totalUsersCount}
              </p>
            </div>

            <div className="bg-white p-6 dark:bg-gray-900 rounded-lg shadow-sm border">
              <h3 className="text-gray-500 mb-2">Rooms</h3>
              <p className="text-3xl font-bold text-purple-700">
                {userEngagementData?.totalRoomsCount}
              </p>
            </div>

            <div className="bg-gradient-to-r  from-blue-600 to-indigo-700 p-6 rounded-lg shadow-sm text-white">
              <h3 className="mb-2">Premium Users</h3>
              <p className="text-3xl font-bold">
                {userEngagementData?.totalPremiumUserCount}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1  lg:grid-cols-2 gap-6 ">
            <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-900 border">
              <h3 className="text-gray-500 mb-2">Total sales</h3>

              <Card className="flex flex-col bg-transparent">
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <RadialBarChart
                      data={radialChartData}
                      startAngle={0}
                      endAngle={250}
                      innerRadius={80}
                      outerRadius={110}
                    >
                      <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[86, 74]}
                      />
                      <RadialBar dataKey="value" background cornerRadius={10} />
                      <PolarRadiusAxis
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-4xl font-bold"
                                  >
                                    ₹{salesDetailsData?.totalSales}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground"
                                  >
                                    Total Sales
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </PolarRadiusAxis>
                    </RadialBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Data Reports */}
            <div className="bg-white p-6 rounded-lg dark:bg-gray-900 shadow-sm border h-fit">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold border-b-2 border-gray-900 pb-1">
                  Sales Reports
                </h3>
                <ChevronLeft className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mb-4 font-medium">Download Sales Report: </p>
              <div className="flex space-x-4">
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  onClick={() =>
                    downloadSalesReportPDF(salesDetailsData?.salesInfo!)
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Pdf
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  onClick={() =>
                    downloadSalesReportExcel(salesDetailsData?.salesInfo!)
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
