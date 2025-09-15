import { notFound } from "next/navigation"
import Link from "next/link"
import { getEquipmentBySerial, getServiceById } from "@/lib/mockData"
import ServiceHistoryTable from "@/components/ServiceHistoryTable"
import { ServiceRecords } from "@/lib/schema"
import { getServiceDescription, getStatusColor } from "@/lib/styling/services"

interface ServiceDetailPageProps {
  params: { slug: string }
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  // Find the service record by ID
    const equipment = getEquipmentBySerial(params.slug)

  if (!equipment) {
    notFound()
  }
    
    const lastService = getServiceById(equipment.serviceHistory[0])
    const serviceHistory: ServiceRecords[] = equipment.serviceHistory
      .map(id => getServiceById(id))
      .filter((service): service is ServiceRecords => service !== undefined)
    if (!lastService) {
      notFound()
    }

  return (
    <div className="min-h-screen bg-sky-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="text-sky-600 hover:text-sky-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-sky-200 p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-sky-900 mb-2">
                Inspection: <span className="text-sky-600">{equipment.manufacturer} {equipment.model} ({equipment.size})</span>
                          </h1>
                          <p>Last service: {equipment.serviceHistory[0]}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lastService.status)}`}>
                {lastService.status}
              </span>
              <p className="text-2xl font-bold text-sky-900 mt-2">
                £{lastService.cost}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Service Information */}
            <div className="bg-white rounded-lg shadow-sm border border-sky-200">
              <div className="p-6 border-b border-sky-100">
                <h2 className="text-xl font-bold text-sky-900">Service Details</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sky-900 mb-2">Service Description</h3>
                    <p className="text-sky-700">{getServiceDescription(lastService.service)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-sky-600 font-medium">Service Code</p>
                      <p className="text-sky-900">{lastService.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-sky-600 font-medium">Service ID</p>
                      <p className="text-sky-900 font-mono text-sm">{lastService.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-sky-200">
              <div className="p-6 border-b border-sky-100">
                <h2 className="text-xl font-bold text-sky-900">Timeline</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-sky-100 rounded-full p-2 mr-4 mt-1">
                      <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sky-900">Service Created</p>
                      <p className="text-sky-600 text-sm">{lastService.createdAt.toDateString()}</p>
                    </div>
                  </div>

                  {lastService.updatedAt && (
                    <div className="flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-sky-900">Service {lastService.status}</p>
                        <p className="text-sky-600 text-sm">{lastService.updatedAt.toDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Equipment Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-sky-200">
              <div className="p-6 border-b border-sky-100">
                <h2 className="text-xl font-bold text-sky-900">Equipment</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-sky-600 font-medium">Manufacturer</p>
                    <p className="text-sky-900">{equipment.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sky-600 font-medium">Model</p>
                    <p className="text-sky-900">{equipment.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sky-600 font-medium">Size</p>
                    <p className="text-sky-900">{equipment.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sky-600 font-medium">Serial Number</p>
                    <p className="text-sky-900 font-mono text-sm">{equipment.serialNb}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-sky-200">
              <div className="p-6 border-b border-sky-100">
                <h2 className="text-xl font-bold text-sky-900">Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {lastService.status === 'Completed' && (
                    <button className="w-full bg-sky-600 text-white py-2 px-4 rounded hover:bg-sky-700 transition-colors">
                      Download Service Report
                    </button>
                  )}
                  {lastService.status === 'Scheduled' && (
                    <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors">
                      Modify Booking
                    </button>
                  )}
                  <button className="w-full border border-sky-300 text-sky-700 py-2 px-4 rounded hover:bg-sky-50 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
                  </div>

                  {/* Service History */}

                  <div className="col-span-3">
                    
                  <ServiceHistoryTable serviceHistory={serviceHistory} />
                  </div>

        </div>
      </div>
    </div>
  )
}