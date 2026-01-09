export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getServiceDescription = (serviceType: string) => {
  switch (serviceType) {
    case 'SVC-001':
      return 'Line length verification and trim adjustment for solo paraglider';
    case 'SVC-002':
      return 'Line length verification and trim adjustment for tandem paraglider';
    case 'SVC-011':
      return 'Complete annual service for solo glider including line inspection, canopy check, and trim';
    case 'SVC-012':
      return 'Complete annual service for tandem glider including line inspection, canopy check, and trim';
    case 'PACK-001':
      return 'Solo reserve parachute inspection and repacking according to manufacturer guidelines';
    case 'PACK-002':
      return 'Steerable parachute inspection and repacking according to manufacturer guidelines';
    case 'REP-001':
      return 'Repair services for glider damage including fabric and line replacement';
    default:
      return 'Professional paragliding equipment service';
  }
};
