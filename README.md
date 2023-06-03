### Antecedentes

Este repositorio contiene el código para el artículo TBD. 

### Cómo funciona

Este proyecto utiliza D3.js para la visualización. Para simular elecciones, el programa toma muestras de la distribución seleccionada (normal, bimodal, uniforme y sesgada) para decidir dónde se ubica cada votante en el espectro ideológico. Luego, el programa examina la ubicación de cada votante en relación con la posición de cada candidato en el espectro ideológico  el contexto de la votación, para determinar por qué candidatos votaría cada votante. La simulación incluye un factor de aleatoriedad para reflejar más exactamente la verdadera naturaleza de las elecciones.

#### Asignación de votos cuadráticos

El voto cuadrático es un sistema de votación que permite a los votantes expresar su intensidad de preferencia por las diferentes opciones, no sólo su opción preferida. Cada votante recibe una cantidad de "créditos" o puntos de voto que puede distribuir entre las opciones según su preferencia. Sin embargo, el coste de asignar múltiples créditos a una opción es cuadrático, lo que significa que asignar dos puntos a una opción cuesta cuatro unidades, tres créditos cuestan nueve unidades, y así sucesivamente. Esto permite a los votantes expresar preferencias fuertes, pero también incentiva a distribuir sus votos de manera más equitativa entre las opciones.

En el algoritmo se calculan todas las posibilidades de distribución de votos dados los puntos disponibles y las opciones de voto. Esto es un proceso computacionalmente intensivo dependiendo del número de opciones y puntos, ya que el número de posibles distribuciones puede ser muy grande. Pero para una simulación pequeña es viable.

Cada posible distribución de votos se puntúa de acuerdo a alguna medida de afinidad por las opciones. Este podría ser un indicador de cómo de bien se alinea una distribución de votos con las preferencias del votante.

Finalmente, el algoritmo selecciona la distribución de votos con el mayor puntaje como la "mejor" distribución de votos para ese votante. Esta sería la distribución que el votante utilizaría en una votación real.

Es importante tener en cuenta que este algoritmo tiene varias suposiciones y simplificaciones. Por ejemplo, supone que los votantes tienen una comprensión perfecta de sus propias preferencias y son capaces de asignar créditos de manera perfectamente racional para maximizar su afinidad. En la práctica, los votantes reales pueden tener preferencias más complejas y pueden no ser perfectamente racionales al asignar sus votos.


#### Distribuciones de ideologías votantes

1. **Distribución Normal (Gaussiana)**: En esta distribución, la mayoría de los votantes se sitúan en el centro del espectro ideológico, teniendo una ideología moderada, y la cantidad de votantes disminuye conforme nos alejamos hacia los extremos ideológicos. Esta distribución tiene la forma de una campana de Gauss y es simétrica en torno a su valor medio.

2. **Distribución con Dos Focos**: Esta distribución sugiere que hay dos grupos principales de votantes, cada uno centrado alrededor de un punto particular en el espectro ideológico, es decir, hay dos "picos" en la distribución. Esto puede indicar una sociedad polarizada en la que la mayoría de los votantes se identifican con uno de dos puntos de vista ideológicos opuestos.

3. **Distribución Uniforme**: En esta distribución, los votantes están igualmente repartidos a lo largo de todo el espectro ideológico. Esto puede sugerir una sociedad en la que no hay una ideología dominante y los votantes tienen una amplia variedad de puntos de vista.

4. **Distribución con Tendencia a un Lado**: En esta distribución, una mayor cantidad de votantes se concentra hacia un extremo del espectro ideológico. Esto puede sugerir una sociedad en la que una ideología en particular es más popular o aceptada que otras. Este tipo de distribución es asimétrica y tiene un "sesgo" hacia un lado del espectro.


#### Tipos de votantes


1. **Votante leal a un partido**: Este votante tiene un fuerte sentido de identidad partidista y siempre vota por el partido que le es más afín, independientemente de las circunstancias de la elección o los candidatos específicos.

2. **Votante flexible**: Este votante tiene varios partidos que considera afines y está dispuesto a votar por cualquiera de ellos, dependiendo de las circunstancias de la elección y de los candidatos específicos. Su voto no es necesariamente para el partido que considera más afín.

3. **Votante aleatorio**: Este votante no tiene una fuerte identidad partidista y es capaz de votar por una amplia gama de partidos, incluso algunos que no considera particularmente afines. Su elección de voto puede ser muy impredecible y puede estar influenciada por una variedad de factores, incluyendo las cuestiones de la elección, los candidatos específicos, la cobertura mediática y las opiniones de las personas de su entorno.

4. **Votante en blanco**: Este votante elige expresamente no votar por ningún partido o candidato y en su lugar emite un voto en blanco. Esto puede ser una protesta contra todas las opciones disponibles, una expresión de descontento con el sistema político en general, o simplemente una elección de no participar activamente en la elección de un candidato o partido.

Estas categorías son generalizaciones y muchos votantes pueden encajar en más de una categoría. Además, el comportamiento de los votantes puede cambiar a lo largo del tiempo debido a factores como los cambios en su vida personal, el clima político y las cuestiones en juego en las elecciones.


#### Contexto


1. **Estabilidad Alta**: En este contexto, se refiere a una situación en la que las condiciones económicas, políticas y sociales son generalmente positivas y predecibles. Los cambios son graduales y generalmente se anticipan con suficiente antelación. En un escenario de alta estabilidad, los votantes pueden sentirse más seguros y confiados en sus decisiones de voto, y puede haber menos fluctuaciones en las preferencias de voto.

2. **Estabilidad Moderada**: Este es un escenario intermedio en el que hay cierto grado de incertidumbre y cambio, pero también cierta previsibilidad y continuidad. Las condiciones económicas, políticas y sociales pueden estar en un estado de cambio moderado, y los votantes pueden cambiar sus preferencias de voto en respuesta a estos cambios, pero no necesariamente de manera radical o impredecible.

3. **Estabilidad Baja**: Este es un escenario en el que hay una gran cantidad de incertidumbre y cambio. Las condiciones económicas, políticas y sociales pueden ser volátiles y cambiar rápidamente y de formas impredecibles. En un escenario de baja estabilidad, los votantes pueden sentirse inseguros y confundidos, y las preferencias de voto pueden fluctuar ampliamente.

Estos son términos generalizados y la estabilidad puede variar ampliamente en diferentes contextos y para diferentes personas. Además, la percepción de la estabilidad también puede ser subjetiva y puede variar entre diferentes individuos y grupos.

#### Contexto x Votante

Tabla hipotética con la distribución de estos cuatro tipos de votantes en relación con los niveles de estabilidad (alta, moderada, baja). No reflejan ninguna población de votantes real.

|                        | Estabilidad Alta | Estabilidad Moderada | Estabilidad Baja |
|------------------------|-----------------|----------------------|------------------|
| Votante leal a un partido | 50%            | 30%                 | 10%              |
| Votante flexible   | 30%            | 40%                 | 25%              |
| Votante aleatorio  | 19%            | 25%                 | 55%              |
| Votante en blanco  | 1%             | 5%                 | 10%              |

Para obtener datos precisos, sería necesario realizar encuestas y análisis estadísticos en la población de votantes específica que te interesa.

### Reconocimientos

Este proyecto esta basado en el proyecto creado para la clase SARC 5400: Visualización de Datos, impartida por el profesor Eric Field en la Universidad de Virginia https://github.com/ranked-vote
