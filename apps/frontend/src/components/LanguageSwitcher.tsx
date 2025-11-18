import { useTranslation } from 'react-i18next';
import { Select, MenuItem, FormControl } from '@mui/material';

const STORAGE_KEY = 'lang';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 80 }}>
      <Select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        variant="outlined"
        sx={{
          color: 'inherit',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        }}
      >
        <MenuItem value="en">EN</MenuItem>
        <MenuItem value="ru">RU</MenuItem>
      </Select>
    </FormControl>
  );
};

