import { useState } from "react";

/**
 * Custom hook untuk mengelola state loading saat submit form
 *
 * Kegunaan:
 * - Otomatis mengelola loading state saat proses submit form
 * - Mencegah double submit dengan mengaktifkan loading state
 * - Memastikan loading state dimatikan setelah proses selesai
 *
 * Cara pakai:
 * const [loading, handleSubmit] = useFormSubmit();
 *
 * // Dalam event handler:
 * handleSubmit(async () => {
 *   // Proses submit form disini
 *   await submitToAPI(formData);
 * });
 *
 * // loading bisa digunakan untuk disable button dll
 * <button disabled={loading}>Submit</button>
 */

function useFormSubmit() {
  // State untuk tracking apakah form sedang loading
  const [loading, setLoading] = useState(false);

  // Fungsi untuk handle submit dengan loading state
  const handleSubmit = async (submitFunction) => {
    setLoading(true); // Set loading = true saat mulai submit
    try {
      await submitFunction(); // Jalankan fungsi submit yang diberikan
    } finally {
      setLoading(false); // Set loading = false setelah selesai (berhasil/gagal)
    }
  };

  // Return: [status_loading, fungsi_untuk_handle_submit]
  return [loading, handleSubmit];
}

export default useFormSubmit;
