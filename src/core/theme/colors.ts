
// Paleta de colores para el modo claro
export const lightColors = {
  primary: '#2ecc71',        
  background: '#ffffff',     
  text: '#2c3e50',           
  highlight: '#ffff00',      
  hover: '#0056b3',          
};

// Paleta de colores para el modo oscuro
export const darkColors = {
  primary: '#2c2c2c',        
  background: '#0f0f0f',     
  text: '#ecf0f1',           
  highlight: '#808000',      
  hover: '#2980b9',          
};

// Tipo para los colores del tema
export type ThemeColors = typeof lightColors;

// Mapeo general por tema
export const colorsByTheme = {
  light: lightColors,
  dark: darkColors,
};