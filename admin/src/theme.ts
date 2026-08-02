import { createTheme } from '@mui/material/styles'

/**
 * Gippokamp brend temasi (user app bilan bir xil ranglar).
 * Faqat rang/shrift/radius/oraliqni o'zgartiradi — layout va strukturaga tegmaydi.
 * Brend: yashil #4daf00 (asosiy), apelsin #f79f44 (urg'u), to'q ko'k #121b2d (matn).
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#4daf00',
      light: '#aacc3a',
      dark: '#3f8f00',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#f79f44',
      contrastText: '#ffffff'
    },
    success: {
      main: '#4daf00',
      contrastText: '#ffffff'
    },
    text: {
      primary: '#121b2d',
      secondary: '#5a6a7a'
    },
    background: {
      default: '#eef2f5',
      paper: '#ffffff'
    },
    divider: 'rgba(18, 27, 45, 0.08)'
  },
  typography: {
    fontFamily: "'gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    button: {
      textTransform: 'none',
      fontWeight: 600
    },
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 20,
          paddingBlock: 8
        },
        containedPrimary: {
          // yashil brend gradient (user app tugmasiga hamohang)
          backgroundImage: 'linear-gradient(90deg, #3f8f00 0%, #aacc3a 100%)'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 14
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: '#121b2d'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
})

export default theme
