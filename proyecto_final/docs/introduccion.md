# Introducción

## Nombre del juego

**Duelo de Naves**

## Cómo se juega

Dos jugadores comparten el mismo dispositivo y se enfrentan en un combate por turnos entre
dos naves. En cada ronda, primero elige el Jugador 1 (en secreto, mirando su pantalla),
luego el Jugador 2 hace lo mismo. Cuando ambos eligieron, la pantalla envía las dos
decisiones al servidor, que calcula el resultado de la ronda (quién golpea, cuánto daño,
si hubo un golpe crítico) y devuelve el nuevo estado de la partida. La interfaz anima un
proyectil que viaja de una nave a la otra y actualiza las barras de vida y energía.

Cada jugador elige entre tres acciones con consecuencias distintas:

- **Atacar**: gasta 20 de energía e inflige daño al rival, salvo que este se haya defendido.
- **Defender**: no gasta energía, pero bloquea por completo el daño que reciba esa ronda.
- **Cargar**: no ataca, mientras recupera energía para poder atacar en una ronda futura.

La partida termina cuando la vida de un jugador llega a 0 (gana el otro), quedan los dos a
0 en la misma ronda (empate) o se llega a la ronda límite sin un vencedor claro (empate o
gana quien tenga más vida).

## Propósito y experiencia de juego

El proyecto busca demostrar el flujo completo pedido por la certificación: una decisión del
jugador (elegir una acción) viaja al servidor, el servidor aplica las reglas del juego y
decide (incluyendo un factor aleatorio de golpe crítico), y React solamente representa el
resultado que Express calculó. El jugador experimenta un combate corto (varias rondas,
2-4 minutos) con decisiones reales: no hay un botón "ganador" que se pueda presionar sin
pensar, porque atacar sin energía es rechazado por el servidor y defender sin necesidad
desperdicia el turno.

## Jugadores

- **Cantidad**: 2.
- **Tipo**: humanos, en el mismo dispositivo (pasando el control tras elegir cada uno su
  acción). No hay modo contra el backend ni contra una IA en esta entrega.
