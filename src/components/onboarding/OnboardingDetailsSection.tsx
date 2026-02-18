export default function OnboardingDetailsSection() {
  return (
    <section className="mb-8 p-6 bg-sky-50 rounded-lg border border-sky-200">
      <h2 className="text-xl font-semibold text-sky-900 mb-3">What to Expect</h2>
      <ul className="space-y-2 text-sky-700">
        <li className="flex items-start">
          <span className="mr-2">✓</span>
          <span>Track your equipment service history</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">✓</span>
          <span>Book services online with just a few clicks</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">✓</span>
          <span>Receive updates and notifications about your equipment</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">✓</span>
          <span>Access detailed service reports and recommendations</span>
        </li>
      </ul>
    </section>
  );
}
