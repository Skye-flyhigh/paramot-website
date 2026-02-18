import { X } from 'lucide-react';

export default function XButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="text-gray-400 bg-white p-1 rounded-full hover:bg-sky-100 hover:text-sky-600 transition-all"
    >
      <X size={24} />
    </button>
  );
}
