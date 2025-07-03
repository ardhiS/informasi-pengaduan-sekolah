import React from 'react';
import { X } from 'lucide-react';

const ComplaintsFormModal = ({
  showModal,
  isDarkMode,
  t,
  editingComplaint,
  resetForm,
  handleSubmit,
  formData,
  setFormData,
  categories,
  priorities,
  reporterTypes,
  handleImageChange,
  imagePreviewUrls,
  removeImage,
  selectedImages,
  user,
  statuses,
}) => {
  if (!showModal) return null;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4'>
      <div
        className={`relative rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className='p-4 sm:p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3
              className={`text-lg font-medium ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}
            >
              {editingComplaint
                ? t('editComplaint', 'Edit Pengaduan')
                : t('createNewComplaint', 'Buat Pengaduan Baru')}
            </h3>
            <button
              onClick={resetForm}
              className={
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-400 hover:text-gray-600'
              }
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Basic Info */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='sm:col-span-2'>
                <label className='label text-xs sm:text-sm'>
                  Judul Pengaduan
                </label>
                <input
                  type='text'
                  required
                  className='input-field text-sm'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='Masukkan judul pengaduan'
                />
              </div>

              <div>
                <label className='label text-xs sm:text-sm'>Kategori</label>
                <select
                  required
                  className='input-field text-sm'
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  <option value=''>Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='label text-xs sm:text-sm'>Prioritas</label>
                <select
                  className='input-field text-sm'
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='sm:col-span-2'>
                <label className='label text-xs sm:text-sm'>Deskripsi</label>
                <textarea
                  required
                  className='input-field text-sm'
                  rows='4'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder='Jelaskan detail pengaduan Anda'
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className='label text-xs sm:text-sm'>
                  Gambar Pendukung (Opsional)
                </label>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={handleImageChange}
                  className='input-field text-sm'
                />
                <p className='text-xs text-gray-500 mt-1'>
                  Maksimal 5 gambar, ukuran masing-masing maksimal 5MB
                </p>

                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className='mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2'>
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className='relative'>
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className='w-full h-20 object-cover rounded border'
                        />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Info */}
            <div className='border-t pt-4'>
              <h4 className='text-sm font-medium text-gray-900 mb-3'>
                Informasi Pelapor
              </h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='label text-xs sm:text-sm'>
                    Nama Lengkap
                  </label>
                  <input
                    type='text'
                    required
                    className='input-field text-sm'
                    value={formData.reporter_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reporter_name: e.target.value,
                      })
                    }
                    placeholder='Nama lengkap pelapor'
                  />
                </div>

                <div>
                  <label className='label text-xs sm:text-sm'>
                    Tipe Pelapor
                  </label>
                  <select
                    required
                    className='input-field text-sm'
                    value={formData.reporter_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reporter_type: e.target.value,
                      })
                    }
                  >
                    {reporterTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='label text-xs sm:text-sm'>Email</label>
                  <input
                    type='email'
                    className='input-field text-sm'
                    value={formData.reporter_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reporter_email: e.target.value,
                      })
                    }
                    placeholder='email@example.com'
                  />
                </div>

                <div>
                  <label className='label text-xs sm:text-sm'>
                    No. Telepon
                  </label>
                  <input
                    type='tel'
                    className='input-field text-sm'
                    value={formData.reporter_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reporter_phone: e.target.value,
                      })
                    }
                    placeholder='08xxxxxxxxxx'
                  />
                </div>

                {formData.reporter_type === 'siswa' && (
                  <div className='sm:col-span-2'>
                    <label className='label text-xs sm:text-sm'>Kelas</label>
                    <input
                      type='text'
                      className='input-field text-sm'
                      value={formData.reporter_class}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reporter_class: e.target.value,
                        })
                      }
                      placeholder='contoh: VII-A, VIII-B'
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Admin Fields (untuk edit) */}
            {editingComplaint && user?.role === 'admin' && (
              <div className='border-t pt-4'>
                <h4 className='text-sm font-medium text-gray-900 mb-3'>
                  Tindak Lanjut Admin
                </h4>
                <div className='space-y-4'>
                  <div>
                    <label className='label text-xs sm:text-sm'>Status</label>
                    <select
                      className='input-field text-sm'
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='label text-xs sm:text-sm'>
                      Catatan Admin
                    </label>
                    <textarea
                      className='input-field text-sm'
                      rows='3'
                      value={formData.admin_notes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          admin_notes: e.target.value,
                        })
                      }
                      placeholder='Catatan tindak lanjut dari admin'
                    />
                  </div>

                  {(formData.status === 'resolved' ||
                    formData.status === 'closed') && (
                    <div>
                      <label className='label text-xs sm:text-sm'>
                        Solusi/Penyelesaian
                      </label>
                      <textarea
                        className='input-field text-sm'
                        rows='3'
                        value={formData.resolution}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            resolution: e.target.value,
                          })
                        }
                        placeholder='Jelaskan solusi yang diberikan'
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex flex-col xs:flex-row gap-3 xs:gap-3 xs:justify-end pt-4'>
              <button
                type='button'
                onClick={resetForm}
                className='btn-secondary w-full xs:w-auto justify-center'
              >
                {t('cancel', 'Batal')}
              </button>
              <button
                type='submit'
                className='btn-primary w-full xs:w-auto justify-center'
              >
                {editingComplaint
                  ? t('updateComplaint', 'Update Pengaduan')
                  : t('submitComplaint', 'Kirim Pengaduan')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsFormModal;
