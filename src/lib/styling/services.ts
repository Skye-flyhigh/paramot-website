  export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  export const getServiceDescription = (serviceType: string) => {
    switch (serviceType) {
      case 'SVC-001':
        return 'Complete annual service including line inspection, canopy check, and trim verification'
      case 'TRIM-001':
        return 'Line length verification and trim adjustment for optimal glider performance'
      case 'PACK-001':
        return 'Reserve parachute inspection and repacking according to manufacturer guidelines'
      case 'REP-001':
        return 'Repair services for glider damage including fabric and line replacement'
      default:
        return 'Professional paragliding equipment service'
    }
  }