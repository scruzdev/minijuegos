# Roadmap de implementación

Este roadmap parte del proyecto actual: un scaffold de Angular 22 con Tailwind CSS configurado y sin features, rutas de producto ni lógica de juego. Las etapas se ejecutarán en orden para mantener el alcance de V1 y evitar abstracciones anticipadas.

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

## Límites arquitectónicos durante todas las etapas

- No crear directorios globales como `core/`, `shared/`, `utils/`, `common/`, `services/` o `stores/` sin una necesidad real ya presente.
- No crear `GameEngine`, `BaseGame`, `AbstractGame`, plugins ni contratos genéricos para juegos hipotéticos.
- No implementar Snake, Pong ni placeholders de juegos futuros.
- Mantener toda la lógica y UI específicas dentro de `games/minesweeper/`.
- Mantener `platform/` limitado al catálogo, navegación y metadata de juegos.
- No incorporar persistencia local, backend ni funcionalidades de puntuación en V1.
