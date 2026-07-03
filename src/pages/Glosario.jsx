const SOS = [
  { code: 'SO1', name: 'Resolución de problemas complejos de ingeniería',
    desc: 'Capacidad para identificar, formular y resolver problemas complejos de ingeniería aplicando principios de ciencias naturales, matemáticas y ciencias de ingeniería.' },
  { code: 'SO2', name: 'Diseño de ingeniería',
    desc: 'Capacidad para diseñar un sistema, componente o proceso que satisfaga necesidades deseadas dentro de restricciones realistas tales como económicas, ambientales, sociales, políticas, éticas, de salud y seguridad, manufacturabilidad y sostenibilidad.' },
  { code: 'SO3', name: 'Comunicación',
    desc: 'Capacidad para comunicarse efectivamente con una variedad de audiencias, tanto en forma oral como escrita, usando medios apropiados al contexto.' },
  { code: 'SO4', name: 'Ética y responsabilidad profesional',
    desc: 'Capacidad para reconocer responsabilidades éticas y profesionales en situaciones de ingeniería y tomar decisiones informadas considerando el impacto de las soluciones en contextos globales, económicos, ambientales y sociales.' },
  { code: 'SO5', name: 'Trabajo en equipo',
    desc: 'Capacidad para funcionar eficazmente en un equipo cuyos miembros juntos proporcionan liderazgo, crean un ambiente colaborativo e inclusivo, establecen metas, planifican tareas y cumplen objetivos.' },
  { code: 'SO6', name: 'Análisis de datos experimentales',
    desc: 'Capacidad para desarrollar y realizar experimentos apropiados, analizar e interpretar datos y usar el juicio de ingeniería para sacar conclusiones.' },
  { code: 'SO7', name: 'Aprendizaje autónomo',
    desc: 'Capacidad para adquirir y aplicar nuevo conocimiento según sea necesario, usando estrategias de aprendizaje apropiadas.' },
]

const NIVELES = [
  { level: 1, label: 'Bajo',            color: 'bg-red-100 text-red-700 border-red-200',
    desc: 'El estudiante no demuestra los conocimientos o habilidades esperadas para el indicador. Requiere intervención y acompañamiento adicional.' },
  { level: 2, label: 'En desarrollo',   color: 'bg-orange-100 text-orange-700 border-orange-200',
    desc: 'El estudiante muestra avances parciales pero aún no alcanza el desempeño esperado. Necesita refuerzo en aspectos específicos.' },
  { level: 3, label: 'Satisfactorio',   color: 'bg-lime-100 text-lime-700 border-lime-200',
    desc: 'El estudiante cumple con los criterios de desempeño esperados para el indicador. Nivel mínimo aceptable para ABET.' },
  { level: 4, label: 'Sobresaliente',   color: 'bg-green-100 text-green-700 border-green-200',
    desc: 'El estudiante supera los criterios esperados y demuestra un dominio excepcional del indicador de desempeño.' },
]

const TERMINOS = [
  {
    term: 'ABET',
    full: 'Accreditation Board for Engineering and Technology',
    desc: 'Organismo internacional de acreditación que evalúa programas de ingeniería, tecnología, computación y ciencias aplicadas. La acreditación ABET certifica que un programa cumple con estándares de calidad reconocidos globalmente y que los graduados poseen las competencias necesarias para la práctica profesional.',
  },
  {
    term: 'Ciclo de Mejora Continua',
    full: '',
    desc: 'Proceso sistemático mediante el cual el programa evalúa periódicamente el logro de sus Student Outcomes, identifica brechas, implementa acciones correctivas y verifica su efectividad. Este ciclo garantiza la mejora permanente de la calidad educativa.',
  },
  {
    term: 'Performance Indicator (PI)',
    full: 'Indicador de Desempeño',
    desc: 'Comportamiento o habilidad específica y medible que evidencia el logro de un Student Outcome. Cada SO se descompone en uno o varios PIs para facilitar su medición en los cursos del programa. Un PI puede ser evaluado por múltiples asignaturas.',
  },
  {
    term: 'Program Educational Objectives (PEO)',
    full: 'Objetivos Educativos del Programa',
    desc: 'Declaraciones amplias que describen los logros esperados de los egresados entre 3 y 5 años después de su graduación. Se enfocan en el impacto profesional y social a mediano plazo, y son definidos conjuntamente con los grupos de interés del programa.',
  },
  {
    term: 'Medición Formativa',
    full: '',
    desc: 'Evaluación realizada durante el proceso de aprendizaje con el propósito de monitorear el progreso del estudiante y proporcionar retroalimentación para mejorar. No necesariamente tiene un valor sumativo en la calificación final (ej. talleres, quices, actividades en clase).',
  },
  {
    term: 'Medición Sumativa',
    full: '',
    desc: 'Evaluación realizada al final de una unidad o curso para medir el nivel de logro alcanzado por el estudiante. Tiene impacto en la calificación final y permite determinar si se cumplió con el estándar mínimo del indicador (ej. exámenes finales, proyectos, informes de laboratorio).',
  },
  {
    term: 'Meta del 75%',
    full: 'Umbral de cumplimiento ABET',
    desc: 'Estándar mínimo de aprobación adoptado por el programa: al menos el 75% de los estudiantes evaluados deben alcanzar nivel 3 (Satisfactorio) o nivel 4 (Sobresaliente) en cada indicador de desempeño. Si no se alcanza este umbral, se debe formular e implementar una acción de mejora.',
  },
  {
    term: 'Acción de mejora',
    full: '',
    desc: 'Intervención curricular, pedagógica o administrativa que se implementa cuando un indicador no alcanza la meta del 75%. Puede incluir ajustes en la metodología de enseñanza, recursos adicionales, revisión de contenidos o rediseño de actividades evaluativas. Debe quedar documentada y ser evaluada en el siguiente ciclo.',
  },
]

export default function Glosario() {
  return (
    <div className="space-y-8 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-sabana-900">Glosario ABET</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Términos y conceptos clave del proceso de acreditación del programa de Ingeniería Industrial.
        </p>
      </div>

      {/* Términos generales */}
      <section>
        <h2 className="text-base font-semibold text-sabana-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-sabana-800 rounded-full inline-block"/>
          Conceptos del proceso de acreditación
        </h2>
        <div className="space-y-3">
          {TERMINOS.map(t => (
            <div key={t.term} className="card">
              <div className="flex flex-wrap items-baseline gap-2 mb-1">
                <span className="font-bold text-sabana-900 text-sm">{t.term}</span>
                {t.full && <span className="text-xs text-gray-400 italic">{t.full}</span>}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Student Outcomes */}
      <section>
        <h2 className="text-base font-semibold text-sabana-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-sabana-800 rounded-full inline-block"/>
          Student Outcomes (SO) — Resultados de Aprendizaje
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Competencias que los estudiantes deben haber desarrollado al momento de su graduación, según los criterios ABET adoptados por el programa.
        </p>
        <div className="space-y-2">
          {SOS.map(so => (
            <div key={so.code} className="card flex gap-4">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg
                                 bg-sabana-900 text-white text-xs font-bold">
                  {so.code}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{so.name}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{so.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Escala de evaluación */}
      <section>
        <h2 className="text-base font-semibold text-sabana-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-sabana-800 rounded-full inline-block"/>
          Escala de Evaluación — Niveles de Desempeño
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NIVELES.map(n => (
            <div key={n.level} className={`card border ${n.color.replace('bg-', 'border-').split(' ')[0].replace('text-', '').replace('border-', 'border-')}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border font-bold text-sm ${n.color}`}>
                  {n.level}
                </span>
                <span className={`font-semibold text-sm ${n.color.split(' ')[1]}`}>{n.label}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-sabana-50 rounded-lg border border-sabana-100">
          <p className="text-xs text-sabana-800 font-medium">
            Meta ABET: al menos el <strong>75%</strong> de los estudiantes deben alcanzar nivel <strong>3 – Satisfactorio</strong> o <strong>4 – Sobresaliente</strong> en cada indicador de desempeño.
          </p>
        </div>
      </section>

    </div>
  )
}
