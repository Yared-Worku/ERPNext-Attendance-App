
import i18n from '../../locales/i18n';

export const formatDisplayTime = (dateString: string | Date) => {
  const date = new Date(dateString);
  const currentLang = i18n.language;

  // Uses Ethiopian locale string ('am-ET') only when Amharic is selected
  return date.toLocaleTimeString(currentLang === 'am' ? 'am-ET' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};