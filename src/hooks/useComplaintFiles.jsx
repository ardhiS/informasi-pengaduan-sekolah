// FUNGSI : Hook ini dibuat untuk mengelola file upload pada form pengaduan secara modular dan reusable

// Cara penggunaan (digunakan di ComplaintForm.jsx) :
// const { selectedFiles, handleFileChange, setSelectedFiles } = useComplaintFiles();

import { useState } from "react";

export default function useComplaintFiles() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  return { selectedFiles, handleFileChange, setSelectedFiles };
}
