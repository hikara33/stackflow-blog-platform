import { createTheme, type Shadows } from "@mui/material/styles";

const noShadows: Shadows = Array(25).fill("none") as Shadows;

export const theme = createTheme({
    shadows: noShadows,
    palette: {
        primary: {
            main: "#4361ee",
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segue UI"',
            'Roboto',
            '"Helvetica Nee"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segue UI Emoji"',
            '"Segue UI Symbol"',
        ].join(","),
        button: {
            textTransform: "none",
            fontWeight: 400,
        },
    },
});
