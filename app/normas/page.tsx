export default function NormasPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-title text-5xl tracking-[0.14em] text-gold">Información</h1>
      <div className="panel rounded-md p-6 text-zinc-300">
        <p className="mb-3 text-xl text-blood">INFORMACIÓN BÁSICA</p>
        <p className="mb-3">En este apartado se detallan los diferentes aspectos relacionados con la participación dentro de la Togikai.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>La inscripción tendrá un coste de 5.000$ por luchador.</li>
          <li>Cada temporada de la Togikai tendrá una duración de 4 semanas. Una vez finalizada la temporada, la tabla de clasificación y las puntuaciones serán reiniciadas para el inicio de la siguiente.</li>
          <li>Los premios serán entregados al finalizar cada temporada según el rendimiento de los luchadores durante la competición.</li>
          <li>Las recompensas estarán destinadas a los 3 mejores puestos de la clasificación general. En caso de empate en cualquiera de las posiciones premiadas, el número de recompensas se ampliará para incluir a todos los luchadores empatados.</li>
        </ol>
        <p className="mt-4">Cualquier duda, reclamación o consulta podrá ser tratada directamente con la organización.</p>
      </div>      
      <h1 className="font-title text-5xl tracking-[0.14em] text-gold">Premios y Recompensas</h1>
      <div className="panel rounded-md p-6 text-zinc-300">
        <p className="mb-3 text-xl text-blood">COMBATES DE LA TOGIKAI</p>
        <p className="mb-3">Premios.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Primer premio: 25.000$ + Premio Exclusivo Togikai + 5 Soulbits</li>
          <li>Segundo premio: 20.000$</li>
          <li>Tercer premio: 15.000$</li>
        </ol>
        <p className="mt-4">El premio exclusivo Togikai será entregado al ganador del primer puesto y consistirá en un objeto único relacionado con la competición.</p>
      </div>      
      <div className="panel rounded-md p-6 text-zinc-300">
        <p className="mb-3 text-xl text-blood">COMBATES ESPECIALES</p>
        <p className="mb-3">Las recompensas para los combates especiales serán determinadas por la organización y anunciadas antes del inicio de cada evento.</p>
      </div>
      <h1 className="font-title text-5xl tracking-[0.14em] text-gold">Normas</h1>
      <div className="panel rounded-md p-6 text-zinc-300">
        <p className="mb-3 text-xl text-blood">JUEGO LIMPIO Y RESPETO</p>
        <p className="mb-3">La Togikai es un lugar donde demostrar fuerza, disciplina y honor a través del combate. Cualquier conflicto personal, rivalidad entre luchadores o disputas entre bandas deberá permanecer fuera de la arena.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Todos los participantes aceptan dejar sus conflictos externos fuera del recinto.</li>
          <li>No se tolerarán altercados, amenazas, emboscadas o enfrentamientos ajenos a los combates organizados.</li>
          <li>Las únicas peleas autorizadas serán aquellas aprobadas por Akuma-tachi.</li>
          <li>Cualquier intento de sabotear un combate, interferir en el desarrollo del evento o generar disturbios podrá suponer la expulsión inmediata del luchador, sus acompañantes o incluso de toda la organización a la que pertenezcan.</li>
          <li>El respeto hacia árbitros, organizadores y asistentes es obligatorio en todo momento.</li>
        </ol>
        <p className="mt-4">Dentro de la Togikai, todos los luchadores compiten en igualdad de condiciones. El honor del combate está por encima de cualquier guerra externa.</p>
      </div>
      <div className="panel rounded-md p-6 text-zinc-300">
        <p className="mb-3 text-xl text-blood">NORMATIVA DE COMBATE</p>
        <p className="mb-3">Con el fin de garantizar enfrentamientos justos y equilibrados, todos los participantes deberán respetar las siguientes normas:</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Queda prohibido el uso de vendas, estimulantes o cualquier elemento que otorgue ventajas físicas durante el combate.</li>
          <li>En caso de que la organización sospeche del uso de estimulantes previos al combate, se podrán tomar medidas disciplinarias.</li>
          <li>Todos los luchadores serán cacheados antes de cada enfrentamiento para verificar el cumplimiento de esta norma.</li>
          <li>El uso de armas está totalmente prohibido dentro de la arena, salvo en eventos especiales autorizados por la organización.</li>
          <li>No se permite el abuso de mecánicas conocidas como “metralleta”, entendidas como golpes continuos sin dar margen de reacción al rival.</li>
          <li>No está permitido golpear mientras se corre.</li>
          <li>No está permitido mantener la guardia alta más de 5 o 6 segundos.</li>
          <li>No se permite combatir utilizando vista en primera persona.</li>
          <li>Los luchadores deberán respetar en todo momento las indicaciones de árbitros y organizadores.</li>
        </ol>
        <p className="mt-4">El incumplimiento de cualquiera de estas normas podrá suponer la descalificación inmediata del combate, además de sanciones o expulsión de futuros eventos.</p>
        <p className="mt-4">La Togikai prioriza la habilidad, la resistencia y el honor del combate por encima de cualquier ventaja externa.</p>
      </div>
      <div className="panel rounded-md p-6 text-zinc-300">
        <p className="mb-3 text-xl text-blood">SISTEMA DE APUESTAS</p>
        <p className="mb-3">Antes de cada evento, la organización designará a un encargado de apuestas autorizado por Akuma-tachi.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Todas las apuestas deberán realizarse exclusivamente en mano y a través de dicha persona antes del inicio del combate.</li>
          <li>Los asistentes podrán apostar por el luchador que deseen dentro del tiempo establecido por la organización.</li>
          <li>Una vez iniciado el combate, no se admitirán nuevas apuestas ni modificaciones sobre las ya realizadas.</li>
          <li>Finalizado el enfrentamiento, el encargado de apuestas entregará las ganancias correspondientes a los vencedores de cada apuesta.</li>
          <li>Cualquier intento de manipulación, fraude o conflicto relacionado con las apuestas podrá suponer la expulsión inmediata del evento.</li>
        </ol>
        <p className="mt-4">Las decisiones de la organización respecto a las apuestas serán definitivas e inapelables.</p>
      </div>
    </section>
  );
}
