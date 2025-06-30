Materia: Certificacion de Software.
Alumno: Stefan Oebels Sanchez. 
Docente:  I.G.T.I. JOSHUA EDUARDO GONZALEZ RUIZ. 
Fecha de entrega: 30/06/2025.
Proyecto: Visualizador y Tester de Expresiones Regulares (RegEx).

Introduccion:
8VO-EXTRA-STEFAN es una aplicación desarrollada en React Native con Expo que permite a los usuarios probar y visualizar expresiones regulares (RegEx) de forma interactiva. 
La herramienta genera automáticamente un árbol sintáctico abstracto (AST) a partir de la expresión ingresada, y lo muestra visualmente mediante gráficos SVG.
Además, permite al usuario probar su RegEx con un texto de ejemplo, visualizar coincidencias, guardar historial 
y entender de forma más clara la estructura interna de expresiones regulares complejas.

---Instrucciones de uso e instalación.--- 

-Lo primero que tiene que hacer el usuario es descargar el proyecto, esto puede ser desde de Github o el medio por el cual sea enviado.
- Una vez el usuario haya descargado el proyecto, tendra que abrirlo en vscode.
- Despues de que el usuario tenga el proyecto abierto, tendra que abrir la terminal y colocar "npm install"
- Una vez se hayan instalado las dependencias, el usuario debe colocar en la terminal "npx expo start"
- Para que el usuario pueda ver el proyecto, debera apretar "a" para correrlo en el emulador o escanear el codigo con la aplicacion "Expo go"

---Descripción de arquitectura y librerías.---

Este proyecto fue realizado con  una arquitectura profesional: CLEAN + MVVM + Feature First + Atomic Design.

Librerias utilizadas: 
React Native 
Expo 
Expo Router 
React Navigation
react-native-screens 
react-native-safe-area-context 
react-native-gesture-handler 
Redux Toolkit 
react-redux 
Zustand 
Async Storage 
regexp-tree 
regexpp 
react-native-svg
react-dom 
react-native-web 
react-native-webview  
core-js 
expo-asset, expo-linking, expo-status-bar  

---Diagrama (opcional) de carpetas y flujo de datos.---
8VO-EXTRA-STEFAN/
├── app/                           
│   ├── _layout.tsx                 
│   ├── diagrama.tsx                
│   ├── history.tsx                 
│   ├── index.tsx                   
│   └── tester.tsx                  
│
├── assets/                         
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
│
├── src/
│   ├── core/                       
│   │   ├── hooks/
│   │   │   └── useAppTheme.ts      
│   │   ├── store/
│   │   │   ├── index.ts            
│   │   │   └── slices/
│   │   │       └── themeSlice.tsx  
│   │   ├── theme/
│   │   │   └── colors.ts          
│   │   └── utils/
│   │       ├── ast.ts              
│   │       └── regexHelpers.ts     
│   │
│   └── features/
│       └── regexTester/
│           ├── domain/
│           │   └── usecases/
│           │       └── generateAST.ts   
│           └── presentation/
│               ├── components/
│               │   ├── ASTVisualizer.tsx        
│               │   └── atoms/
│               │       ├── Button/
│               │       │   ├── Button.tsx
│               │       │   └── types/type.ts
│               │       ├── Card/
│               │       │   ├── Card.tsx
│               │       │   └── types/types.ts
│               │       ├── Icono/
│               │       │   ├── Icon.tsx
│               │       │   └── types/types.ts
│               │       └── Input/
│               │           └── Input.tsx
│               └── screens/                   
│
├── .gitignore
├── app.json
├── index.ts
├── package.json
├── package-lock.json
└── tsconfig.json

graph TD
    User[ Usuario]
    UI[ Interfaz (Pantalla Tester)]
    Hook[ useRegexTester (useState, useEffect)]
    UseCase[ generateAST.ts]
    Parser[ regexp-tree / regexpp]
    AST[ ASTVisualizer.tsx]
    Store[ Redux / Zustand]
    Storage[ AsyncStorage]

    User --> UI
    UI --> Hook
    Hook --> UseCase
    UseCase --> Parser
    Parser --> AST
    Hook --> Store
    Store --> UI
    Hook --> Storage
    Storage --> UI



