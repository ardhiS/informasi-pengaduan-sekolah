// FUNGSI : Digunakan untuk menyimpan dan mengatur error validasi form serta status persetujuan user.
// Hook ini dibuat untuk form pengaduan secara modular dan reusable
// Cara penggunaan (digunakan di ComplaintForm.jsx) :
// const { formErrors, setFormErrors, agreement, setAgreement } = useComplaintFormState();

import { useState } from "react";

export default function useComplaintFormState() {
  const [formErrors, setFormErrors] = useState({});
  const [agreement, setAgreement] = useState(false);

  return { formErrors, setFormErrors, agreement, setAgreement };
}
