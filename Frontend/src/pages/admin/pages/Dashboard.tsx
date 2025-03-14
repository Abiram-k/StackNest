import { ChevronLeft, Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Sample data for the charts
  const monthlyData = [
    { month: "Jan", value: 35 },
    { month: "Feb", value: 65 },
    { month: "Mar", value: 45 },
    { month: "Apr", value: 75 },
    { month: "May", value: 60 },
    { month: "Jun", value: 55 },
    { month: "Jul", value: 40 },
  ];

  const weeklySpending = [
    { day: 10, value: 25 },
    { day: 11, value: 35 },
    { day: 12, value: 50 },
    { day: 13, value: 30 },
    { day: 14, value: 40 },
  ];

  return (
    <div className="flex h-screen dark:bg-black">
      {/* Main Content */}
      <div className="flex-1 o p-8 ">
        <h1 className="text-2xl font-bold mb-8 border-0 text-center md:text-start md:ms-10">
          Analytics Overview
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Users Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64">
                <div className="flex items-end justify-between h-48 mt-4">
                  {monthlyData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative">
                        <div
                          className="w-12 bg-blue-600 rounded-t-sm"
                          style={{ height: `${item.value * 2}px` }}
                        ></div>
                        {index === 3 && (
                          <div className="absolute -top-16 -right-20 bg-white p-2 rounded-lg shadow-md border border-gray-200 w-40">
                            <div className="flex items-center mb-1">
                              <div className="bg-blue-100 p-2 rounded-full mr-2">
                                <div className="text-blue-600 text-xl">😀</div>
                              </div>
                              <div>
                                <div className="font-bold">20 new users</div>
                                <div className="text-xs text-gray-500">
                                  Monday, April 22nd
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="text-3xl font-bold">30%</div>
                  <div className="text-sm text-gray-500">
                    Around 30% of users Joined
                    <br />
                    compare to last month
                  </div>
                </div>

                <div className="mt-4">
                  <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                    Details
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Plane className="text-blue-600 w-5 h-5" />
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm">
                  Your Weekly average is{" "}
                  <span className="text-blue-600 font-bold">$100</span>
                </div>
              </div>

              <div className="h-48">
                <div className="flex justify-between items-end h-32">
                  {weeklySpending.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 rounded-t-sm ${
                          index === 4 ? "bg-orange-400" : "bg-blue-600"
                        }`}
                        style={{ height: `${item.value * 2}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-right text-sm text-blue-600 mt-2">
                  Today: High spending
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                  Details
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-gray-500">Total Users</div>
                <div className="text-4xl font-bold mt-2">4353</div>
              </div>

              <div className="flex justify-end">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full px-8 py-6 flex flex-col items-center justify-center">
                  <div className="text-sm">Premium Users</div>
                  <div className="text-2xl font-bold">1033</div>
                </div>
              </div>

              <div>
                <div className="text-purple-600">Rooms</div>
                <div className="text-4xl font-bold text-purple-800 mt-2">
                  2,500
                </div>
              </div>

              <div>
                <div className="text-gray-500">Total sales</div>
                <div className="text-4xl font-bold mt-2">3033</div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl border-b-2 border-black pb-1">
                Data Reports
              </CardTitle>
              <ChevronLeft className="text-blue-600" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="font-medium">Sales Reports:</div>
              </div>
              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-md px-8">
                  Pdf
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-md px-8">
                  Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
