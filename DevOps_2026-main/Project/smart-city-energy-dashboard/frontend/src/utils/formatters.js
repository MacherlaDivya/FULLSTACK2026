const formatNumber = (value, options = {}) =>
  new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...options,
  }).format(Number(value || 0));

const formatCompact = (value) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

const toDateInputValue = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
};

const toDateTimeInputValue = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;
};

export { formatCompact, formatNumber, toDateInputValue, toDateTimeInputValue };
