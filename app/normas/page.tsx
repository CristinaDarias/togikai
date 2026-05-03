export default function NormasPage() {
  return (
    <section className="space-y-4">
      <h1 className="font-title text-5xl tracking-[0.14em] text-gold">Normas</h1>
      <div className="panel rounded-md p-6 text-zinc-300">
        <p className="mb-3">Reglamento base de la liga clandestina Togikai:</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Respeto absoluto al veredicto oficial de cada combate.</li>
          <li>El incumplimiento de peso o condiciones puede implicar sanción inmediata.</li>
          <li>Todo combate registrado en archivo es vinculante para ranking y puntos.</li>
          <li>Está prohibido alterar registros de la liga fuera del panel autorizado.</li>
          <li>Las disputas internas se resuelven en arena, no fuera de ella.</li>
        </ol>
      </div>
    </section>
  );
}
