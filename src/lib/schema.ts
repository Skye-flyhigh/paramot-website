// Database Schema Design for paraMOT Customer & Service Management
// This schema supports the business model: customers own gliders, book services, track history

// TODO(human): Design the complete database schema structure here
// Consider these relationships:
// - Customer (from OAuth) has many Gliders
// - Customer has many ServiceRecords  
// - Glider has many ServiceRecords
// - Service defines types (SVC-001, TRIM-001, etc.) with pricing/details
// - ServiceRecord connects Customer + Glider + Service + booking details
import prices from "@/data/prices.json"

// Example structure to get you started:
export interface Customer {
  id: string           // OAuth email or generated ID
  email: string        // from OAuth
  name: string         // from OAuth  
  phone?: string       // optional contact info
  address?: string     // for service collection/delivery
  createdAt: Date
    updatedAt: Date
    serviceHistory: ServiceRecords[]
}

export const SERVICE_TYPES = ["SVC-001", "TRIM-001", "PACK-001", "REP-001"] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number]

export interface ServiceRecords { //This schema could be used for a glider, a reserve parachute or a harness
    service: ServiceType
    type: string
    id: string               // Start with SERVICE_TYPE + unique time ref. This ID will be able to generate a report on the workbench side like opening a new record.
    serialNb: string         // Get the unique serial number of the kit 
    manufacturer: string     // Could be linked to workbench database
    model: string            // Could be linked to workbench database
    size: string             // Could be linked to workbench database
    status: string
    cost: number             // in £
    createdAt: Date
    updatedAt?: Date
}

// Service data (line trim, parachute repack, etc.) would come from the workbench side of the business.
// export interface GliderService {
//     serviceId: string   // That unique identifier that is generated at the creation of a new order
//     serialNb: string
//     createdAt: Date
//     updatedAt: Date
//     trimService: TrimService
//     canopyService?: CanopyService
//     lineInspection?: LineInspection
// }

// Workbench integration interfaces - these connect to your Electron app's Prisma data
export interface WorkbenchInspectionSession {
    id: number                 // Links to workbench InspectionSession.id
    gliderModel: string        // From workbench GliderModel
    gliderSize: string         // From workbench GliderSize  
    date: Date
    technician: string
    validationType: string     // APPI, SAFETY, CUSTOM
    status: string             // PASS, FAIL, WARNING
    groupAnalyses: GroupAnalysis[]
    lineMeasurements: LineMeasurement[]
}

export interface GroupAnalysis {
    groupLabel: string         // G1A, G2B, STA etc
    result: string             // pass/fail/notes
    correction?: string        // suggested correction
    details?: string           // JSON or text for extra info
}

export interface LineMeasurement {
    physicalLineLabel: string  // A7, B3 etc
    measuredLength: number
    position: number           // 1-13 etc
}

// This bridges customer-facing service records with workbench technical data
export interface DetailedServiceRecord extends ServiceRecords {
    workbenchSessionId?: number    // Links to workbench InspectionSession
    inspectionData?: WorkbenchInspectionSession
}

// Equipment registry (what the customer owns)
export interface Equipment {
    id: string                 // Unique equipment ID
    customerId: string         // Links to Customer
    type: "glider" | "reserve" | "harness"
    serialNumber: string
    manufacturer: string
    model: string
    size: string
    purchaseDate?: Date
    lastServiceDate?: Date
    nextServiceDue?: Date
    status: "active" | "retired" | "service_required"
    createdAt: Date
    updatedAt: Date
}

// Pricing lookup helper
export function getServicePrice(serviceType: ServiceType): string | number {
    return prices[serviceType] || "Contact us"
}