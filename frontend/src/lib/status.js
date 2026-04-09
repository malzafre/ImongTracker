export const statuses = ['Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

export const statusStyles = {
  Wishlist: { accent: '#6b7280', soft: 'rgba(107, 114, 128, 0.14)' },
  Applied: { accent: '#2d7a4d', soft: 'rgba(45, 122, 77, 0.14)' },
  Screening: { accent: '#0f766e', soft: 'rgba(15, 118, 110, 0.14)' },
  Interview: { accent: '#b45309', soft: 'rgba(180, 83, 9, 0.14)' },
  Offer: { accent: '#15803d', soft: 'rgba(21, 128, 61, 0.15)' },
  Rejected: { accent: '#b91c1c', soft: 'rgba(185, 28, 28, 0.14)' },
};

export const getStatusStyle = (status) => {
  return statusStyles[status] ?? statusStyles.Applied;
};
