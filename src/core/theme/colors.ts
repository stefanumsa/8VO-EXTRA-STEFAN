
// Paleta de colores para el modo claro
export const lightColors = {
  primary: '#2ecc71',        // Verde claro
  background: '#ffffff',     // Blanco puro
  text: '#2c3e50',           // Gris oscuro
  highlight: '#ffff00',      // Amarillo brillante
  hover: '#0056b3',          // Azul oscuro para hovers
};

// Paleta de colores para el modo oscuro
export const darkColors = {
  primary: '#2c2c2c',        // Girs oscuro
  background: '#0f0f0f',     // Casi negro
  text: '#ecf0f1',           // Gris muy claro (casi blanco)
  highlight: '#808000',      // Color Oliva para resaltar coincidencias
  hover: '#2980b9',          // Azul medio para hovers
};

// Tipo para los colores del tema
export type ThemeColors = typeof lightColors;
