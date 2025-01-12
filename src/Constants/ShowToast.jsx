import { toast } from 'react-toastify';

// Fungsi untuk menampilkan pesan toast
export const showToast = (message, type = 'info') => {
  switch(type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast.warn(message);
      break;
    case 'info':
    default:
      toast.info(message);
      break;
  }
};
