# Minijuegos

Aplicación web de minijuegos rápidos, pensada primero para usarse desde un navegador móvil y también cómoda en tablet y escritorio. El alcance actual incluye Buscaminas (Minesweeper) y Snake, con una arquitectura simple que permite sumar juegos futuros sin acoplarlos entre sí.

## Experiencia

La ruta principal / muestra un catálogo responsive. Cada tarjeta contiene una representación visual, nombre, descripción y acceso para jugar. El catálogo incluye:

- Minesweeper — Classic Minesweeper, disponible en /games/minesweeper.
- Snake — Classic Snake, disponible en /games/snake.

Cada juego ofrece una acción clara para volver al catálogo. En móvil las tarjetas aparecen en una columna; en espacios mayores el catálogo puede crecer a varias columnas.

## Buscaminas

Minesweeper está inspirado en el Buscaminas clásico de Windows: panel gris, bordes con relieve, celdas elevadas u ocultas, celdas planas reveladas, números por color, contadores digitales y reinicio con cara.

| Dificultad | Tablero | Minas |
| --- | --- | ---: |
| Beginner | 9 × 9 | 10 |
| Intermediate | 16 × 16 | 40 |
| Expert | 30 × 16 | 99 |

La pantalla incluye selector de dificultad, contador de minas restantes, temporizador, reinicio, tablero y retorno al catálogo.

- En escritorio, clic izquierdo revela y clic derecho coloca o quita una bandera.
- En móvil, un toque revela y una pulsación prolongada de aproximadamente 500 ms alterna una bandera.
- Las celdas vacías expanden automáticamente su zona.
- La partida se gana al revelar todas las celdas sin minas y se pierde al revelar una mina.
- El primer clic no está protegido y puede contener una mina.
- Intermediate y Expert se desplazan dentro de su propio contenedor cuando no caben, sin provocar scroll horizontal de toda la página.

## Snake

Snake será el segundo juego de la plataforma y estará inspirado en la sensación retro, rápida y minimalista de los teléfonos Nokia clásicos. Tendrá un tablero lógico fijo de 20 × 20, cuadrado, centrado y completamente usable en teléfono, tablet y escritorio; no dependerá de scroll horizontal.

La partida se iniciará al recibir la primera dirección válida. La serpiente se moverá continuamente, atravesará los bordes para reaparecer por el lado opuesto y solo terminará al chocar con su propio cuerpo. Comer una comida en una celda libre aumentará la longitud, sumará un punto, generará una nueva comida y elevará gradualmente la velocidad hasta un máximo usable.

La pantalla incluirá score, reinicio, Pause / Resume y retorno al catálogo.

- En escritorio, las flechas controlan la dirección; W/A/S/D y Space o P pueden estar disponibles como atajos sencillos.
- En móvil, un swipe claro sobre el tablero cambia de dirección; los movimientos breves no se interpretan como controles.
- No se permiten giros directos de 180 grados.
- Una partida activa se pausa automáticamente al ocultarse la página y permanece pausada hasta que el jugador la reanude manualmente.
- La interfaz usará una estética LCD retro: tonos verdes/grisáceos, bloques para la serpiente, comida distinguible y controles compactos.

No habrá tamaños de tablero alternativos, obstáculos, power-ups, skins, high scores, leaderboard ni persistencia.

## Arquitectura

El código se organiza por feature y usa componentes standalone de Angular. La plataforma contiene catálogo, navegación y metadata de juegos. Cada juego posee sus propios modelos, configuración, servicio, UI y estilos.

    src/app/
    ├── platform/
    │   ├── catalog/
    │   ├── game-definition.model.ts
    │   └── game-registry.ts
    └── games/
        ├── minesweeper/
        │   ├── minesweeper-page.component.*
        │   ├── minesweeper-board.component.*
        │   ├── minesweeper-game.service.ts
        │   ├── minesweeper.models.ts
        │   └── minesweeper.config.ts
        └── snake/
            ├── snake-page.component.*
            ├── snake-board.component.*
            ├── snake-game.service.ts
            ├── snake.models.ts
            └── snake.config.ts

El catálogo se genera desde un Game Registry central. Minesweeper y Snake mantienen servicios y reglas independientes que usan Angular Signals. La UI interpreta clics, taps, long press, teclado, swipe o visibilidad y delega únicamente intenciones al servicio de su juego. Ninguna lógica de juego manipula el DOM ni depende del catálogo.

No se crearán GameEngine, BaseGame, AbstractGame, un sistema de plugins ni capas globales prematuras.

## Tecnologías

- Angular 22, TypeScript y componentes standalone.
- Angular Router para navegación y carga diferida de features.
- Angular Signals para el estado de Minesweeper y Snake.
- Tailwind CSS para layout y estilos generales; CSS específico para cada juego.
- Angular Material solo cuando simplifique claramente un control general de interfaz.

## Desarrollo local

Requisitos: Node.js y npm.

    npm install
    npm start

La aplicación queda disponible en http://localhost:4200/.

Para generar una compilación de producción:

    npm run build

## Alcance actual

Incluye la plataforma con catálogo, Minesweeper y Snake. Quedan fuera Pong, otros juegos, dificultad personalizada de Minesweeper, variantes avanzadas de Snake, autenticación, backend, base de datos, multiplayer, panel administrativo, monetización y funcionalidades persistentes.
