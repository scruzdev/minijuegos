# Minijuegos

Aplicación web de minijuegos rápidos, pensada primero para usarse desde un navegador móvil y también cómoda en tablet y escritorio. La primera versión incluirá únicamente **Buscaminas (Minesweeper)**, con una arquitectura sencilla que permita sumar nuevos juegos más adelante sin acoplarlos entre sí.

## Experiencia final

Al abrir la aplicación, la ruta `/` mostrará un catálogo de juegos responsive. Cada juego aparecerá como una tarjeta con una representación visual, nombre, descripción breve y una acción para jugar. En esta versión el catálogo tendrá una sola tarjeta: **Minesweeper — Classic Minesweeper**.

La tarjeta llevará a `/games/minesweeper`. Desde esa pantalla habrá una acción clara para volver al catálogo.

La interfaz deberá adaptarse al espacio disponible:

- En móvil, el catálogo mostrará tarjetas cómodas en una columna.
- En tablet y escritorio, el catálogo podrá crecer a varias columnas cuando existan más juegos.
- La pantalla del juego mantendrá los controles dentro del viewport.
- Los tableros que no quepan, especialmente Intermediate y Expert en móvil, se desplazarán dentro de su propio contenedor; la página no tendrá scroll horizontal provocado por el tablero.

## Buscaminas

El juego estará inspirado en el Buscaminas clásico de Windows: fondo gris, bordes con relieve, celdas elevadas mientras están ocultas, celdas planas al revelarse, números por color, contadores digitales y un botón de reinicio con cara.

La pantalla incluirá:

- Selector de dificultad: Beginner, Intermediate y Expert.
- Contador de minas restantes (`minas totales - banderas colocadas`).
- Temporizador en segundos.
- Botón central de reinicio, que conserva la dificultad y genera una partida nueva.
- Tablero y acceso para volver al catálogo.

| Dificultad | Tablero | Minas |
| --- | --- | ---: |
| Beginner | 9 × 9 | 10 |
| Intermediate | 16 × 16 | 40 |
| Expert | 30 × 16 | 99 |

### Cómo se juega

- En escritorio, clic izquierdo revela una celda y clic derecho coloca o quita una bandera, sin abrir el menú contextual del navegador.
- En móvil, un toque revela una celda y una pulsación prolongada de aproximadamente 500 ms coloca o quita una bandera.
- La pulsación prolongada se cancelará al desplazarse, mover el puntero de forma significativa o cancelar la interacción, para evitar banderas accidentales.
- Las celdas vacías expanden automáticamente su zona y revelan las celdas numeradas del borde.
- Una partida se gana al revelar todas las celdas sin minas; no es necesario marcar todas las minas.
- Al revelar una mina se pierde, se muestran las minas y el tablero deja de aceptar acciones.
- El primer clic **no está protegido**: puede revelar una mina y terminar la partida.
- El temporizador comienza con la primera acción de juego y se detiene al ganar o perder.

No habrá cuentas, backend, puntuaciones, mejores tiempos, historial ni persistencia. Salir del juego o recargar la página puede descartar la partida actual.

## Arquitectura prevista

El código se organizará por feature y con componentes standalone de Angular. La plataforma conocerá el catálogo, la navegación y los metadatos de los juegos; cada juego será dueño de sus propios componentes, modelos, lógica y estilos.

```text
src/app/
├── platform/
│   ├── catalog/
│   ├── game-definition.model.ts
│   └── game-registry.ts
└── games/
    └── minesweeper/
        ├── minesweeper-page.component.*
        ├── minesweeper-board.component.*
        ├── minesweeper-game.service.ts
        ├── minesweeper.models.ts
        └── minesweeper.config.ts
```

El catálogo se construirá a partir de un registro central de definiciones de juego. Añadir un juego futuro consistirá en crear su feature y ruta, y agregar su metadata al registro. No se crearán ahora juegos vacíos, una capa genérica de motores de juego ni un sistema de plugins.

El estado y las reglas de Buscaminas vivirán en un servicio propio de la feature y usarán Angular Signals. La UI detectará clics, taps y long press, pero delegará las acciones y reglas al servicio. La lógica del juego no manipulará el DOM ni dependerá del catálogo.

## Tecnologías

- Angular 22, TypeScript y componentes standalone.
- Angular Router para la navegación y carga diferida cuando resulte práctica.
- Angular Signals para el estado de Buscaminas.
- Tailwind CSS para layout y estilos generales; CSS específico para el aspecto retro del juego.
- Angular Material solo si aporta valor claro a algún control general de interfaz.

## Desarrollo local

Requisitos: Node.js y npm.

```bash
npm install
npm start
```

La aplicación quedará disponible en `http://localhost:4200/`.

Para generar una compilación de producción:

```bash
npm run build
```

## Alcance de V1

Incluye la plataforma con catálogo y Buscaminas. Quedan explícitamente fuera de esta versión Snake, Pong, otros juegos, dificultad personalizada, autenticación, backend, base de datos, multiplayer, panel administrativo, monetización y funcionalidades persistentes.
