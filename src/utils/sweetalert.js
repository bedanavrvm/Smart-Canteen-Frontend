import Swal from 'sweetalert2'

/**
 * Confirmation dialog for destructive actions
 * @param {string} title - Dialog title
 * @param {string} text - Dialog message
 * @param {string} confirmText - Confirm button text
 * @returns {Promise<boolean>} - true if confirmed, false if cancelled
 */
export async function confirmAction(
  title = 'Are you sure?',
  text = 'This action cannot be undone.',
  confirmText = 'Yes, proceed'
) {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true
  })
  
  return result.isConfirmed
}

/**
 * Delete confirmation dialog
 * @param {string} itemName - Name of the item being deleted
 * @returns {Promise<boolean>}
 */
export async function confirmDelete(itemName = 'this item') {
  return confirmAction(
    'Delete Item?',
    `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
    'Yes, delete it'
  )
}

/**
 * Success modal with auto-close
 * @param {string} title - Success message
 * @param {string} text - Additional details
 */
export function showSuccess(title = 'Success!', text = '') {
  Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false
  })
}

/**
 * Error modal
 * @param {string} title - Error message
 * @param {string} text - Error details
 */
export function showError(title = 'Error!', text = 'Something went wrong.') {
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#10b981'
  })
}

/**
 * Info modal
 * @param {string} title - Info message
 * @param {string} text - Additional details
 */
export function showInfo(title = 'Information', text = '') {
  Swal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonColor: '#10b981'
  })
}
