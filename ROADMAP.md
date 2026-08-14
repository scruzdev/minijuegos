# Roadmap de implementación

Las etapas 0 a 6 recogen la implementación ya completada de la plataforma y Minesweeper. La etapa 7 incorpora Snake como segundo juego, respetando la misma organización por feature y evitando abstracciones anticipadas.

## Etapa 0 — Preparación del scaffold

- Sustituir el placeholder inicial de Angular por el punto de montaje mínimo de la aplicación.
- Establecer estilos globales base para tipografía, viewport y comportamiento responsive.
- Confirmar que Tailwind CSS se use para layout y estilos generales, reservando CSS específico para el aspecto de Buscaminas.
- Mantener Angular Material fuera de la implementación salvo que simplifique de forma evidente un control de interfaz concreto.

**Resultado:** una base limpia, ejecutable y sin UI de ejemplo de Angular.

## Etapa 1 — Plataforma y navegación

- Crear la feature `platform/` con el modelo `GameDefinition` y un registro central de juegos.
- Registrar únicamente Minesweeper con su id, nombre, descripción y ruta.
- Crear la página de catálogo que renderice tarjetas desde el registro, sin codificar una tarjeta de Minesweeper manualmente.
- Configurar las rutas `/` y `/games/minesweeper`.
- Preparar la ruta de Minesweeper para carga diferida cuando sea práctica.
- Incorporar navegación visible desde el juego de vuelta al catálogo.

**Resultado:** se puede recorrer catálogo → Minesweeper → catálogo, manteniendo la plataforma independiente de la lógica interna del juego.

## Etapa 2 — Base funcional de Buscaminas

- Crear la feature `games/minesweeper/` con modelos, configuración de dificultades, servicio y componentes necesarios.
- Centralizar las dificultades Beginner (9×9, 10 minas), Intermediate (16×16, 40) y Expert (30×16, 99).
- Implementar el servicio de juego con Angular Signals para tablero, estado, dificultad, tiempo y valores derivados.
- Generar un tablero nuevo con minas aleatorias y calcular correctamente minas adyacentes.
- Soportar estados `ready`, `playing`, `won` y `lost`.
- Implementar el reinicio y el cambio de dificultad, ambos con generación de una partida nueva según corresponda.

**Resultado:** una partida de Buscaminas puede inicializarse y su estado está aislado del DOM y de la plataforma.

## Etapa 3 — Reglas completas del juego

- Revelar celdas ocultas no marcadas y permitir que el primer clic pueda ser una mina, sin lógica de protección.
- Implementar la expansión iterativa de celdas vacías y la revelación de sus bordes numerados.
- Implementar colocar y retirar banderas solo en celdas ocultas.
- Calcular el contador de minas restantes a partir de minas totales menos banderas colocadas.
- Determinar la victoria al revelar todas las celdas seguras, sin exigir banderas en minas.
- Determinar la derrota al revelar una mina, mostrar todas las minas y bloquear nuevas acciones.
- Iniciar el temporizador en la primera acción de partida, incrementarlo por segundos y detenerlo al ganar o perder.

**Resultado:** las reglas clásicas requeridas quedan concentradas en el servicio de Minesweeper y son independientes de la presentación.

## Etapa 4 — Interacciones de escritorio y móvil

- Renderizar el tablero desde el estado expuesto por el servicio.
- Añadir clic izquierdo para revelar y clic derecho para alternar bandera, evitando el menú contextual sobre celdas.
- Añadir interacción por puntero: tap revela y long press de aproximadamente 500 ms alterna bandera.
- Evitar que el `pointer up` posterior a un long press revele la celda.
- Cancelar un long press ante cancelación, scroll, movimiento relevante o pérdida de la interacción.
- Mantener la detección de gestos en el componente de tablero y delegar las acciones al servicio.

**Resultado:** Buscaminas es completamente jugable con mouse y pantalla táctil sin mezclar gestos con reglas de negocio.

## Etapa 5 — Diseño retro y responsive

- Construir el panel de juego retro: fondo gris, bordes bevel, contadores digitales, temporizador, selector y botón de cara para reiniciar.
- Diferenciar visualmente celdas ocultas, reveladas, banderas, minas y números por color.
- Garantizar que Beginner mantenga celdas cómodas y no requiera scroll horizontal en un teléfono convencional.
- Encapsular Intermediate y Expert en un contenedor de tablero desplazable, preservando un tamaño de celda utilizable.
- Verificar que el tablero nunca fuerce scroll horizontal en la página completa.
- Ajustar catálogo, controles y tablero para móvil, tablet y escritorio.

**Resultado:** una experiencia compacta y reconocible de Buscaminas, con móvil como requisito de primera clase.

## Etapa 6 — Verificación y cierre de V1

- Ejecutar la compilación de producción y corregir errores de integración.
- Comprobar rutas, catálogo basado en registro y retorno al catálogo.
- Validar dimensiones, cantidad de minas, contador, temporizador, reinicio y cambio de dificultad.
- Probar victoria, derrota, expansión de vacíos, flags, mouse, tap y long press.
- Hacer una revisión manual responsive para tamaños móviles, tablet y escritorio.
- Confirmar que no se hayan añadido persistencia, puntuaciones, juegos futuros, dificultad personalizada ni abstracciones de juego no requeridas.

**Resultado:** cumplimiento de las definiciones de terminado de Platform V1 y Minesweeper V1 indicadas en `SPECS.md`.

## Etapa 7 — Snake como segundo juego

### 7.1 — Integración de plataforma

- Añadir la metadata de Snake al Game Registry con id, nombre, descripción y ruta /games/snake.
- Crear la ruta lazy de Snake usando el mismo patrón de Angular Router que Minesweeper.
- Hacer que el catálogo muestre ambas tarjetas desde el registro, sin condicionar el template a un juego concreto.
- Proporcionar una navegación visible de vuelta al catálogo desde la página de Snake.

**Resultado:** se puede recorrer catálogo → Snake → catálogo y Minesweeper permanece aislado e intacto.

### 7.2 — Feature, modelos y estado inicial

- Crear games/snake/ con modelos, configuración, servicio y los componentes de página/tablero que aporten claridad.
- Centralizar el tablero fijo de 20 × 20 y los valores de velocidad inicial, incremento y velocidad máxima en la configuración de Snake.
- Definir posiciones, direcciones y estados ready, playing, paused y lost dentro de la feature.
- Crear un servicio de Snake provisto por la feature y gestionado con Angular Signals para serpiente, comida, dirección, estado, score y velocidad.
- Inicializar una serpiente corta y una comida en una celda libre al entrar o reiniciar, sin persistencia.

**Resultado:** Snake tiene un tablero preparado inmediatamente y un estado propio, independiente de Minesweeper, del DOM y del catálogo.

### 7.3 — Reglas, movimiento y game loop

- Implementar el loop de juego únicamente mientras el estado sea playing; limpiarlo al pausar, perder, reiniciar, abandonar o destruir la feature.
- Mover la serpiente una celda por tick en su dirección actual.
- Aplicar wrap-around en las cuatro fronteras; los bordes no causan derrota.
- Ignorar los giros directos de 180 grados.
- Detectar la colisión de la cabeza con el propio cuerpo, cambiar a lost y detener el loop inmediatamente.
- Generar comida solo en celdas libres, crecer sin eliminar la cola al comer, aumentar el score y crear una nueva comida.
- Reducir el intervalo de tick gradualmente por comida hasta la velocidad máxima permitida.

**Resultado:** el juego central de Snake funciona de forma determinista y sus reglas viven exclusivamente en el servicio.

### 7.4 — Controles y ciclo de vida

- Conectar Arrow Keys como controles de escritorio y admitir W/A/S/D si se mantiene simple.
- Implementar el botón visible de Pause / Resume y los atajos opcionales Space o P.
- Pausar automáticamente una partida activa al recibir visibilitychange con la página oculta; conservar el estado y exigir reanudación manual al volver.
- Detectar swipes sobre el tablero para móvil, con umbral de distancia y dirección dominante.
- Evitar que un swipe de control provoque scroll accidental de la página.
- Mantener la interpretación de teclado, swipe y visibilidad en los componentes; el servicio recibirá únicamente intenciones como cambio de dirección, pausa o reanudación.

**Resultado:** Snake se controla íntegramente con teclado o touch y conserva correctamente una partida pausada.

### 7.5 — UI retro y responsive

- Crear una página compacta con score, estado, reinicio, Pause / Resume y acceso al catálogo.
- Renderizar un tablero 20 × 20 centrado, cuadrado y completamente visible sin scroll horizontal en teléfono.
- Adaptar solo el tamaño visual de las celdas al viewport, manteniendo las 20 × 20 celdas lógicas en todos los dispositivos.
- Aplicar una estética Nokia inspirada en LCD: paleta verde/gris, bloques para serpiente, comida distinguible, bordes simples y tipografía retro cuando aporte valor.
- Verificar la usabilidad en móvil, tablet y escritorio sin afectar el estilo retro de Minesweeper.

**Resultado:** Snake es reconocible, rápido de iniciar y cómodo en una pantalla táctil.

### 7.6 — Validación de alcance

- Añadir pruebas unitarias de configuración, dirección, wrap-around, colisión, crecimiento, comida, score, velocidad y pausa/reanudación.
- Ejecutar build de producción y pruebas de la aplicación.
- Comprobar manualmente catálogo, navegación, teclado, swipe, pausa por visibilidad y layout responsive de Snake.
- Volver a validar todas las funciones existentes de Minesweeper: rutas, dificultades, flags, revelado, temporizador, reinicio y contenedor responsive.
- Confirmar que no se hayan introducido persistencia, dificultades de Snake, obstáculos, power-ups, Pong ni capas genéricas de motor de juegos.

**Resultado:** se cumplen las definiciones de terminado de Snake y de la plataforma actualizada, preservando Minesweeper.

## Límites arquitectónicos durante todas las etapas

- No crear directorios globales como `core/`, `shared/`, `utils/`, `common/`, `services/` o `stores/` sin una necesidad real ya presente.
- No crear `GameEngine`, `BaseGame`, `AbstractGame`, plugins ni contratos genéricos para juegos hipotéticos.
- No implementar Pong ni placeholders de juegos futuros.
- Mantener toda la lógica y UI específicas dentro de su propia feature: `games/minesweeper/` o `games/snake/`.
- Mantener `platform/` limitado al catálogo, navegación y metadata de juegos.
- No incorporar persistencia local, backend ni funcionalidades de puntuación en V1.
