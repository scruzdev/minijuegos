# SPECS.md

## 1. Project Overview

Construir una aplicación web que funcione como una colección de minijuegos ligeros y de acceso rápido.

El usuario debe poder entrar a la aplicación, visualizar un catálogo de juegos disponibles y seleccionar uno para comenzar a jugar inmediatamente.

La primera versión incluirá únicamente:

- Minesweeper / Buscaminas.

La arquitectura debe permitir añadir nuevos juegos en el futuro, como:

- Snake.
- Pong.
- Otros juegos ligeros.

Estos juegos futuros no forman parte del alcance actual.

La idea original del proyecto nace principalmente de querer disponer de una web a la que se pueda entrar desde el teléfono móvil para jugar rápidamente sin necesidad de instalar una aplicación.

Por este motivo, la experiencia móvil es un requisito importante del proyecto y no una adaptación secundaria.

---

## 2. Product Vision

La aplicación funcionará como una pequeña plataforma de juegos rápidos accesible directamente desde el navegador.

Flujo principal:

```text
Entrar a la aplicación
        ↓
Ver catálogo de juegos
        ↓
Seleccionar un juego
        ↓
Jugar
        ↓
Volver al catálogo
```

El catálogo irá creciendo progresivamente.

Primera versión:

```text
Games

┌─────────────────┐
│   Minesweeper   │
└─────────────────┘
```

Posible evolución futura:

```text
Games

┌─────────────────┐
│   Minesweeper   │
└─────────────────┘

┌─────────────────┐
│      Snake      │
└─────────────────┘

┌─────────────────┐
│      Pong       │
└─────────────────┘
```

---

## 3. Project Goals

- Crear una web desde la cual acceder rápidamente a distintos minijuegos.
- Permitir jugar cómodamente desde dispositivos móviles.
- Mantener también una buena experiencia en escritorio.
- Crear una estructura que permita añadir nuevos juegos fácilmente.
- Implementar Minesweeper como primer juego.
- Mantener cada juego aislado de los demás.
- Separar la lógica específica de cada juego de la lógica general de la plataforma.
- Mantener el proyecto pequeño y fácil de entender.
- Evitar sobrearquitectura.
- Facilitar el desarrollo mediante agentes de programación con IA.
- Priorizar código legible y mantenible.

---

## 4. Technical Stack

La aplicación utilizará:

- Angular.
- TypeScript.
- Tailwind CSS.
- Angular Signals.
- Angular Router.
- Standalone Components.

Angular Material puede utilizarse cuando aporte valor para componentes generales de interfaz, por ejemplo:

- dialogs;
- menus;
- tooltips;
- inputs;
- controles de interfaz comunes.

No es obligatorio utilizar Angular Material.

No debe utilizarse simplemente por estar disponible.

### Styling Principle

Prioridad:

1. Tailwind CSS para layout y estilos generales.
2. CSS específico cuando un juego necesite estilos propios.
3. Angular Material cuando simplifique claramente un componente de UI.

Evitar mezclar innecesariamente múltiples sistemas de estilos dentro del mismo componente.

---

## 5. Responsive Design

La aplicación debe ser responsive.

La experiencia móvil es una prioridad del proyecto.

La interfaz debe funcionar correctamente como mínimo en:

- teléfonos móviles;
- tablets;
- escritorio.

No se debe asumir que el usuario utilizará mouse.

Todas las funcionalidades principales deben poder ejecutarse mediante interacción táctil.

El diseño debe adaptarse al espacio disponible sin requerir zoom manual del navegador para utilizar las funciones principales.

---

## 6. Application Structure

Conceptualmente la aplicación estará dividida en dos áreas principales:

```text
Application
│
├── Platform
│   ├── Catalog
│   ├── Navigation
│   └── Game Registry
│
└── Games
    │
    └── Minesweeper
        ├── Game Logic
        └── Game UI
```

### Platform

Responsable de:

- catálogo de juegos;
- navegación;
- metadata de cada juego;
- acceso a los juegos disponibles.

La plataforma no debe conocer la lógica interna de Minesweeper.

### Games

Contiene la implementación de los juegos.

Ejemplo conceptual:

```text
games/
├── minesweeper/
├── snake/
└── pong/
```

Actualmente solo debe existir:

```text
games/
└── minesweeper/
```

No crear implementaciones vacías de juegos futuros.

---

## 7. Angular Architecture

La arquitectura debe organizarse principalmente por feature.

Estructura inicial de referencia:

```text
src/
└── app/
    │
    ├── app.component.ts
    ├── app.component.html
    ├── app.config.ts
    ├── app.routes.ts
    │
    ├── platform/
    │   │
    │   ├── catalog/
    │   │   ├── catalog-page.component.ts
    │   │   ├── catalog-page.component.html
    │   │   └── catalog-page.component.css
    │   │
    │   ├── game-definition.model.ts
    │   └── game-registry.ts
    │
    └── games/
        │
        └── minesweeper/
            │
            ├── minesweeper-page.component.ts
            ├── minesweeper-page.component.html
            ├── minesweeper-page.component.css
            │
            ├── minesweeper-board.component.ts
            ├── minesweeper-board.component.html
            ├── minesweeper-board.component.css
            │
            ├── minesweeper-game.service.ts
            ├── minesweeper.models.ts
            └── minesweeper.config.ts
```

Esta estructura es una referencia, no una obligación de crear todos los archivos desde el inicio.

No crear archivos vacíos o abstracciones solo para replicar el diagrama.

---

## 8. Architecture Principles

La estructura debe ser fácil de entender al abrir el proyecto sin conocimiento previo.

Un desarrollador debe poder reconocer:

```text
platform/
```

como funcionalidad de la aplicación general y:

```text
games/
```

como la ubicación de las implementaciones de juegos.

Cada juego es dueño de su implementación.

Cuando Snake sea implementado en el futuro:

```text
games/
├── minesweeper/
└── snake/
```

Snake no debe requerir cambios en la implementación interna de Minesweeper.

### Avoid Premature Shared Layers

No crear inicialmente carpetas globales como:

```text
core/
shared/
utils/
common/
services/
stores/
```

salvo que exista una necesidad real.

Si en el futuro aparece funcionalidad verdaderamente reutilizable entre varias features, puede extraerse en ese momento.

No anticipar reutilización hipotética.

---

## 9. Game Catalog

La pantalla principal será el catálogo de juegos.

Cada juego debe representarse mediante una tarjeta.

Una tarjeta puede contener:

- nombre;
- imagen o representación visual;
- descripción corta;
- acción para jugar.

Ejemplo conceptual:

```text
┌──────────────────────────┐
│                          │
│      [GAME IMAGE]        │
│                          │
│      Minesweeper         │
│                          │
│  Classic Minesweeper     │
│                          │
│        [ Play ]          │
│                          │
└──────────────────────────┘
```

Inicialmente solo existirá Minesweeper.

El catálogo debe ser responsive.

En móvil las tarjetas deben poder visualizarse cómodamente en una única columna.

La estructura debe poder evolucionar posteriormente hacia múltiples columnas cuando existan más juegos.

---

## 10. Game Registry

Los juegos disponibles deben definirse desde un punto central.

No crear un sistema dinámico de plugins.

Un registro simple es suficiente.

Modelo conceptual:

```ts
export interface GameDefinition {
  id: string;
  name: string;
  description: string;
  route: string;
  image?: string;
}
```

Ejemplo:

```ts
export const GAME_REGISTRY: GameDefinition[] = [
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    description: 'Classic Minesweeper',
    route: '/games/minesweeper'
  }
];
```

El catálogo debe construir sus tarjetas desde este registro.

No escribir manualmente una tarjeta específica de Minesweeper directamente en el template del catálogo.

Añadir un juego futuro debe requerir conceptualmente:

1. Crear la implementación del juego.
2. Crear su ruta.
3. Añadirlo al registro.

---

## 11. Navigation

Rutas principales:

```text
/
└── Game Catalog

/games/minesweeper
└── Minesweeper
```

Ejemplo futuro:

```text
/games/snake
/games/pong
```

Desde cada juego debe existir una forma clara de regresar al catálogo.

Los juegos deben cargarse mediante lazy loading cuando sea práctico.

No crear una abstracción personalizada sobre Angular Router.

---

# Minesweeper

## 12. Minesweeper Overview

Minesweeper será el primer juego de la plataforma.

Debe estar fuertemente inspirado en el Buscaminas clásico de Windows.

Se debe priorizar:

- comportamiento clásico;
- interfaz reconocible;
- velocidad;
- simplicidad;
- estética retro.

No es necesario realizar una reproducción pixel-perfect de una versión concreta de Windows.

---

## 13. Difficulty Levels

Debe incluir las tres dificultades clásicas:

| Difficulty | Width | Height | Mines |
|---|---:|---:|---:|
| Beginner | 9 | 9 | 10 |
| Intermediate | 16 | 16 | 40 |
| Expert | 30 | 16 | 99 |

La dificultad determina:

- cantidad de columnas;
- cantidad de filas;
- cantidad de minas.

No implementar dificultad personalizada en V1.

La configuración debe estar centralizada.

Ejemplo conceptual:

```ts
export const MINESWEEPER_DIFFICULTIES = {
  beginner: {
    rows: 9,
    columns: 9,
    mines: 10
  },
  intermediate: {
    rows: 16,
    columns: 16,
    mines: 40
  },
  expert: {
    rows: 16,
    columns: 30,
    mines: 99
  }
};
```

No dispersar estos valores por componentes o lógica.

---

## 14. Game States

Estados posibles:

```ts
export type GameStatus =
  | 'ready'
  | 'playing'
  | 'won'
  | 'lost';
```

### ready

Existe un tablero generado pero todavía no se ha revelado ninguna celda.

### playing

La partida se encuentra activa.

### won

Todas las celdas que no contienen minas han sido reveladas.

### lost

El jugador ha revelado una mina.

---

## 15. Board Generation

Al iniciar una nueva partida se debe:

1. Crear el tablero correspondiente a la dificultad seleccionada.
2. Distribuir aleatoriamente el número correspondiente de minas.
3. Calcular el número de minas adyacentes para cada celda.

La posición de las minas puede generarse inmediatamente al crear el tablero.

---

## 16. First Click Behavior

El primer click no está protegido.

Una mina puede encontrarse en cualquier celda desde el momento en que se genera el tablero.

Si el primer click del jugador corresponde a una mina:

```text
status = lost
```

y la partida termina.

No implementar lógica para:

- mover minas después del primer click;
- regenerar el tablero;
- garantizar una zona inicial segura;
- garantizar que el primer click sea una celda vacía.

---

## 17. Cell Model

Modelo conceptual:

```ts
export interface Cell {
  row: number;
  column: number;

  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;

  adjacentMines: number;
}
```

El modelo final puede variar ligeramente si existe una razón técnica clara, pero debe conservar responsabilidades equivalentes.

---

## 18. Minesweeper Core Gameplay

Cada celda puede:

- contener una mina;
- estar vacía;
- contener información sobre la cantidad de minas existentes en sus ocho posiciones adyacentes.

### Reveal Action

Al revelar una celda oculta:

- si contiene una mina, el jugador pierde;
- si contiene minas adyacentes, muestra el número correspondiente;
- si tiene cero minas adyacentes, comienza la expansión de la zona vacía.

Una celda marcada con bandera no puede revelarse directamente.

---

## 19. Empty Cell Expansion

Cuando se revela una celda con:

```ts
adjacentMines === 0
```

se deben revelar automáticamente las celdas adyacentes.

Si alguna celda adyacente también tiene cero minas adyacentes, la expansión continúa.

El proceso termina al alcanzar celdas numeradas.

Las celdas numeradas que rodean la zona vacía deben quedar visibles.

---

## 20. Flags

Una celda oculta puede marcarse con una bandera.

Una celda marcada puede volver al estado normal eliminando la bandera.

Una celda revelada no puede marcarse.

El número de banderas debe utilizarse para actualizar el contador de minas restantes.

---

## 21. Win Condition

El jugador gana cuando todas las celdas que no contienen minas han sido reveladas.

No es obligatorio colocar una bandera sobre cada mina para ganar.

Cuando se gana:

```text
status = won
```

La partida deja de aceptar nuevas acciones sobre el tablero.

---

## 22. Lose Condition

Si el jugador revela una mina:

```text
status = lost
```

La partida termina inmediatamente.

Después de perder:

- las minas deben hacerse visibles;
- el tablero deja de aceptar nuevas acciones;
- el usuario puede iniciar una nueva partida.

---

## 23. Mine Counter

La interfaz debe incluir un contador inspirado en Minesweeper clásico.

Conceptualmente:

```ts
remainingMines = totalMines - flagsPlaced;
```

El valor debe actualizarse inmediatamente al añadir o eliminar una bandera.

---

## 24. Timer

Debe existir un temporizador visible.

El temporizador:

- comienza cuando se realiza la primera acción que inicia la partida;
- aumenta en segundos;
- se detiene al ganar;
- se detiene al perder;
- vuelve a cero al iniciar una nueva partida.

No es necesario almacenar el tiempo una vez que la partida finaliza.

---

## 25. Score and Persistence

La primera versión no tendrá sistema de puntuaciones persistente.

No implementar:

- high scores;
- mejores tiempos;
- leaderboard;
- historial de partidas;
- estadísticas persistentes;
- sincronización;
- almacenamiento en backend;
- almacenamiento de resultados en `localStorage`.

Al recargar la página puede perderse completamente el estado actual de la partida.

---

## 26. Restart

Debe existir un control de reinicio inspirado en el botón con cara del Minesweeper clásico.

Al activarlo:

- se crea un tablero nuevo;
- se mantiene la dificultad seleccionada;
- se redistribuyen las minas;
- el temporizador vuelve a cero;
- el contador vuelve a su estado inicial;
- el estado vuelve a `ready`.

---

## 27. Difficulty Selector

El usuario debe poder elegir:

- Beginner.
- Intermediate.
- Expert.

Cambiar de dificultad inicia automáticamente una nueva partida.

---

## 28. Desktop Controls

En dispositivos con mouse:

### Left Click

Revela una celda.

### Right Click

Coloca o elimina una bandera.

El menú contextual estándar del navegador no debe aparecer al hacer click derecho sobre una celda.

---

## 29. Mobile Controls

Minesweeper debe poder jugarse completamente mediante pantalla táctil.

### Tap

```text
Tap
 ↓
Reveal cell
```

### Long Press

```text
Long press
    ↓
Toggle flag
```

Un long press sobre una celda oculta sin bandera coloca una bandera.

Un long press sobre una celda marcada elimina la bandera.

---

## 30. Long Press Behavior

La implementación debe utilizar interacción de pointer/touch apropiada para navegadores modernos.

Comportamiento conceptual:

```text
Pointer down
     ↓
Start long-press timer
     ↓
≈ 500 ms
     ↓
Toggle flag
```

Si el usuario libera antes del umbral:

```text
Pointer down
     ↓
Pointer up
     ↓
Reveal cell
```

Después de un long press exitoso, el posterior `pointer up` no debe revelar la misma celda.

El long press debe cancelarse cuando corresponda, por ejemplo:

- pointer cancel;
- scroll;
- movimiento significativo;
- pérdida inesperada de la interacción.

Esto debe evitar colocar banderas accidentalmente mientras el usuario intenta desplazarse.

---

## 31. Minesweeper Visual Style

La interfaz debe recordar claramente al Minesweeper clásico de Windows.

Elementos visuales:

- fondo gris;
- bordes con efecto 3D / bevel;
- celdas elevadas mientras están ocultas;
- celdas planas cuando están reveladas;
- números diferenciados mediante colores;
- contador digital;
- temporizador digital;
- botón central con cara;
- minas;
- banderas;
- diseño compacto;
- estética retro.

Referencia conceptual:

```text
┌─────────────────────────────────┐
│                                 │
│  ┌─────┐      🙂      ┌─────┐  │
│  │ 010 │              │ 000 │  │
│  └─────┘              └─────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ □ □ □ □ □ □ □ □ □       │  │
│  │ □ □ □ □ □ □ □ □ □       │  │
│  │ □ □ □ □ □ □ □ □ □       │  │
│  │ □ □ □ □ □ □ □ □ □       │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

Para esta interfaz pueden utilizarse estilos CSS específicos en lugar de Angular Material.

---

## 32. Responsive Minesweeper

Minesweeper debe funcionar correctamente en móvil.

### Beginner

El tablero `9 × 9` debe poder jugarse cómodamente en una pantalla de teléfono convencional.

No debería requerir scroll horizontal en condiciones normales.

Las celdas deben mantenerse suficientemente grandes para interacción táctil.

### Intermediate and Expert

No es obligatorio que todo el tablero quepa simultáneamente en una pantalla móvil.

Especialmente en Expert, no se deben reducir las celdas hasta hacerlas incómodas.

La estrategia preferida es:

```text
Mobile viewport
│
├── Game controls fit viewport
│
└── Board container
      └── Scrollable board when required
```

El contenedor del tablero puede utilizar scroll horizontal y, si es necesario, vertical.

El tablero no debe provocar scroll horizontal en toda la página.

Cuando haya que elegir entre:

```text
Fit entire board
```

y:

```text
Maintain usable cell size
```

se debe priorizar mantener un tamaño usable de celda.

---

## 33. Minesweeper Internal Architecture

Minesweeper tendrá inicialmente tres piezas conceptuales principales:

```text
MinesweeperPage
      │
      ├── MinesweeperBoard
      │
      └── MinesweeperGameService
```

### MinesweeperPage

Responsable de:

- layout general del juego;
- selector de dificultad;
- contador de minas;
- temporizador;
- botón de reinicio;
- navegación al catálogo;
- conexión entre UI y estado del juego.

No debe contener algoritmos para generar el tablero.

### MinesweeperBoard

Responsable de:

- renderizar celdas;
- representar celdas reveladas;
- representar celdas ocultas;
- mostrar banderas;
- mostrar minas;
- mostrar números;
- manejar pointer interaction;
- manejar click de escritorio;
- detectar long press.

El board maneja la mecánica de interacción, pero no las reglas del juego.

Por ejemplo, puede determinar que ocurrió un long press, pero debe delegar la acción a la lógica del juego.

### MinesweeperGameService

Responsable del estado y reglas del juego.

---

## 34. State Management

Minesweeper debe gestionar su estado utilizando Angular Signals.

No introducir:

- NgRx;
- Redux;
- Akita;
- otras librerías externas de state management.

Ejemplo conceptual:

```ts
@Injectable()
export class MinesweeperGameService {
  private readonly _board = signal<Cell[][]>([]);
  private readonly _status = signal<GameStatus>('ready');
  private readonly _difficulty = signal<Difficulty>('beginner');
  private readonly _elapsedSeconds = signal(0);

  readonly board = this._board.asReadonly();
  readonly status = this._status.asReadonly();
  readonly difficulty = this._difficulty.asReadonly();
  readonly elapsedSeconds = this._elapsedSeconds.asReadonly();

  readonly remainingMines = computed(() => {
    // total mines - placed flags
  });
}
```

La implementación real puede mejorar nombres o representación interna cuando sea útil.

---

## 35. Minesweeper Game Service Responsibilities

El servicio debe exponer operaciones conceptualmente similares a:

```ts
newGame()
revealCell(row, column)
toggleFlag(row, column)
changeDifficulty(difficulty)
```

Debe encargarse de:

- generar el tablero;
- distribuir minas;
- calcular minas adyacentes;
- revelar celdas;
- expandir zonas vacías;
- gestionar banderas;
- determinar victoria;
- determinar derrota;
- cambiar dificultad;
- reiniciar partidas;
- manejar el estado del temporizador.

No debe manipular:

- DOM;
- HTML;
- CSS;
- pointer events.

---

## 36. State Lifetime

El estado de Minesweeper no necesita ser estado global de la aplicación.

El servicio debe pertenecer a la feature Minesweeper.

Salir del juego y volver puede iniciar una partida nueva.

Persistencia entre navegación no es requerida.

Persistencia después de recargar la página no es requerida.

---

## 37. Interaction Logic Separation

La detección de gestos pertenece a la UI.

Las reglas del juego pertenecen al servicio.

Ejemplo:

```text
Long press detected
        ↓
Board component
        ↓
game.toggleFlag(row, column)
```

El servicio no necesita saber si la acción provino de:

- mouse;
- touch;
- long press;
- otro método de entrada futuro.

Solo recibe la intención.

---

## 38. Component Granularity

No crear un componente Angular separado para cada pequeño elemento visual por defecto.

Por ejemplo, no requieren automáticamente un componente propio:

- contador de minas;
- temporizador;
- botón de reinicio;
- selector de dificultad;
- celda individual.

Pueden vivir inicialmente dentro de `MinesweeperPage` o `MinesweeperBoard`.

Crear componentes adicionales solo cuando la complejidad o reutilización lo justifique.

Evitar fragmentar innecesariamente un juego pequeño en demasiados archivos.

---

## 39. Dependency Rules

Permitido:

```text
platform → generic application functionality

minesweeper UI → minesweeper game service

minesweeper game service → minesweeper models/config
```

Evitar:

```text
platform → minesweeper internal logic
```

Evitar:

```text
minesweeper game logic → catalog
```

Evitar:

```text
minesweeper game logic → DOM
```

---

## 40. Future Games

La arquitectura debe permitir añadir nuevos juegos posteriormente.

Ejemplo:

```text
games/
├── minesweeper/
├── snake/
├── pong/
└── ...
```

Cada juego puede contener:

- componentes propios;
- modelos propios;
- lógica propia;
- estilos propios;
- assets propios.

No crear ahora:

- `GameEngine`;
- `BaseGame`;
- `AbstractGame`;
- sistema de plugins;
- contratos genéricos complejos entre juegos.

Minesweeper y Snake pueden tener lógicas completamente distintas.

El único contrato común actualmente necesario es el metadata usado por el catálogo y la navegación.

---

## 41. Out of Scope — V1

No implementar:

- Snake.
- Pong.
- Otros juegos.
- Backend.
- Base de datos.
- Autenticación.
- Usuarios.
- Multiplayer.
- Leaderboard.
- High scores persistentes.
- Historial de partidas.
- Sincronización entre dispositivos.
- Dificultad Custom de Minesweeper.
- Sistema dinámico de plugins.
- CMS.
- Panel administrativo.
- Monetización.

---

## 42. Development Principles

### Simplicity

Elegir la solución más sencilla que cumpla correctamente los requisitos.

### Avoid Premature Abstraction

No crear:

- managers genéricos;
- factories innecesarias;
- interfaces genéricas para todos los juegos;
- sistemas de plugins;
- capas adicionales;

sin una necesidad actual.

### Game Isolation

La implementación de Minesweeper debe permanecer dentro de su propia feature.

### Platform Isolation

El catálogo y navegación pertenecen a la aplicación general.

No deben contener lógica específica del funcionamiento interno de Minesweeper.

### AI Development

Este documento debe considerarse la fuente principal de requisitos del proyecto.

El agente debe:

- seguir las decisiones descritas aquí;
- evitar introducir funcionalidades no solicitadas;
- elegir soluciones simples para decisiones técnicas menores;
- mantener coherencia con la arquitectura existente;
- no cambiar decisiones funcionales explícitas para adaptarlas a implementaciones más comunes.

Ejemplo:

> El primer click de Minesweeper puede contener una mina. No implementar automáticamente un "safe first click".

### Readability

Priorizar:

1. código legible;
2. responsabilidades claras;
3. nombres descriptivos;
4. estructura sencilla;
5. facilidad de mantenimiento.

Evitar optimizaciones prematuras.

---

## 43. AI Agent Architecture Rules

El agente de código debe seguir estas reglas:

1. Preferir la solución Angular más simple que satisfaga el SPECS.
2. Utilizar standalone components.
3. Utilizar Angular Signals para el estado de Minesweeper.
4. No introducir NgRx u otra librería de estado.
5. Organizar código por feature.
6. Mantener código específico de cada juego dentro de su directorio.
7. No crear abstracciones para juegos hipotéticos.
8. No crear capas vacías de arquitectura.
9. No dividir UI simple en una cantidad excesiva de componentes.
10. Mantener reglas de juego independientes del DOM y presentación.
11. Tratar la interacción móvil como requisito de primera clase.
12. Mantener long press como gesto móvil para banderas.
13. No implementar protección del primer click.
14. No implementar persistencia o scores.
15. No implementar juegos futuros.
16. No ampliar el alcance funcional sin que esté especificado.
17. Si una decisión menor no está especificada, elegir la alternativa más simple y convencional.
18. Si una decisión afecta arquitectura, comportamiento o alcance, no asumir silenciosamente una solución incompatible con este documento.

---

## 44. Definition of Done — Platform V1

La plataforma se considera funcional cuando:

- La aplicación Angular puede ejecutarse localmente.
- Existe una pantalla principal con catálogo de juegos.
- El catálogo funciona correctamente en móvil y escritorio.
- Minesweeper aparece en el catálogo.
- Se puede acceder a Minesweeper.
- Se puede regresar al catálogo.
- El catálogo obtiene los juegos desde un registro central.
- La implementación de Minesweeper está aislada de la plataforma.
- La ruta de Minesweeper puede cargarse como feature independiente.

---

## 45. Definition of Done — Minesweeper V1

Minesweeper se considera funcional cuando:

- Se puede iniciar una partida.
- Existen Beginner, Intermediate y Expert.
- Cada dificultad utiliza correctamente sus dimensiones y cantidad de minas.
- Las minas se distribuyen aleatoriamente.
- El primer click puede contener una mina.
- Se pueden revelar celdas.
- Los números de minas adyacentes son correctos.
- Las zonas vacías se expanden correctamente.
- Se pueden colocar banderas.
- Se pueden eliminar banderas.
- Tap revela celdas en móvil.
- Long press coloca o elimina banderas en móvil.
- Click izquierdo revela en escritorio.
- Click derecho coloca o elimina banderas en escritorio.
- El contador funciona correctamente.
- El temporizador funciona correctamente.
- Revelar una mina provoca derrota.
- Revelar todas las celdas seguras provoca victoria.
- Se puede reiniciar la partida.
- Se puede cambiar de dificultad.
- La estética recuerda claramente al Minesweeper clásico.
- Beginner se puede jugar cómodamente desde un teléfono.
- Intermediate y Expert siguen siendo utilizables mediante un contenedor responsive/scrollable.
- El tablero no rompe el layout general de la aplicación.
- La lógica del juego permanece separada del DOM.

---

## 46. Pending Decisions

Las siguientes decisiones pueden definirse más adelante y no bloquean el inicio del desarrollo:

- Nombre definitivo de la aplicación.
- Diseño visual definitivo del catálogo.
- Assets/iconos exactos de Minesweeper.
- Estrategia de testing.
- Requisitos avanzados de accesibilidad.
- Deployment/hosting.

No es necesario profundizar en testing durante esta primera fase.
