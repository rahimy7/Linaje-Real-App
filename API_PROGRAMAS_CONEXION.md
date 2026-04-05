# Conexión externa a la API de Programas / Cursos

Guía para consumir los endpoints de **programas y días** desde otro proyecto, incluyendo generación de PDF por día y del programa completo.

---

## 1. URL base del servidor

| Entorno        | URL base                          |
|----------------|-----------------------------------|
| Desarrollo local | `http://localhost:5000`         |
| LAN / emulador Android | `http://<TU_IP_LAN>:5000` |
| Producción     | `https://<TU_DOMINIO>`            |

> El servidor corre en el puerto **5000** por defecto (`process.env.PORT || 5000`).  
> CORS está configurado con `origin: true`, por lo que acepta peticiones desde cualquier origen.

---

## 2. Endpoints disponibles

### 2.1 Listar programas publicados
```
GET /api/programas
```
Solo devuelve programas con `publicado = true`.  
Para obtener **todos** (incluidos borradores) agrega el query param:
```
GET /api/programas?all=true
```

**Respuesta de ejemplo:**
```json
[
  {
    "id": 1,
    "slug": "40-dias-oracion",
    "nombre": "40 Días de Oración",
    "descripcion": "Un programa devocional de 40 días",
    "icono": "🙏",
    "imagenUrl": null,
    "color": "#EC4899",
    "categoria": "oracion",
    "version": "1.0.0",
    "totalDias": 40,
    "duracion": "40 días",
    "nivel": "Básico",
    "publicado": true,
    "creadoEn": "2025-01-01T00:00:00.000Z",
    "actualizadoEn": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### 2.2 Obtener un programa por ID
```
GET /api/programas/:id
```

---

### 2.3 Obtener los días de un programa
```
GET /api/programas/:programaId/dias
```
Devuelve los días **ordenados por `numero`**.

**Respuesta de ejemplo (un día):**
```json
[
  {
    "id": 1,
    "programaId": 1,
    "numero": 1,
    "titulo": "El Fundamento de la Oración",
    "descripcion": "Introducción al programa",
    "versiculoRef": "Mateo 6:9",
    "versiculoTexto": "Padre nuestro que estás en los cielos...",
    "reflexion": "La oración es la respiración del alma...",
    "actividadTitulo": "Ejercicio del día",
    "actividadDescripcion": "Escribe en tu diario tres cosas por las que agradecer",
    "audioUrl": null,
    "videoUrl": null,
    "ayunoDescripcion": null,
    "lecturas": ["Mateo 6:5-15", "Lucas 11:1-4"],
    "creadoEn": "2025-01-01T00:00:00.000Z"
  }
]
```

**Campos de cada día:**

| Campo                  | Tipo            | Descripción                              |
|------------------------|-----------------|------------------------------------------|
| `id`                   | number          | ID único del día                         |
| `programaId`           | number          | ID del programa al que pertenece         |
| `numero`               | number          | Número secuencial (1, 2, 3…)             |
| `titulo`               | string          | Título del día                           |
| `descripcion`          | string \| null  | Resumen breve                            |
| `versiculoRef`         | string \| null  | Referencia bíblica (ej. "Juan 3:16")     |
| `versiculoTexto`       | string \| null  | Texto completo del versículo             |
| `reflexion`            | string \| null  | Reflexión del día                        |
| `actividadTitulo`      | string \| null  | Título de la actividad práctica          |
| `actividadDescripcion` | string \| null  | Descripción de la actividad              |
| `audioUrl`             | string \| null  | URL de audio (opcional)                  |
| `videoUrl`             | string \| null  | URL de video (opcional)                  |
| `ayunoDescripcion`     | string \| null  | Indicaciones de ayuno (opcional)         |
| `lecturas`             | string[] \| null| Lista de lecturas adicionales            |
| `creadoEn`             | string (ISO)    | Fecha de creación                        |

---

## 3. Ejemplo de consumo en JavaScript / React Native

### Obtener todos los programas publicados
```js
const BASE_URL = "http://localhost:5000"; // cambia por tu IP/dominio

async function getProgramas() {
  const res = await fetch(`${BASE_URL}/api/programas`);
  if (!res.ok) throw new Error("Error al obtener programas");
  return res.json();
}
```

### Obtener los días de un programa
```js
async function getDiasPrograma(programaId) {
  const res = await fetch(`${BASE_URL}/api/programas/${programaId}/dias`);
  if (!res.ok) throw new Error("No se pudieron obtener los días");
  return res.json();
}
```

### Descarga completa de un programa con sus días
```js
async function descargarPrograma(programaId) {
  const [programa, dias] = await Promise.all([
    fetch(`${BASE_URL}/api/programas/${programaId}`).then(r => r.json()),
    fetch(`${BASE_URL}/api/programas/${programaId}/dias`).then(r => r.json()),
  ]);
  return { programa, dias };
}
```

---

## 4. Generación de PDF

La lógica de PDF usa **jsPDF** y ya está implementada en `client/src/lib/generateProgramaPdf.ts`. Para reutilizarla en otro proyecto:

### 4.1 Instalar dependencia
```bash
npm install jspdf
# o
yarn add jspdf
```

### 4.2 Copiar el archivo
Copia `client/src/lib/generateProgramaPdf.ts` a tu proyecto.  
Elimina las anotaciones de TypeScript si trabajas en JavaScript puro.

### 4.3 Funciones exportadas

#### PDF completo del programa (portada + todos los días)
```ts
import { generateProgramaPdf } from "./generateProgramaPdf";

// programa: objeto Programa
// dias: array DiaPrograma[]
await generateProgramaPdf(programa, dias);
// → descarga automáticamente "<nombre-del-programa>.pdf"
```

#### PDF de un solo día
```ts
import { generateDiaPdf } from "./generateProgramaPdf";

// programa: objeto Programa
// dia: un objeto DiaPrograma individual
await generateDiaPdf(programa, dia);
// → descarga automáticamente "Dia-1-<titulo>.pdf"
```

### 4.4 Flujo completo en un componente React
```tsx
import { generateProgramaPdf, generateDiaPdf } from "./generateProgramaPdf";

const BASE_URL = "http://localhost:5000";

// Descargar PDF completo
async function descargarPdfCompleto(programaId: number) {
  const [programa, dias] = await Promise.all([
    fetch(`${BASE_URL}/api/programas/${programaId}`).then(r => r.json()),
    fetch(`${BASE_URL}/api/programas/${programaId}/dias`).then(r => r.json()),
  ]);
  await generateProgramaPdf(programa, dias);
}

// Descargar PDF de un día específico
async function descargarPdfDia(programaId: number, numeroDia: number) {
  const [programa, dias] = await Promise.all([
    fetch(`${BASE_URL}/api/programas/${programaId}`).then(r => r.json()),
    fetch(`${BASE_URL}/api/programas/${programaId}/dias`).then(r => r.json()),
  ]);
  const dia = dias.find((d: any) => d.numero === numeroDia);
  if (!dia) throw new Error(`Día ${numeroDia} no encontrado`);
  await generateDiaPdf(programa, dia);
}
```

---

## 5. Uso desde React Native (app móvil)

En React Native, jsPDF no funciona directamente. Usa **react-native-html-to-pdf** o **expo-print**:

```js
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const BASE_URL = "http://10.0.2.2:5000"; // emulador Android
// const BASE_URL = "http://localhost:5000"; // iOS simulator
// const BASE_URL = "http://<IP_LAN>:5000"; // dispositivo físico

async function generarPdfDia(programaId, numeroDia) {
  const dias = await fetch(`${BASE_URL}/api/programas/${programaId}/dias`).then(r => r.json());
  const dia = dias.find(d => d.numero === numeroDia);

  const html = `
    <html>
    <body style="font-family: serif; padding: 24px; color: #2C2418;">
      <h1 style="color: #8B7332;">Día ${dia.numero}: ${dia.titulo}</h1>
      ${dia.versiculoTexto ? `
        <blockquote style="border-left: 4px solid #8B7332; padding-left: 12px; color: #5A5040;">
          <p><em>${dia.versiculoTexto}</em></p>
          <footer><strong>${dia.versiculoRef}</strong></footer>
        </blockquote>` : ""}
      ${dia.reflexion ? `<h2>Reflexión</h2><p>${dia.reflexion}</p>` : ""}
      ${dia.actividadTitulo ? `
        <h2>${dia.actividadTitulo}</h2>
        <p>${dia.actividadDescripcion || ""}</p>` : ""}
      ${dia.ayunoDescripcion ? `<h2>Ayuno</h2><p>${dia.ayunoDescripcion}</p>` : ""}
      ${dia.lecturas?.length ? `
        <h2>Lecturas</h2>
        <ul>${dia.lecturas.map(l => `<li>${l}</li>`).join("")}</ul>` : ""}
    </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}
```

---

## 6. Notas de CORS y seguridad

- El servidor ya tiene `cors({ origin: true })` → acepta cualquier origen en desarrollo.
- En **producción** cambia `origin: true` por la lista explícita de dominios permitidos en `server/index.ts`:
  ```ts
  app.use(cors({
    origin: ["https://tu-app.com", "https://tu-otro-proyecto.com"],
    credentials: true,
  }));
  ```
- Los endpoints de lectura (`GET`) no requieren autenticación actualmente.
- Si necesitas proteger los endpoints, agrega un header `Authorization` y valídalo en el middleware del servidor.

---

## 7. Registro de Peticiones de Oración desde otro proyecto

### 7.1 Endpoint

```
POST /api/public/oraciones
```

- **No requiere autenticación.**
- Si el usuario **no es anónimo**, se registra automáticamente como miembro de la iglesia si aún no existe.

---

### 7.2 Body JSON

| Campo           | Tipo    | Requerido | Default         | Descripción                                 |
|-----------------|---------|-----------|-----------------|---------------------------------------------|
| `titulo`        | string  | ✅        | —               | Título de la petición (máx. 80 caracteres)  |
| `descripcion`   | string  | —         | `""`            | Detalle adicional (máx. 500 caracteres)     |
| `nombreUsuario` | string  | —         | `"Anónimo"`     | Nombre de quien envía la petición           |
| `esAnonimo`     | boolean | —         | `false`         | Si `true`, oculta el nombre y no crea miembro |
| `categoria`     | string  | —         | `"general"`     | Categoría de la petición                    |
| `iglesia`       | string  | —         | `"Linaje Real"` | Iglesia del remitente (usada al crear miembro) |

---

### 7.3 Respuesta exitosa `201`

```json
{
  "success": true,
  "id": 42,
  "miembroId": 7,
  "mensaje": "Petición de oración enviada correctamente"
}
```

> `miembroId` es `null` si `esAnonimo: true`.

### 7.4 Respuesta de error `400`

```json
{
  "error": "Datos inválidos",
  "detalles": {
    "titulo": ["El título es requerido"]
  }
}
```

---

### 7.5 Ejemplos de consumo

#### JavaScript / React / Next.js
```js
const BASE_URL = "https://linajereal.up.railway.app"; // producción
// const BASE_URL = "http://localhost:5000"; // local

async function enviarPeticionOracion({ titulo, descripcion, nombreUsuario, esAnonimo = false, iglesia = "Linaje Real" }) {
  const res = await fetch(`${BASE_URL}/api/public/oraciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descripcion, nombreUsuario, esAnonimo, iglesia }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// Uso
await enviarPeticionOracion({
  titulo: "Sanidad para mi familia",
  descripcion: "Oramos por mi mamá enferma",
  nombreUsuario: "María López",
  iglesia: "Nueva Vida",
});
```

#### React Native
```js
import { Platform } from "react-native";

const BASE_URL = __DEV__
  ? Platform.OS === "android"
    ? "http://10.0.2.2:5000"
    : "http://localhost:5000"
  : "https://linajereal.up.railway.app";

async function enviarPeticion({ titulo, descripcion, nombreUsuario, esAnonimo = false }) {
  const res = await fetch(`${BASE_URL}/api/public/oraciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descripcion, nombreUsuario, esAnonimo }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

#### cURL
```bash
curl -X POST https://linajereal.up.railway.app/api/public/oraciones \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Necesito oración por mi trabajo",
    "nombreUsuario": "Carlos",
    "esAnonimo": false,
    "iglesia": "Linaje Real"
  }'
```

---

## 8. Resumen rápido de endpoints de programas

| Método | Endpoint                              | Descripción                          |
|--------|---------------------------------------|--------------------------------------|
| GET    | `/api/programas`                      | Listar publicados (`?all=true` = todos) |
| GET    | `/api/programas/:id`                  | Detalle de un programa               |
| GET    | `/api/programas/:programaId/dias`     | Días del programa (ordenados)        |

## 9. Resumen rápido de endpoints de oración

| Método | Endpoint                    | Descripción                                                  |
|--------|-----------------------------|--------------------------------------------------------------|
| POST   | `/api/public/oraciones`     | Crear petición pública (registra miembro automáticamente)    |
| GET    | `/api/oraciones`            | Listar peticiones (`?estado=pendiente`)                      |
| POST   | `/api/oraciones/:id/orar`   | Incrementar contador de oraciones de una petición            |
