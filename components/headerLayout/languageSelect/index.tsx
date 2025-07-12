'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';

const supportedLangs = ['zh', 'en', 'ja'];

function LanguageSelect() {
  const [language, setLanguage] = useState('zh');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentLang = pathname.split('/')[1];
    if (supportedLangs.includes(currentLang)) {
      setLanguage(currentLang);
    } else {
      setLanguage('zh');
    }
  }, [pathname]);

  const handleLangChange = (event: SelectChangeEvent) => {
    const newLang = event.target.value;

    // 將路徑切換語系
    const segments = pathname.split('/');
    segments[1] = newLang;
    const newPath = segments.join('/');

    console.log('切換語言:', newLang, '新路徑:', newPath);

    router.push(newPath);
  };

  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <Select
        name="language"
        id="languageSelect"
        value={language}
        onChange={handleLangChange}
      >
        <MenuItem value={'zh'}>繁體中文</MenuItem>
        <MenuItem value={'en'}>English</MenuItem>
        <MenuItem value={'ja'}>日本語</MenuItem>
      </Select>
    </FormControl>
  );
}

// 延後載入語言選單元件，避免初始 render 出錯破圖
const DynamicLanguageSelect = dynamic(() => Promise.resolve(LanguageSelect), {
  ssr: false,
});

export default DynamicLanguageSelect;
