"use client";

import { ServiceRecords } from "@/lib/schema";
import { useState } from "react";
import BookingModal from "./BookingModal";

export function DashboardCTA() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "modify";
    selectedService?: ServiceRecords;
  }>({
    isOpen: false,
    mode: "create",
  });

  const openModal = (mode: "create" | "modify", service?: ServiceRecords) => {
    setModalState({
      isOpen: true,
      mode,
      selectedService: service,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: "create",
    });
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => openModal("create")}
        className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      >
        Schedule New Service
      </button>
    </div>
  );
}
