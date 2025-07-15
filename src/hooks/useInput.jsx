import { useState } from "react";

/**
 * CUSTOM HOOK: useInput
 *
 * Fungsi: Mengelola state input form dengan mudah
 *
 * Kegunaan:
 * - Mengurangi duplikasi kode untuk input form
 * - Menyederhanakan pengelolaan state input
 * - Dapat digunakan untuk semua jenis input (text, email, password, dll)
 *
 * Cara Pakai:
 * const [nama, onNamaChange] = useInput(''); // untuk input nama
 * const [email, onEmailChange] = useInput(''); // untuk input email
 *
 * Kemudian di JSX:
 * <input value={nama} onChange={onNamaChange} />
 */

function useInput(defaultValue = "") {
  // State untuk menyimpan nilai input
  const [value, setValue] = useState(defaultValue);

  // Handler untuk mengubah nilai saat user mengetik
  const onValueChangeHandler = (event) => {
    setValue(event.target.value);
  };

  // Return array: [nilai_saat_ini, fungsi_untuk_mengubah_nilai]
  return [value, onValueChangeHandler];
}

export default useInput;
