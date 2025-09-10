import { Wrench, Shield, Zap, PackageCheck, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const services = [
  {
    icon: Shield,
    title: "Paragliding Servicing",
    description:
      "Complete servicing including canopy fabric inspection and strength testing, line strength analysis, riser state evaluation, and paraglider trimming.",
    code: "SVC-001",
    available: true,
  },
  {
    icon: Zap,
    title: "Paraglider Trimming",
    description:
      "Precision trimming services to optimize your wing's performance using professional tension meters and line geometry analysis.",
    code: "TRIM-001",
    available: true,
  },
  {
    icon: PackageCheck,
    title: "Parachute Repacking",
    description:
      "Professional emergency parachute repacking following manufacturer specifications and safety protocols.",
    code: "PACK-001",
    available: true,
  },
  {
    icon: Wrench,
    title: "Glider Repair",
    description:
      "Comprehensive repair services for paraglider canopies and components. Currently developing advanced sewing capabilities.",
    code: "REP-001",
    available: false,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="py-20 px-4 bg-gradient-to-b from-white to-sky-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-sky-900">Our Services</h2>
          <p className="text-sky-700 max-w-3xl mx-auto text-lg leading-relaxed">
            Professional paragliding equipment services with meticulous
            attention to safety and performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`bg-white border-sky-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                !service.available ? "opacity-75" : ""
              }`}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner relative">
                  <service.icon className="w-8 h-8 text-sky-600" />
                  {!service.available && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-sky-900">
                  {service.title}
                </CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-mono text-sky-500 bg-sky-50 px-2 py-1 rounded-full">
                    {service.code}
                  </span>
                  {!service.available && (
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sky-700 leading-relaxed text-center">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
