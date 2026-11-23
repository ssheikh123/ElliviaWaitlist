// Spanish translation of the privacy policy in PolicyEn.tsx. Change both together.
import { homeHref, privacyHref } from '../config.ts'
import { withLang } from '../i18n/lang.tsx'
import { B, Contact, L, Part, PUBLIC_URL, Section } from './parts.tsx'

export const PRIVACY_LAST_UPDATED_ES = '16 de noviembre de 2026'

export function PolicyEs() {
  return (
    <>
      <h1 className="text-[36px] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[44px]">
        Política de privacidad de Ellivia
      </h1>
      <p className="mt-3 text-muted">Fecha de entrada en vigor: {PRIVACY_LAST_UPDATED_ES}</p>
      <p className="mt-2 text-muted">
        Se aplica a la app Ellivia para iPhone (versión 1.0 y posteriores) y al sitio web y la lista de espera de
        Ellivia en <L href={withLang(homeHref, 'es')}>ssheikh123.github.io/ElliviaWaitlist</L>.
      </p>
      <p className="mt-2 text-muted">
        Esta es una traducción al español de nuestra{' '}
        <L href={withLang(privacyHref, 'en')} lang="en">
          política de privacidad en inglés
        </L>
        . Si hay alguna diferencia entre las dos versiones, prevalece la versión en inglés.
      </p>

      <Section title="En resumen">
        <p>
          <B>La app Ellivia</B>
        </p>
        <ul>
          <li>La app funciona completamente en su iPhone. No hay cuentas, servidores, analíticas, anuncios ni rastreo.</li>
          <li>
            Nunca vemos sus respuestas, sus facturas ni sus resultados. Nada de lo que usted ingresa en la app se nos
            envía a nosotros, a Rush ni a nadie más.
          </li>
          <li>
            Sus respuestas al cuestionario, como sus ingresos y el tamaño de su hogar, se borran en cuanto se muestra
            su resultado.
          </li>
          <li>
            La app guarda solo un pequeño registro en su teléfono: cuándo hizo la verificación, el resultado, su fecha
            límite para presentar la solicitud, a qué hospital de Rush contactar y los documentos que eligió en su
            lista.
          </li>
          <li>Las fotos y los archivos de facturas se leen en su teléfono y luego se descartan. Nunca se guardan.</li>
          <li>
            Puede borrar todo en cualquier momento con <B>Borrar todos mis datos</B> en la Configuración de la app.
          </li>
        </ul>
        <p>
          <B>El sitio web y la lista de espera de Ellivia</B>
        </p>
        <ul>
          <li>
            Si se une a la lista de espera, recopilamos su nombre y su correo electrónico y los usamos solo para
            avisarle sobre el lanzamiento de Ellivia.
          </li>
          <li>Nunca los vendemos ni los compartimos, y puede pedirnos que los borremos en cualquier momento.</li>
        </ul>
        <p>El resto de esta política explica cada uno de estos puntos en detalle.</p>
      </Section>

      <Section title="Quiénes somos">
        <p>
          Ellivia es creada por el equipo de Ellivia, un proyecto independiente desarrollado a través del App
          Accelerator 2026 de Everyone Can Code Chicago. En esta política, “Ellivia”, “nosotros” y “nos” se refieren al
          equipo de Ellivia, a la app Ellivia y al sitio web de Ellivia. “Usted” se refiere a cualquier persona que use
          la app o el sitio web.
        </p>
        <p>
          Ellivia no está afiliada, respaldada, patrocinada ni operada por Rush University Medical Center, Rush Oak
          Park Hospital ni ninguna parte de Rush University System for Health (“Rush”). Los resultados de Ellivia son
          estimaciones. Rush toma la decisión final sobre cada solicitud de asistencia financiera. Ellivia no ofrece
          asesoría médica, legal ni financiera.
        </p>
        <p>
          Puede comunicarse con nosotros en cualquier momento en <Contact />.
        </p>
      </Section>

      <Part title="Parte 1: La app Ellivia">
        <Section title="Qué hace la app">
          <p>
            La app Ellivia ayuda a las personas con una factura de la sala de emergencias de Rush University Medical
            Center o Rush Oak Park Hospital a saber si es probable que califiquen para la asistencia financiera de
            Rush. Lo hace de tres maneras:
          </p>
          <ul>
            <li>
              <B>Verificación de elegibilidad:</B> un cuestionario breve que compara sus respuestas con la política de
              asistencia financiera de Rush y las pautas federales de pobreza.
            </li>
            <li>
              <B>Escaneo de facturas (opcional):</B> lee el hospital, el monto adeudado y las fechas de la factura a
              partir de una foto, un escaneo o un PDF de su factura.
            </li>
            <li>
              <B>Fecha límite y lista de documentos:</B> muestra el último día para presentar la solicitud y una lista
              de los documentos que debe reunir.
            </li>
          </ul>
          <p>
            Todo esto sucede en su iPhone. La app no necesita conexión a internet para funcionar y no realiza
            solicitudes de red.
          </p>
        </Section>

        <Section title="Información que recopila la app">
          <p>
            <B>La app no recopila ninguna información personal.</B> “Recopilar” significa enviar información fuera de
            su dispositivo, a nosotros o a cualquier otra persona, y la app nunca lo hace. En concreto, la app no:
          </p>
          <ul>
            <li>le pide crear una cuenta ni iniciar sesión</li>
            <li>le pide su nombre, correo electrónico, número de teléfono, dirección ni fecha de nacimiento</li>
            <li>recopila su ubicación</li>
            <li>incluye analíticas, publicidad, reportes de fallos ni ningún otro kit de software de terceros</li>
            <li>usa cookies, identificadores del dispositivo ni identificadores de publicidad</li>
            <li>le rastrea en otras apps o sitios web</li>
            <li>vende, alquila, comparte ni intercambia ninguna información sobre usted</li>
          </ul>
          <p>Por eso, la etiqueta de privacidad de la app en la App Store es “Datos no recopilados”.</p>
          <p>
            La app usa la información que se describe a continuación solo en su iPhone, para darle su resultado. Nunca
            se envía a nosotros ni a nadie más.
          </p>
        </Section>

        <Section title="Respuestas al cuestionario">
          <p>La verificación de elegibilidad hace algunas o todas estas preguntas:</p>
          <ul>
            <li>qué hospital de Rush le atendió</li>
            <li>si vive en Illinois</li>
            <li>la situación de su seguro médico</li>
            <li>el tipo de visita y la fecha de su visita</li>
            <li>la fecha de su primera factura</li>
            <li>el monto de su copago y si ya lo pagó</li>
            <li>si recibe ciertos beneficios públicos, como SNAP o WIC</li>
            <li>el tamaño de su hogar</li>
            <li>los ingresos de su hogar</li>
          </ul>
          <p>
            <B>Por qué:</B> estos son los datos que usa la política de asistencia financiera de Rush para decidir para
            qué programa, si alguno, podría calificar.
          </p>
          <p>
            <B>Cómo se manejan estas respuestas:</B>
          </p>
          <ol>
            <li>
              Se mantienen solo en la memoria de trabajo de su iPhone mientras responde. Nunca se escriben en el
              almacenamiento de su teléfono.
            </li>
            <li>
              Se borran en cuanto se calcula su resultado. Mientras el resultado está en pantalla, el tamaño del hogar
              y los ingresos que se usan para explicarlo se guardan solo en la memoria, y desaparecen cuando sale de
              esa pantalla.
            </li>
            <li>
              Si deja una verificación sin terminar y la app permanece en segundo plano durante 10 minutos o más, sus
              respuestas se borran y la verificación empieza de nuevo la próxima vez que abra la app.
            </li>
            <li>Si empieza de nuevo, sus respuestas se borran de inmediato.</li>
          </ol>
        </Section>

        <Section title="Escaneos de facturas">
          <p>
            Escanear su factura es opcional. Siempre puede responder las preguntas a mano. Puede darle una factura a
            la app de tres maneras:
          </p>
          <ul>
            <li>
              <B>Cámara:</B> el escáner de documentos de Apple toma una foto de su factura en papel.
            </li>
            <li>
              <B>Fotos:</B> usted elige una o más fotos con el selector de fotos de Apple. La app recibe solo las fotos
              que usted elige. No puede ver el resto de su fototeca y no pide acceso a ella.
            </li>
            <li>
              <B>Archivos:</B> usted elige una o más imágenes o archivos PDF con el selector de archivos de Apple. La
              app recibe solo los archivos que usted elige.
            </li>
          </ul>
          <p>
            <B>Cómo se manejan los escaneos:</B>
          </p>
          <ol>
            <li>
              El texto de cada página se lee en su iPhone con el reconocimiento de texto integrado de Apple (el
              framework Vision). Las imágenes nunca se suben ni se envían a ninguna parte.
            </li>
            <li>
              La app busca cuatro datos en ese texto: quién envió la factura, la fecha del servicio, la fecha del
              estado de cuenta y el monto adeudado. Se usan para completar su verificación por usted.
            </li>
            <li>
              Las imágenes, los archivos y el texto reconocido se guardan en la memoria solo mientras se leen. La app
              nunca guarda una copia y no se agregan a su fototeca.
            </li>
            <li>
              Lo que encontró el escaneo se guarda en la memoria solo mientras usted está en la pantalla de resultados
              del escaneo, y se borra cuando sale de ella.
            </li>
          </ol>
          <p>
            Si un escaneo lleva a un resultado de elegibilidad, la app guarda el mismo pequeño registro que guarda en
            una verificación manual (vea más abajo). No se guarda nada más del escaneo.
          </p>
        </Section>

        <Section title="Información guardada en su iPhone">
          <p>
            Para mostrarle su resultado, su fecha límite y su lista de documentos cuando vuelva, la app guarda una
            pequeña cantidad de información en su iPhone. Se queda en su iPhone y nunca se nos envía.
          </p>
          <p>
            <B>Por cada verificación que completa, la app guarda:</B>
          </p>
          <ul>
            <li>la fecha y la hora de la verificación</li>
            <li>
              el resultado: el programa de asistencia para el que probablemente califica, o el motivo general por el
              que la verificación terminó antes (por ejemplo, que el hospital no es uno de los que cubre Ellivia)
            </li>
            <li>si sus ingresos estaban cerca del límite de un programa, sin ninguna cifra de ingresos</li>
            <li>qué versión de las reglas de Rush se usó</li>
            <li>su fecha límite para presentar la solicitud</li>
            <li>a qué hospital de Rush contactar</li>
            <li>un identificador aleatorio para que el registro se pueda borrar por separado</li>
          </ul>
          <p>
            <B>Para su lista de documentos, la app guarda:</B> qué elementos eligió, como “Licencia de conducir” o
            “Copias de los dos talones de pago más recientes”. Algunas de estas elecciones pueden decir algo sobre su
            situación, así que se protegen de la misma manera que sus resultados. La app no guarda los documentos.
          </p>
          <p>
            <B>Para el tutorial de la app, la app guarda:</B> el número de versión de la app cuando terminó u omitió el
            tutorial por última vez, para que no se muestre cada vez. Esto se guarda en la configuración estándar de
            apps del iPhone y no contiene nada sobre usted.
          </p>
          <p>
            <B>La app nunca guarda:</B> sus ingresos, el tamaño de su hogar, su residencia, la situación de su seguro,
            la fecha de su visita, su copago, sus beneficios públicos, los montos de sus facturas, las imágenes de sus
            facturas, el texto reconocido de sus facturas, ni su nombre o datos de contacto.
          </p>
        </Section>

        <Section title="Cuánto tiempo guarda la app la información">
          <ul>
            <li>
              Las respuestas al cuestionario y los escaneos de facturas se borran como se describe arriba, a más tardar
              cuando sale de la pantalla de resultados o de escaneo, o después de 10 minutos en segundo plano.
            </li>
            <li>
              Las verificaciones guardadas y las elecciones de la lista de documentos permanecen en su iPhone hasta que
              usted las borre, borre todos sus datos o elimine la app.
            </li>
          </ul>
        </Section>

        <Section title="Cómo protege la app su información">
          <ul>
            <li>
              <B>Bloqueada cuando su teléfono está bloqueado.</B> Su registro guardado se mantiene en un solo archivo
              con la protección de archivos más fuerte de iOS, así que no se puede leer mientras su iPhone está
              bloqueado.
            </li>
            <li>
              <B>Sin copias de seguridad.</B> Ese archivo se excluye de las copias de seguridad de iCloud y de la
              computadora. Esto significa que nunca sale de su teléfono a través de una copia de seguridad. También
              significa que sus resultados guardados no pasarán a un iPhone nuevo, y tendría que volver a hacer la
              verificación.
            </li>
            <li>
              <B>Oculta en el selector de apps.</B> Cuando sale de la app, su pantalla se cubre, así que sus respuestas
              o su resultado no aparecen en el selector de apps ni en la captura que iOS toma de la app.
            </li>
            <li>
              <B>Sin acceso a la red.</B> La app no envía ni recibe datos por internet.
            </li>
            <li>
              <B>Registros de errores privados.</B> Si algo falla, la app puede escribir un breve mensaje técnico de
              error en el registro del sistema de su iPhone. Estos mensajes están marcados como privados, se quedan en
              su iPhone y no incluyen sus respuestas ni sus resultados.
            </li>
          </ul>
          <p>
            Cualquier persona que pueda desbloquear su iPhone puede abrir la app y ver sus resultados guardados y su
            fecha límite. Le recomendamos proteger su iPhone con un código, Face ID o Touch ID.
          </p>
        </Section>

        <Section title="Permisos que pide la app">
          <ul>
            <li>
              <B>Cámara:</B> se pide solo cuando usted decide escanear una factura en papel. Se usa solo para leer su
              factura. Si dice que no, aún puede elegir fotos o archivos, o responder las preguntas a mano. Puede
              activar o desactivar el acceso a la cámara en cualquier momento en la app Configuración del iPhone, en
              Ellivia.
            </li>
          </ul>
          <p>
            La app no pide acceso a su fototeca, ubicación, contactos, calendario, micrófono, datos de salud,
            Bluetooth ni red local, y no pide permiso para rastrearle.
          </p>
        </Section>

        <Section title="Compartir con terceros">
          <p>
            La app no comparte ninguna información con terceros, porque ninguna información sale de su iPhone. La app
            no tiene kits de software de terceros.
          </p>
          <p>Algunos botones de la app le llevan fuera de ella:</p>
          <ul>
            <li>
              <B>Páginas web de Rush:</B> la página de asistencia financiera de Rush, la política de asistencia
              financiera de Rush y el formulario de solicitud se abren en Safari.
            </li>
            <li>
              <B>Rush MyChart:</B> la página de inicio de sesión de MyChart se abre en Safari, para que pueda descargar
              los documentos que necesite.
            </li>
            <li>
              <B>Llamar o escribir a Rush:</B> el número de teléfono de un consejero financiero de Rush abre su app
              Teléfono, y la dirección de correo de facturación de Rush abre su app Mail.
            </li>
          </ul>
          <p>
            Cuando toca uno de estos, la app no envía sus respuestas, su resultado ni nada más junto con él. Lo que pase
            después es entre usted y ese servicio. Cualquier información que le dé a Rush, en su sitio web, por
            teléfono, por correo o en una solicitud, se maneja según las propias prácticas de privacidad de Rush y su
            Aviso de Prácticas de Privacidad, no según esta política.
          </p>
        </Section>

        <Section title="Apple">
          <p>
            La app se descarga desde la App Store de Apple y funciona en iOS de Apple. Apple maneja su cuenta de la App
            Store y sus descargas. Si eligió en la configuración de su iPhone compartir analíticas con los
            desarrolladores de apps, Apple puede compartir con nosotros, a través de App Store Connect, informes de
            fallos y estadísticas de uso anónimos sobre la app. Estos no le identifican y no incluyen nada de lo que
            ingresó en la app. El manejo de esta información por parte de Apple está cubierto por la{' '}
            <L href="https://www.apple.com/legal/privacy/">Política de Privacidad de Apple</L>.
          </p>
        </Section>

        <Section title="Información de salud y HIPAA">
          <p>
            Ellivia no es un proveedor de atención médica, un plan de salud ni un socio comercial de Rush, así que no
            está sujeta a HIPAA. Aun así, tratamos todo lo que usted ingresa como información sensible. Por eso la app
            está hecha para que su información nunca salga de su iPhone y para guardar lo mínimo posible.
          </p>
        </Section>

        <Section title="Sus opciones en la app">
          <p>Usted siempre controla lo que guarda la app:</p>
          <ul>
            <li>
              <B>Borrar una verificación:</B> en la pantalla de Inicio, deslice hacia la izquierda sobre una
              verificación en “Sus verificaciones” y toque Borrar.
            </li>
            <li>
              <B>Borrar todo:</B> vaya a Configuración, luego a “Sus datos”, y toque <B>Borrar todos mis datos</B>.
              Esto borra todos los resultados guardados, su fecha límite, sus elecciones de la lista de documentos y el
              archivo de datos de la app. También elimina cualquier notificación de Ellivia. Esto no se puede deshacer.
            </li>
            <li>
              <B>Eliminar la app:</B> al eliminar Ellivia de su iPhone se borra todo lo que guardó.
            </li>
            <li>
              <B>Desactivar la cámara:</B> en la app Configuración del iPhone, en Ellivia.
            </li>
          </ul>
          <p>
            La app no tiene cuentas, así que no hay ninguna cuenta que eliminar. Como nunca recibimos información de la
            app, no tenemos nada de ella que consultar, corregir, exportar o borrar en su nombre. Todo está en su
            iPhone, donde usted mismo puede borrarlo en cualquier momento.
          </p>
        </Section>
      </Part>

      <Part title="Parte 2: El sitio web y la lista de espera de Ellivia">
        <Section title="Qué recopilamos cuando se une a la lista de espera">
          <ul>
            <li>su nombre</li>
            <li>su correo electrónico</li>
            <li>la fecha y la hora en que se unió</li>
            <li>
              un registro de su consentimiento: la hora en que aceptó recibir avisos del lanzamiento y qué versión del
              texto de consentimiento vio
            </li>
            <li>
              una etiqueta corta de referencia (por ejemplo, “instagram” o “qr-flyer”) si llegó a través de un enlace
              que la incluía. Esto nos dice qué difusión está funcionando. No está vinculada a ninguna cuenta de redes
              sociales.
            </li>
          </ul>
          <p>
            <B>No</B> recopilamos en el sitio web números de teléfono, direcciones, expedientes médicos, facturas del
            hospital, datos del seguro, ingresos ni otra información financiera. Por favor, no nos envíe esa
            información.
          </p>
          <p>
            El ejemplo de ahorro de nuestra página de inicio, donde puede elegir el tamaño del hogar y un rango de
            ingresos, funciona completamente en su navegador. Sus elecciones ahí nunca se guardan ni se nos envían.
          </p>
        </Section>

        <Section title="Información que se procesa por seguridad">
          <ul>
            <li>
              <B>Protección contra spam.</B> El formulario de registro usa Cloudflare Turnstile para distinguir a las
              personas de los bots automatizados. Turnstile procesa información sobre su navegador, su dispositivo y su
              dirección IP según la{' '}
              <L href="https://www.cloudflare.com/turnstile-privacy-policy/">política de privacidad de Turnstile de Cloudflare</L>
              .
            </li>
            <li>
              <B>Límite de intentos.</B> Para evitar abusos, nuestro servicio de registro guarda un hash unidireccional
              y con clave de su dirección IP junto con la hora. No guardamos su dirección IP en sí en nuestra base de
              datos, y estos hashes se borran automáticamente después de unas 24 horas.
            </li>
            <li>
              <B>Alojamiento.</B> El sitio web está alojado en GitHub Pages, y nuestra base de datos y nuestro servicio
              de registro están alojados en Supabase. Como la mayoría de los servicios en línea, estos proveedores
              pueden guardar registros técnicos estándar (como direcciones IP y horas de las solicitudes) según sus
              propias políticas de privacidad.
            </li>
          </ul>
          <p>
            El sitio web no usa cookies, analíticas, rastreadores publicitarios ni píxeles de seguimiento. Si llega a
            través de un enlace de referencia, su navegador guarda esa etiqueta en el almacenamiento de sesión hasta que
            cierre la pestaña, así que solo se nos envía si decide unirse.
          </p>
        </Section>

        <Section title="Cómo usamos la información de la lista de espera">
          <p>
            Usamos su nombre y su correo electrónico solo para enviarle avisos sobre el lanzamiento de Ellivia, como
            cuando la app esté disponible, y para dirigirle esos mensajes. No vendemos, alquilamos ni compartimos su
            nombre o su correo con nadie con fines de marketing, y no los usamos para publicidad. Cada correo sobre el
            lanzamiento que enviemos incluirá una forma de dejar de recibir más mensajes.
          </p>
          <p>
            La información de su lista de espera nunca se conecta con la app Ellivia. Unirse a la lista de espera no nos
            da acceso a lo que hace en la app, y usar la app no nos dice si usted está en la lista de espera.
          </p>
        </Section>

        <Section title="Con quién compartimos la información de la lista de espera">
          <p>
            Compartimos la información de la lista de espera solo con los proveedores de servicios que operan el sitio
            web por nosotros: Supabase (base de datos y servicio de registro), Cloudflare (protección contra spam) y
            GitHub (alojamiento del sitio web). Ellos la procesan solo para prestar esos servicios. No la compartimos
            con nadie más, a menos que la ley nos lo exija.
          </p>
        </Section>

        <Section title="Cómo se guarda y protege la información de la lista de espera">
          <ul>
            <li>Su información se envía a través de una conexión HTTPS cifrada.</li>
            <li>Se guarda en una base de datos PostgreSQL alojada en Supabase y ubicada en los Estados Unidos.</li>
            <li>
              El sitio web público no puede leer la lista de espera. Solo nuestro servicio de registro puede agregar
              entradas, y solo los administradores del proyecto de Ellivia pueden ver la lista a través de su cuenta de
              Supabase.
            </li>
          </ul>
          <p>
            Ningún método para guardar o enviar información en línea es completamente seguro, pero trabajamos para
            mantener el acceso limitado.
          </p>
        </Section>

        <Section title="Cuánto tiempo guardamos la información de la lista de espera">
          <p>
            Guardamos su nombre y su correo electrónico hasta que Ellivia se haya lanzado y hayamos terminado de enviar
            los avisos del lanzamiento, o hasta que nos pida borrarlos, lo que ocurra primero. Después, borramos la
            lista de espera. Los hashes de direcciones IP que se usan para limitar intentos se borran después de unas 24
            horas.
          </p>
        </Section>

        <Section title="Sus opciones para la lista de espera">
          <ul>
            <li>
              <B>Dejar de recibir correos:</B> use el enlace en cualquier correo sobre el lanzamiento, o escríbanos.
            </li>
            <li>
              <B>Retirar su consentimiento y borrar su información:</B> escriba a <Contact /> desde la dirección con la
              que se registró, para que podamos confirmar que es suya. Eliminaremos su nombre y su correo electrónico y
              le confirmaremos cuando esté hecho.
            </li>
          </ul>
        </Section>
      </Part>

      <Part title="Parte 3: Para la app y el sitio web">
        <Section title="Sus derechos de privacidad">
          <p>
            Según dónde viva, incluido California y otros estados de EE. UU., puede tener derecho a saber qué
            información personal tenemos sobre usted, a obtener una copia, a corregirla, a que se borre y a no recibir
            un trato distinto por ejercer estos derechos. Atendemos estas solicitudes para todas las personas, sin
            importar dónde vivan.
          </p>
          <ul>
            <li>
              Para la app, no tenemos nada que entregarle, porque la app no nos envía nada. Usted mismo puede borrar
              todo en la app.
            </li>
            <li>
              Para la lista de espera, escriba a <Contact />. Procuramos responder en un plazo de 30 días.
            </li>
          </ul>
          <p>No vendemos ni compartimos información personal, y no la usamos para publicidad dirigida.</p>
        </Section>

        <Section title="Cambios a esta política">
          <p>
            Si cambiamos la forma en que Ellivia maneja la información, actualizaremos esta política y su fecha de
            entrada en vigor, y publicaremos la nueva versión en{' '}
            <L href={withLang(privacyHref, 'es')}>{PUBLIC_URL.replace('https://', '').replace(/\/$/, '')}</L>. La
            copia dentro de la app se actualiza con cada versión de la app. Si la app alguna vez necesita enviar
            información fuera de su iPhone, le explicaremos qué y por qué dentro de la app y le pediremos permiso
            primero. Si hacemos un cambio importante en la forma en que usamos la información de la lista de espera,
            enviaremos un correo a las personas de la lista antes de que entre en vigor.
          </p>
        </Section>

        <Section title="Contáctenos">
          <p>
            <B>El equipo de Ellivia</B>
            <br />
            Correo electrónico: <Contact />
          </p>
          <p>
            Comuníquese con nosotros si tiene preguntas sobre esta política, para hacer una solicitud de privacidad o
            para reportar un problema de privacidad. Si tiene preguntas sobre su factura o su solicitud de asistencia
            financiera, comuníquese directamente con Rush. Puede contactar a los consejeros financieros de Rush en los
            números de teléfono y la dirección de correo que aparecen en la app.
          </p>
        </Section>
      </Part>
    </>
  )
}
