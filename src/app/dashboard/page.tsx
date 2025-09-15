import { auth } from "@/auth"
import { Customer } from "@/lib/schema"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getCustomerEquipment, getUpcomingServices, getCompletedServices, mockServiceHistory } from "@/lib/mockData"
import ServiceHistoryTable from "@/components/ServiceHistoryTable"

export default async function Dashboard() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Get all data from centralized source
  const equipmentList = getCustomerEquipment()
  const upcomingServices = getUpcomingServices()
  const completedServices = getCompletedServices()
  
  const customerData: Customer = {
    id: session.user.id || "1234",
    name: session.user.name || "John",
    email: session.user.email || "john@email.com",
    phone: "",
    address: "",
    createdAt: new Date("20/08/2025"),
    updatedAt: new Date(),
    serviceHistory: mockServiceHistory
  }


  return (
    <div className="min-h-screen bg-sky-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-sky-900">
                Welcome back, {customerData.name}
              </h1>
              <p className="text-sky-600 mt-1">Customer Portal</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-sky-600">Customer ID</p>
              <p className="font-mono text-sky-800">{customerData.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6">
            <div className="flex items-center">
              <div className="bg-sky-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-sky-900">{completedServices.length}</p>
                <p className="text-sky-600">Services Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6">
            <div className="flex items-center">
              <div className="bg-sky-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-sky-900">{Object.keys(equipmentList).length}</p>
                <p className="text-sky-600">Active Gliders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-green-700">{upcomingServices.length}</p>
                <p className="text-sky-600">Upcoming Services</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Services */}
          <div className="bg-white rounded-lg shadow-sm border border-sky-200">
            <div className="p-6 border-b border-sky-100">
              <h2 className="text-xl font-bold text-sky-900">Upcoming Services</h2>
            </div>
            <div className="p-6">
              {upcomingServices.length > 0 ? (
                <div className="space-y-4">
                  {upcomingServices.map((service) => (
                    <div key={service.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <Link href={`/dashboard/${service.serialNb}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-sky-900">{service.type}</h3>
                            <p className="text-sky-600">{service.manufacturer} {service.model} {service.size}</p>
                          <p className="text-sm text-sky-500 mt-1">Service ID: {service.id}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {service.status}
                          </span>
                          {/* <p className="text-sm text-sky-600 mt-1">{service.scheduledDate}</p> */}
                        </div>
                      </div></Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sky-600 text-center py-8">No upcoming services scheduled</p>
              )}
            </div>
          </div>

          {/* Active Gliders */}
          <div className="bg-white rounded-lg shadow-sm border border-sky-200">
            <div className="p-6 border-b border-sky-100">
              <h2 className="text-xl font-bold text-sky-900">Your Equipment</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {Object.values(equipmentList).map((equipment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-sky-100 rounded-lg p-2">
                        <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 11V9a1 1 0 011-1h8a1 1 0 011 1v6M7 15l5-3 5 3" />
                        </svg>
                      </div>
                      <span className="ml-3 font-medium text-sky-900">{equipment.manufacturer} {equipment.model} {equipment.size}</span>
                    </div>
                    <Link 
                        href={`/dashboard/${equipment.serialNb}`}
                        className="text-sky-600 hover:text-sky-800 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Service History */}

            <ServiceHistoryTable serviceHistory={mockServiceHistory} />
          </div>
    </div>
  )
}