// 重置 MUI 樣式
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.87)', // 取消藍色邊框
            borderWidth: '1px', // 預設是 2px，這裡改回 1px 或你要的值
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // 聚焦時的 label 顏色
          '&.Mui-focused': {
            color: 'rgba(0, 0, 0, 0.87)', // 預設黑灰色，你也可以指定別的
          },
        },
      },
    },
  },
});

export default theme;
