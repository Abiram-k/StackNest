import { ChevronLeft, Plane, Download, Smile, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
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
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useGetUserEngagement } from "@/hooks/admin/dashboard/useGetUserEngagement";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedRange, setSelectedRange] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
    { month: "July", desktop: 24 },
    { month: "August", desktop: 144 },
    { month: "September", desktop: 223 },
    { month: "October", desktop: 102 },
    { month: "November", desktop: 355 },
    { month: "December", desktop: 345 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  };

  const { data: userEngagementData, isPending: fetchingUserEngagement } =
    useGetUserEngagement(selectedYear);

  console.log("userEngagementData: ", userEngagementData);
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
                <h2 className="text-lg font-semibold mb-1">Sales overview</h2>
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
                      data={chartData}
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
                      <XAxis dataKey="desktop" type="number" hide />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent indicator="line" color="#fff" />
                        }
                      />
                      <Bar
                        dataKey="desktop"
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
                          className=" fill-white"
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
                  <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
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

          <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-gray-900 border">
              <h3 className="text-gray-500 mb-2">Total sales</h3>
              <p className="text-3xl font-bold">3033</p>
            </div>

            {/* Data Reports */}
            <div className="bg-white p-6 rounded-lg dark:bg-gray-900 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold border-b-2 border-gray-900 pb-1">
                  Data Reports
                </h3>
                <ChevronLeft className="h-5 w-5 text-blue-600" />
              </div>
              <p className="mb-4 font-medium">Sales Reports:</p>
              <div className="flex space-x-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Pdf
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
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

// Custom tooltip component for the engagement chart
function CustomEngagementTooltip() {
  return (
    <div className="bg-white p-3 rounded-md shadow-md border">
      <div className="flex items-center">
        <div className="p-2 bg-blue-100 rounded-full mr-2">
          <Smile className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="font-bold">20 new users</p>
          <p className="text-xs text-gray-500">Monday, April 22nd</p>
        </div>
      </div>
    </div>
  );
}
