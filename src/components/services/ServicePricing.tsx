interface ServicePricingProps {
  pricing: {
    solo?: number;
    tandem?: number;
    regular?: number;
    steerable?: number;
    available: boolean;
  };
}

export default function ServicePricing({ pricing }: ServicePricingProps) {
  const hasPrices =
    pricing.solo !== undefined ||
    pricing.tandem !== undefined ||
    pricing.regular !== undefined ||
    pricing.steerable !== undefined;

  if (!hasPrices) {
    return <span className="text-lg font-bold text-sky-900">Contact us</span>;
  }

  return (
    <div className="space-y-2 text-center">
      {/* Solo / Tandem pricing */}
      {pricing.solo !== undefined && (
        <div>
          <span className="text-2xl font-bold text-sky-900">£{pricing.solo}</span>
          {pricing.tandem !== undefined && (
            <span className="ml-1 text-sm text-sky-500">solo</span>
          )}
        </div>
      )}
      {pricing.tandem !== undefined && (
        <div>
          <span className="text-2xl font-bold text-sky-900">£{pricing.tandem}</span>
          <span className="ml-1 text-sm text-sky-500">tandem</span>
        </div>
      )}

      {/* Regular / Steerable pricing (reserves) */}
      {pricing.regular !== undefined && (
        <div>
          <span className="text-2xl font-bold text-sky-900">£{pricing.regular}</span>
          {pricing.steerable !== undefined && (
            <span className="ml-1 text-sm text-sky-500">standard</span>
          )}
        </div>
      )}
      {pricing.steerable !== undefined && (
        <div>
          <span className="text-2xl font-bold text-sky-900">£{pricing.steerable}</span>
          <span className="ml-1 text-sm text-sky-500">steerable</span>
        </div>
      )}
    </div>
  );
}
