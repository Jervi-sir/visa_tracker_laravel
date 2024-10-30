export const formatDateTime = (dateString, locale = 'en') => {
  if(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  }

  return null;
};

export const formatSubscriptionDate = (dateString, locale = 'en') => {
  if(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour12: false,
    }).format(date);
  }

  return null;
}