export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-3">
            para<span className="text-sky-300">MOT</span>
          </h3>
          <p className="text-sky-200">Professional paragliding servicing and repairs</p>
        </div>
        <div className="border-t border-sky-700/50 pt-6">
          <p className="text-sky-300/80">
            &copy; {new Date().getFullYear()} paraMOT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
