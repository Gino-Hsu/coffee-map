// 為「只為副作用」的樣式匯入（例如 import './globals.css'）補上模組宣告。
// Next 16 的內建型別未提供全域 CSS 的宣告，缺這個會出現：
// 「找不到 './globals.css' 副作用匯入的模組或類型宣告」。
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
