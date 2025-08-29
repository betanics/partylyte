'use client'

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Partylyte Glow-Gradient für aktive Cards
const PARTY_GRADIENT =
  "radial-gradient(140px 140px at center, rgba(231,0,137,0.35), rgba(255,196,58,0.25) 45%, transparent 70%)";

// Highlight-Card: wird aktiv, wenn Card-Zentrum nah am Viewport-Zentrum ist
function HighlightCard({
  children,
  className = "",
  thresholdPx = 90,           // wie nah ans Zentrum (Pixel)
  thresholdRatio = 0.35,      // alternativ: Anteil der Kartenhöhe
}: {
  children: React.ReactNode;
  className?: string;
  thresholdPx?: number;
  thresholdRatio?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const cardCenter = r.top + r.height / 2;
      const dist = Math.abs(cardCenter - viewportCenter);
      const dynThreshold = Math.max(thresholdPx, r.height * thresholdRatio);
      setActive(dist < dynThreshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [thresholdPx, thresholdRatio]);

  return (
    <motion.div
      ref={ref}
      className={`rounded-2xl border border-neutral-800 bg-neutral-950/60 ${className}`}
      animate={
        active
          ? {
              scale: 1.02,
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.10), 0 12px 32px rgba(231,0,137,0.22), 0 24px 64px rgba(255,196,58,0.18)",
            }
          : {
              scale: 1,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
            }
      }
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
    >
      <div className="relative p-4 md:p-5">
        {/* Glow-Layer */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ background: PARTY_GRADIENT }}
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />
        {/* Inhalt über dem Glow */}
        <div className="relative">{children}</div>
      </div>
    </motion.div>
  );
}

/** === Checkout-Setup === */
const CHECKOUT_BASE = "https://amzn.eu/d/1pRnzzV";
const DEFAULT_DISCOUNT = ""; // optional z. B. "PARTY10"

// --- LEGAL TEXTS ---
const IMPRESSUM_TEXT = `
<h2>1. Einleitung<br></h2>
<p>Im Folgenden informieren wir über die Verarbeitung personenbezogener Daten bei der Nutzung</p>
<ul>
<li>unserer Website https://www.betanics.de/</li>
<li>unserer Profile in Sozialen Medien.</li>
</ul>
<p>Personenbezogene Daten sind alle Daten, die auf eine konkrete natürliche Person beziehbar sind, z. B. ihr Name oder ihre IP-Adresse.</p>
<h2>1.1. Kontaktdaten</h2>
<p>Verantwortlicher gem. Art. 4 Abs. 7 EU-Datenschutz-Grundverordnung (DSGVO) ist be tanics GmbH, Amalienstraße 71, 80799 München, Deutschland, E-Mail: hello@betanics.de. Gesetzlich vertreten werden wir durch Katharina Zeitelhack.</p>
<p>Unser Datenschutzbeauftragter ist die heyData GmbH, Kantstr. 99, 10627 Berlin, <a href="http://www.heydata.eu/">www.heydata.eu</a>, E-Mail: datenschutz@heydata.eu.</p>
<h2>1.2. Umfang der Datenverarbeitung, Verarbeitungszwecke und Rechtsgrundlagen</h2>
<p>Den Umfang der Verarbeitung der Daten, Verarbeitungszwecke und Rechtsgrundlagen führen wir im Detail weiter unten aus. Als Rechtsgrundlage für eine Datenverarbeitung kommen grundsätzlich die folgenden in Betracht:</p>
<ul>
<li>6 Abs. 1 S. 1 it. a DSGVO dient uns als Rechtsgrundlage für Verarbeitungsvorgänge, für die wir eine Einwilligung einholen.</li>
<li>6 Abs. 1 S. 1 lit. b DS GVO ist Rechtsgrundlage, soweit die Verarbeitung personenbezogener Daten zur Erfüllung eines Vertrages erforderlich ist, z.B. wenn ein Seitenbesucher von uns ein Produkt erwirbt oder wir für ihn eine Leistung ausführen. Diese Rechtsgrundlage gilt auch für Verarbeitungen, die für vorvertragliche Maßnahmen erforderlich sind, etwa bei Anfragen zu unseren Produkten oder Leistungen.</li>
<li>6 Abs. 1 S. 1 lit. c DSGVO findet Anwendung, wenn wir mit der Verarbeitung personenbezogener Daten eine rechtliche Verpflichtung erfüllen, wie es z.B. im Steuerrecht der Fall sein kann.</li>
<li>6 Abs. 1 S. 1 lit. f DSGVO dient als Rechtsgrundlage, wenn wir uns zur Verarbeitung personenbezogener Daten auf berechtigte Interessen berufen können, z.B. für Cookies, die für den technischen Betrieb unserer Website erforderlich sind.</li>
</ul>
<h2>1.3. Datenverarbeitung außerhalb des EWR</h2>
<p>Soweit wir Daten an Dienstleister oder sonstige Dritte außerhalb des EWR übermitteln, garantieren die Sicherheit der Daten bei der Weitergabe, soweit (z.B. für Großbritannien, Kanada und Israel) vorhanden, Angemessenheitsbeschlüsse der EU-Kommission (Art. 45 Ab. 3 DSGVO).</p>
<p>Wenn kein Angemessenheitsbeschluss existiert (z.B. für die USA), sind Rechtsgrundlage für die Datenweitergabe im Regelfall, also soweit wir keinen abweichenden Hinweis geben, Standardvertragsklauseln. Diese sind ein von der EU-Kommission verabschiedetes Regelwerk und Teil des Vertrags mit dem jeweiligen Dritten. Nach Art. 46 Abs. 2 lit. b DSGVO gewährleisten sie die Sicherheit der Datenweitergabe. Viele der Anbieter haben über die Standardvertragsklauseln hinausgehende vertragliche Garantien abgegeben, die die Daten über die Standardvertragsklauseln hinaus schützen. Das sind z.B. Garantien hinsichtlich der Verschlüsselung der Daten oder hinsichtlich einer Pflicht des Dritten zum Hinweis an Betroffene, wenn Strafverfolgungsorgane auf Daten zugreifen wollen.</p>
<h2>1.4. Speicherdauer</h2>
<p>Sofern nicht im Rahmen dieser Datenschutzerklärung ausdrücklich angegeben, werden die bei uns gespeicherten Daten gelöscht, sobald sie für ihre Zweckbestimmung nicht mehr erforderlich sind und der Löschung keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Sofern die Daten nicht gelöscht werden, weil sie für andere und gesetzlich zulässige Zwecke erforderlich sind, wird ihre Verarbeitung eingeschränkt, d.h. die Daten werden gesperrt und nicht für andere Zwecke verarbeitet. Das gilt z.B. für Daten, die wir aus handels- oder steuerrechtlichen Gründen aufbewahren müssen.</p>
<h2>1.5. Rechte der Betroffenen</h2>
<p>Betroffene haben gegenüber uns folgende Rechte hinsichtlich der sie betreffenden personenbezogenen Daten:</p>
<ul>
<li>Recht auf Auskunft,</li>
<li>Recht auf Berichtigung oder Löschung,</li>
<li>Recht auf Einschränkung der Verarbeitung,</li>
<li><strong>Recht auf Widerspruch gegen die Verarbeitung</strong>,</li>
<li>Recht auf Datenübertragbarkeit,</li>
<li><strong>Recht, eine erteilte Einwilligung jederzeit zu widerrufen</strong>.</li>
</ul>
<p>Betroffene haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung ihrer personenbezogenen Daten zu beschweren.</p>
<h2>1.6. Pflicht zur Bereitstellung von Daten</h2>
<p>Kunden, Interessenten oder Dritte müssen uns im Rahmen einer Geschäftsbeziehung oder sonstigen Beziehung nur diejenigen personenbezogenen Daten bereitstellen, die für die Begründung, Durchführung und Beendigung der Geschäftsbeziehung oder für die sonstige Beziehung erforderlich sind oder zu deren Erhebung wir gesetzlich verpflichtet sind. Ohne diese Daten werden wir in der Regel den Abschluss eines Vertrages oder die Bereitstellung einer Leistung ablehnen müssen oder einen bestehenden Vertrag oder sonstige Beziehung nicht mehr durchführen können.</p>
<p>Pflichtangaben sind als solche gekennzeichnet.</p>
<h2>1.7. Keine automatische Entscheidungsfindung im Einzelfall</h2>
<p>Zur Begründung und Durchführung einer Geschäftsbeziehung oder sonstigen Beziehung nutzen wir grundsätzlich keine vollautomatisierte Entscheidungsfindung gemäß Artikel 22 DSGVO. Sollten wir diese Verfahren in Einzelfällen einsetzen, werden wir hierüber gesondert informieren, sofern dies gesetzlich geboten ist.</p>
<h2>1.8. Kontaktaufnahme</h2>
<p>Bei der Kontaktaufnahme mit uns, z.B. per E-Mail oder Telefon, werden die uns mitgeteilten Daten (z.B. Namen und E-Mail-Adressen) von uns gespeichert, um Fragen zu beantworten. Rechtsgrundlage für die Verarbeitung ist unser berechtigtes Interesse (Art. 6 Abs. 1 S. 1 lit. f DSGVO), an uns gerichtete Anfragen zu beantworten. Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung nicht mehr erforderlich ist, oder schränken die Verarbeitung ein, falls gesetzliche Aufbewahrungspflichten bestehen.</p>
<h2>1.9. Gewinnspiele</h2>
<p>Gelegentlich bieten wir über unsere Website oder auf andere Weise Gewinnspiele an. Die dabei abgefragten Daten verarbeiten wir, um die Gewinner zu ermitteln und zu benachrichtigen. Danach löschen wir die Daten. Es kann auch sein, dass wir Gewinnspiele nur für Bestandskunden anbieten. Dann verarbeiten wir nur den Namen zur Ermittlung der Gewinner und die Kontaktdaten, um die Gewinner zu benachrichtigen. Es ist unser berechtigtes Interesse, zur Kundengewinnung oder zur Interaktion mit unseren Bestandskunden Gewinnspiele anzubieten. Rechtsgrundlage der Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO.</p>
<h2>1.10. Kundenumfragen</h2>
<p>Von Zeit zu Zeit führen wir Kundenumfragen durch, um unsere Kunden und ihre Wünsche besser kennenzulernen. Dabei erheben wir die jeweils abgefragten Daten. Es ist unser berechtigtes Interesse, unsere Kunden und ihre Wünsche besser kennenzulernen, so dass Rechtsgrundlage der damit einhergehenden Datenverarbeitung Art. 6 Abs. 1 S. 1 lit f DSGVO ist. Die Daten löschen wir, wenn die Ergebnisse der Umfragen ausgewertet sind.</p>
<h2>2. Newsletter</h2>
<p>Wir behalten uns vor, Kunden, die bereits Dienstleistungen von uns in Anspruch genommen haben oder Waren gekauft gekauft haben, von Zeit zu Zeit per E-Mail oder auf anderem Weg elektronisch über unsere Angebote zu informieren, falls sie dem nicht widersprochen haben. Rechtsgrundlage für diese Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der Direktwerbung (Erwägungsgrund 47 DSGVO). Kunden können der Verwendung ihrer E-Mail-Adresse zu Werbezwecken jederzeit ohne zusätzliche Kosten widersprechen, zum Beispiel über den Link am Ende einer jeden E-Mail oder per E-Mail an unsere oben genannte E-Mail-Adresse.</p>
<p>Auf Grundlage der Einwilligung der Empfänger (Art. 6 Abs. 1 S. 1 lit. a DSGVO)&nbsp;messen wir auch die Öffnungs- und Klickrate unserer Newsletter, um zu verstehen, welche Inhalte relevant für unsere Empfänger sind.</p>
<p>Wir versenden Newsletter mit dem Tool Klaviyo des Anbieters Klaviyo, Inc., 125 Summer St, Floor 6 Boston, MA 02111, USA (Datenschutzerklärung: https://www.klaviyo.com/privacy/policy). Der Anbieter verarbeitet dabei Inhalts-, Nutzungs-, Meta-/Kommunikationsdaten und Kontaktdaten in den USA.</p>
<h2>3. Datenverarbeitung auf unserer Website</h2>
<h2>3.1. Informatorische Nutzung der Website</h2>
<p>Bei der informatorischen Nutzung der Website, also wenn Seitenbesucher uns nicht gesondert Informationen übermitteln, erheben wir die personenbezogenen Daten, die der Browser an unseren Server übermittelt, um die Stabilität und Sicherheit unserer Website zu gewährleisten. Darin liegt unser berechtigtes Interesse, so dass Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO ist.</p>
<p>Diese Daten sind:</p>
<ul>
<li>IP-Adresse</li>
<li>Datum und Uhrzeit der Anfrage</li>
<li>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</li>
<li>Inhalt der Anfrage (konkrete Seite)</li>
<li>Zugriffsstatus/HTTP-Statuscode</li>
<li>jeweils übertragene Datenmenge</li>
<li>Website, von der die Anfrage kommt</li>
<li>Browser</li>
<li>Betriebssystem und dessen Oberfläche</li>
<li>Sprache und Version der Browsersoftware.</li>
</ul>
<p>Diese Daten werden außerdem in Logfiles gespeichert. Sie werden gelöscht, wenn ihre Speicherung nicht mehr erforderlich ist, spätestens nach 14 Tagen.</p>
<h2>3.2. Webhosting und Bereitstellung der Website</h2>
<p>Unsere Website hostet Shopify International Limited, Victoria Buildings, 2. Etage, 1-2 Haddington Road, Dublin 4, D04 XN32, Irland. Der Anbieter verarbeitet dabei die über die Website übermittelten personenbezogene Daten, z.B. auf Inhalts-, Nutzungs-, Meta-/Kommunikationsdaten oder Kontaktdaten. Es ist unser berechtigtes Interesse, eine Website zur Verfügung zu stellen, so dass die Rechtsgrundlage der Datenverarbeitung Art. 6 Abs. 1 S. 1 lit. f DSGVO ist.</p>
<h2>3.3. Kontaktformular</h2>
<p>Bei Kontaktaufnahme über das Kontaktformular auf unserer Website speichern wir die dort abgefragten Daten und den Inhalt der Nachricht.<br>Rechtsgrundlage für die Verarbeitung ist unser berechtigtes Interesse, an uns gerichtete Anfragen zu beantworten. Rechtsgrundlage für die Verarbeitung ist deshalb Art. 6 Abs. 1 S. 1 lit. f DSGVO.<br>Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung nicht mehr erforderlich ist, oder schränken die Verarbeitung ein, falls gesetzliche Aufbewahrungspflichten bestehen.</p>
<h2>3.4. Stellenanzeigen</h2>
<p>Wir veröffentlichen Stellen, die in unserem Unternehmen frei sind, auf unserer Website, auf mit der Website verbundenen Seiten oder auf Websites von Dritten.<br>Die Verarbeitung der im Rahmen der Bewerbung angegebenen Daten erfolgt zur Durchführung des Bewerbungsverfahrens. Soweit diese für unsere Entscheidung, ein Beschäftigungsverhältnis zu begründen, erforderlich sind, ist Rechtsgrundlage Art. 88 Abs. 1 DSGVO i. V. m. § 26 Abs. 1 BDSG. Die zur Durchführung des Bewerbungsverfahrens erforderlichen Daten haben wir entsprechend gekennzeichnet oder weisen auf sie hin. Wenn Bewerber diese Daten nicht angeben, können wir die Bewerbung nicht bearbeiten.<br>Weitere Daten sind freiwillig und nicht für eine Bewerbung erforderlich. Falls Bewerber weitere Angaben machen, ist Grundlage ihre Einwilligung (Art. 6 Abs. 1 S. 1 lit. a DSGVO).</p>
<p>Wir bitten Bewerber, in Lebenslauf und Anschreiben auf Angaben zu politischen Meinungen, religiösen Anschauungen und ähnlich sensiblen Daten zu verzichten. Sie sind nicht für eine Bewerbung erforderlich. Wenn Bewerber dennoch entsprechende Angaben machen, können wir ihre Verarbeitung im Rahmen der Verarbeitung des Lebenslaufes oder Anschreibens nicht verhindern. Ihre Verarbeitung beruht dann auch auf der Einwilligung der Bewerber (Art. 9 Abs. 2 lit. a DSGVO).</p>
<p>Schließlich verarbeiten wir die Daten der Bewerber für weitere Bewerbungsverfahren, wenn sie uns dazu ihre Einwilligung erteilt haben. In diesem Fall ist Rechtsgrundlage Art. 6 Abs. 1 S. 1 lit. a DSGVO.</p>
<p>Die Daten der Bewerber geben wir an die zuständigen Mitarbeiter der Personalabteilung, an unsere Auftragsverarbeiter im Bereich Recruiting und an die im Übrigen im Bewerbungsverfahren beteiligten Mitarbeiter weiter.</p>
<p>Wenn wir im Anschluss an das Bewerbungsverfahren ein Beschäftigungsverhältnis mit dem Bewerber eingehen, löschen wir die Daten erst nach Beendigung des Beschäftigungsverhältnisses. Andernfalls löschen wir die Daten spätestens sechs Monate nach Ablehnung eines Bewerbers.</p>
<p>Wenn Bewerber uns ihre Einwilligung erteilt haben, ihre Daten auch für weitere Bewerbungsverfahren zu verwenden, löschen wir ihre Daten erst ein Jahr nach Erhalt der Bewerbung.</p>
<h2>3.5. Bewertungen</h2>
<p>Seitenbesucher können auf unserer Website Bewertungen für unsere Waren, Dienstleistungen oder allgemein zu unserem Unternehmen hinterlassen. Dafür verarbeiten wir neben den eingegebenen Daten Meta- oder Kommunikationsdaten. Wir haben ein berechtigtes Interesse daran, von Seitenbesuchern eine Rückmeldung zu unserem Angebot zu erhalten. Deshalb ist Rechtsgrundlage der Datenverarbeitung Art. 6 Abs. 1 S. 1 lit. f DSGVO. Soweit wir für die Vereinbarung ein Tool eines Drittanbieters verwenden, sind die Informationen dazu unter "Drittanbieter" zu finden.</p>
<h2>3.6. Kundenbereich</h2>
<p>Seitenbesucher können auf unserer Website ein Kundenkonto eröffnen. Die in diesem Rahmen abgefragten Daten verarbeiten wir zur Erfüllung des jeweils geschlossenen Nutzungsvertrages über das Konto, so dass Rechtsgrundlage der Verarbeitung Art. 6 Abs. 1 S. 1 lit. b DSGVO ist.</p>
<h2>3.7. Angebot von Waren</h2>
<p>Wir bieten über unsere Website Waren an. In den Bestellvorgang oder Versand binden wir die folgenden Dienstleister ein, die zur Erbringung einer Leistung nur die jeweils erforderlichen personenbezogenen Daten erhalten:</p>
<ul>
<li>ProPerfect GmbH, Gottlieb-Daimler-Straße 8, 86462 Langweid am Lech</li>
<li>JTL-Software-GmbH, Rheinstr. 7, 41836 Hückelhoven</li>
<li>ReCharge, Inc., 3030 Nebraska Avenue, Suite 301, Santa Monica, CA 90025, USA</li>
</ul>
<p>Die Verarbeitung der Daten erfolgt zur Erbringung des mit dem jeweiligen Seitenbesucher geschlossenen Vertrags (Art. 6 Abs. 1 S. 1 lit. b DSGVO).</p>
<h2>3.8. Zahlungsdienstleister</h2>
<p>Zur Abwicklung von Zahlungen nutzen wir Zahlungsabwickler, die selbst datenschutzrechtlich Verantwortliche im Sinne von Art. 4 Nr. 7 DSGVO sind. Soweit diese von uns im Bestellprozess eingegebene Daten und Zahlungsdaten erhalten, erfüllen wir damit den mit unseren Kunden geschlossenen Vertrag (Art. 6 Abs. 1 S. 1 lit. b DSGVO).</p>
<p>Diese Zahlungsdienstleister sind:</p>
<ul>
<li>Amazon Payments Europe s.c.a., Luxemburg</li>
<li><span>Apple Inc., USA (für Apple Pay)</span></li>
<li><span>Google Ireland Limited, Irland (für Google Pay)</span></li>
<li>Klarna Bank AB (publ), Schweden</li>
<li>Mastercard Europe SA, Belgien</li>
<li>PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg</li>
<li><span>Shopify Inc., Kanada (für Shop Pay)</span></li>
<li>Visa Europe Services Inc., Großbritannien</li>
</ul>
<h2>3.9. Drittanbieter</h2>
<h3>3.9.1. LinkedIn Share button</h3>
<p>Wir verwenden LinkedIn Share button zum Teilen von Interessen in sozialen Medien. Der Anbieter ist LinkedIn Ireland Unlimited Company, Wilton Place, Dublin 2, Irland. Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) und Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in der EU.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.linkedin.com/legal/privacy-policy? abrufbar.</p>
<h3>3.9.2. Strato</h3>
<p>Wir verwenden Strato zur Speicherung in der Cloud und Hosting. Der Anbieter ist STRATO AG, Pascalstraße 10, 10587 Berlin. Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) und Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in der EU.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse, Daten auf einfachem und günstigen Weg zu speichern.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.strato.de/datenschutz/ abrufbar.</p>
<h3>3.9.3. Shopify</h3>
<p>Wir verwenden Shopify zur Unterhaltung eines Online-Shops. <span>Der Anbieter ist Shopify International Limited, Victoria Buildings, 2. </span>Etage, 1-2 Haddington Road, Dublin 4, D04 XN32, Irland. Der Anbieter verarbeitet Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in der EU.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.shopify.de/legal/datenschutz abrufbar.</p>
<h3>3.9.4. Facebook Custom Audiences</h3>
<p>Wir verwenden Facebook Custom Audiences für Werbung. <span>Der Anbieter ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Wir löschen die Daten, wenn der Zweck ihrer Erhebung entfallen ist. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.facebook.com/policy.php abrufbar.</p>
<h3>3.9.5. Facebook Pixel</h3>
<p>Wir verwenden Facebook Pixel zur Analyse. <span>Der Anbieter ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.facebook.com/policy.php abrufbar.</p>
<h3>3.9.6. Klaviyo</h3>
<p>Wir verwenden Klaviyo zum E-Mail-Marketing und Management von Kundenbeziehungen. Der Anbieter ist Klaviyo, Inc., 125 Summer St, Floor 6 Boston, MA 02111, USA. Der Anbieter verarbeitet Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.klaviyo.com/privacy/policy abrufbar.</p>
<h3>3.9.7. Google Conversion Tag</h3>
<p>Wir verwenden Google Conversion Tag zum Konvertierungs-Tracking. <span>Der Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. </span>Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://policies.google.com/privacy?hl=de https://support.google.com/tagmanager/answer/9323295?hl=de&amp;ref_topic=3441532 abrufbar.</p>
<h3>3.9.8. Facebook Conversion API</h3>
<p>Wir verwenden Facebook Conversion API zur Analyse. <span>Der Anbieter ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) und Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.facebook.com/policy.php abrufbar.</p>
<h3>3.9.9. Google Analytics</h3>
<p>Wir verwenden Google Analytics zur Analyse. Der Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Dublin, D04e5w5, Irland. Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) und Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://policies.google.com/privacy?hl=de abrufbar.</p>
<h2>4. Datenverarbeitung auf Social Media-Plattformen</h2>
<p>Wir sind in Social Media-Netzwerken vertreten, um dort unser Unternehmen und unsere Leistungen vorzustellen. Die Betreiber dieser Netzwerke verarbeiten Daten ihrer Nutzer regelmäßig zu Werbezwecken. Unter anderem erstellen sie aus ihrem Onlineverhalten Nutzerprofile, die beispielsweise dazu verwendet werden, um auf den Seiten der Netzwerke und auch sonst im Internet Werbung zu zeigen, die den Interessen der Nutzer entspricht. Dazu speichern die Betreiber der Netzwerke Informationen zu dem Nutzungsverhalten in Cookies auf dem Rechner der Nutzer. Es ist außerdem nicht auszuschließen, dass die Betreiber diese Informationen mit weiteren Daten zusammenführen. Weitere Informationen sowie Hinweise, wie Nutzer der Verarbeitung durch die Seitenbetreiber widersprechen können, erhalten Nutzer in den unten aufgeführten Datenschutzerklärungen der jeweiligen Betreiber. Es kann auch sein, dass die Betreiber oder ihre Server in Nicht-EU-Staaten sitzen, so dass sie Daten dort verarbeiten. Hierdurch können sich für die Nutzer Risiken ergeben, z.B. weil die Durchsetzung ihrer Rechte erschwert wird oder staatliche Stellen Zugriff auf die Daten nehmen.</p>
<p>Wenn Nutzer der Netzwerke mit uns über unsere Profile in Kontakt treten, verarbeiten wir die uns mitgeteilten Daten, um die Anfragen zu beantworten. Darin liegt unser berechtigtes Interesse, so dass Rechtsgrundlage Art. 6 Abs. 1 S. 1 lit. f DSGVO ist.</p>
<h2>4.1. Facebook</h2>
<p>Wir unterhalten ein Profil auf Facebook. <span>Betreiber ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Die Datenschutzerklärung ist hier abrufbar: https://www.facebook.com/policy.php. Eine Möglichkeit, der Datenverarbeitung zu widersprechen, ergibt sich über Einstellungen für Werbeanzeigen: https://www.facebook.com/settings?tab=ads.<br>Wir sind auf Grundlage einer Vereinbarung gemeinsam im Sinne von Art. 26 DSGVO mit Facebook für die Verarbeitung der Daten der Besucher unseres Profils verantwortlich. Welche Daten genau verarbeitet werden, erklärt Facebook unter https://www.facebook.com/legal/terms/information_about_page_insights_data. Betroffene können ihre Rechte sowohl gegenüber uns als auch gegenüber Facebook wahrnehmen. Nach unserer Vereinbarung mit Facebook sind wir aber dazu verpflichtet, Anfragen an Facebook weiterzuleiten. Betroffene erhalten also eine schnellere Rückmeldung, wenn sie sich direkt an Facebook wenden.</p>
<h2>4.2. Instagram</h2>
<p>Wir unterhalten ein Profil auf Instagram. <span>Betreiber ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Die Datenschutzerklärung ist hier abrufbar: https://help.instagram.com/519522125107875.</p>
<h2>4.3. Twitter</h2>
<p>Wir unterhalten ein Profil auf Twitter. <span>Betreiber ist Twitter Inc., 1355 Market Street, Suite 900, San Francisco, CA 94103, USA. </span>Die Datenschutzerklärung ist hier abrufbar: https://twitter.com/de/privacy. Eine Möglichkeit, der Datenverarbeitung zu widersprechen, ergibt sich über die Einstellungen für Werbeanzeigen: https://twitter.com/personalization.</p>
<h2>4.4. LinkedIn</h2>
<p>Wir unterhalten ein Profil auf LinkedIn. <span>Betreiber ist LinkedIn Ireland Unlimited Company, Wilton Place, Dublin 2, Irland. </span>Die Datenschutzerklärung ist hier abrufbar: https://https://www.linkedin.com/legal/privacy-policy?_l=de_DE. Eine Möglichkeit, der Datenverarbeitung zu widersprechen, ergibt sich über die Einstellungen für Werbeanzeigen: https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out.</p>
<h2>4.5. Whats App</h2>
<p dir="ltr"><span>Der für die Verarbeitung Verantwortliche setzt WhatsApp als Mittel zur Kommunikation zwischen Mitarbeitern, Kunden, Geschäftspartnern, Shareholdern und Steakholdern ein.</span><b></b></p>
<p dir="ltr"><span>Bei WhatsApp handelt es sich um eine weit verbreitete Applikation mit der man unter anderem chatten, telefonieren und Sprachnachrichten versenden kann.&nbsp;</span><b></b></p>
<p dir="ltr"><span>Betreibergesellschaft des Dienstes ist die WhatsApp Ireland Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Ireland. Wir setzen als </span><a href="https://chatarmin.com/"><span>WhatsApp Marketing Tool</span></a><span> von der Firma </span><a href="http://chatarmin.com/"><span>chatarmin.com</span></a><span> mit Sitz in Wien, Österreich, ein. Zweck der Verarbeitung ist es, betriebliche Kommunikation abzuwickeln.</span><b></b></p>
<p dir="ltr"><span>Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DS-GVO. WhatsApp wird eingesetzt, um Kommunikation abzuwickeln. WhatsApp speichert personenbezogene Kommunikationsdaten und nimmt selbst Zugriff auf personenbezogene Daten, insbesondere auf das Telefonbuch von Mobilfunkgeräten, genauer: Alle Rufnummern der im Telefon gespeicherten Personen werden ausgelesen.</span><b></b></p>
<p dir="ltr"><span>Die über WhatsApp abgewickelte Kommunikation, die erhobenen Rufnummern und alle sonstigen Daten werden oder könnten Dritten, insbesondere Facebook oder anderen Unternehmen sowie amerikanischen oder internationalen Geheimdiensten übermittelt werden. Sofern Sie nicht möchten, dass wir Ihre Rufnummer in einem unserer Mobilfunkgeräte speichern und/oder Kommunikation mit Ihnen über WhatsApp abwickeln, bitte informieren Sie uns einfach. In einem solchen Fall würden wir selbstverständlich auf alternativ zur Verfügung stehende Möglichkeiten der Kommunikation (z.B. Telefonanruf) zurückgreifen.</span><b></b></p>
<p dir="ltr"><span>Weitere Informationen und die geltenden Datenschutzbestimmungen von WhatsApp können unter </span><a href="https://www.whatsapp.com/legal/#privacy-policy"><span>https://www.whatsapp.com/legal/#privacy-policy</span></a><span> abgerufen werden. Weitere Informationen zu unsererer </span><a href="https://chatarmin.com/"><span>WhatsApp Software</span></a><span> auf der Website von Chatarmin.</span></p>
<h2>5. Änderungen dieser Datenschutzerklärung</h2>
<p>Wir behalten uns das Recht vor, diese Datenschutzerklärung mit Wirkung für die Zukunft zu ändern. Eine aktuelle Version ist jeweils hier verfügbar.</p>
<h2>6. Fragen und Kommentare</h2>
<p>Für Fragen oder Kommentare bezüglich dieser Datenschutzerklärung stehen wir gern unter den oben angegebenen Kontaktdaten zur Verfügung.</p>
`;

const DATENSCHUTZ_TEXT = `
<h2>1. Einleitung<br></h2>
<p>Im Folgenden informieren wir über die Verarbeitung personenbezogener Daten bei der Nutzung</p>
<ul>
<li>unserer Website https://www.betanics.de/</li>
<li>unserer Profile in Sozialen Medien.</li>
</ul>
<p>Personenbezogene Daten sind alle Daten, die auf eine konkrete natürliche Person beziehbar sind, z. B. ihr Name oder ihre IP-Adresse.</p>
<h2>1.1. Kontaktdaten</h2>
<p>Verantwortlicher gem. Art. 4 Abs. 7 EU-Datenschutz-Grundverordnung (DSGVO) ist be tanics GmbH, Amalienstraße 71, 80799 München, Deutschland, E-Mail: hello@betanics.de. Gesetzlich vertreten werden wir durch Katharina Zeitelhack.</p>
<p>Unser Datenschutzbeauftragter ist die heyData GmbH, Kantstr. 99, 10627 Berlin, <a href="http://www.heydata.eu/">www.heydata.eu</a>, E-Mail: datenschutz@heydata.eu.</p>
<h2>1.2. Umfang der Datenverarbeitung, Verarbeitungszwecke und Rechtsgrundlagen</h2>
<p>Den Umfang der Verarbeitung der Daten, Verarbeitungszwecke und Rechtsgrundlagen führen wir im Detail weiter unten aus. Als Rechtsgrundlage für eine Datenverarbeitung kommen grundsätzlich die folgenden in Betracht:</p>
<ul>
<li>6 Abs. 1 S. 1 it. a DSGVO dient uns als Rechtsgrundlage für Verarbeitungsvorgänge, für die wir eine Einwilligung einholen.</li>
<li>6 Abs. 1 S. 1 lit. b DS GVO ist Rechtsgrundlage, soweit die Verarbeitung personenbezogener Daten zur Erfüllung eines Vertrages erforderlich ist, z.B. wenn ein Seitenbesucher von uns ein Produkt erwirbt oder wir für ihn eine Leistung ausführen. Diese Rechtsgrundlage gilt auch für Verarbeitungen, die für vorvertragliche Maßnahmen erforderlich sind, etwa bei Anfragen zu unseren Produkten oder Leistungen.</li>
<li>6 Abs. 1 S. 1 lit. c DSGVO findet Anwendung, wenn wir mit der Verarbeitung personenbezogener Daten eine rechtliche Verpflichtung erfüllen, wie es z.B. im Steuerrecht der Fall sein kann.</li>
<li>6 Abs. 1 S. 1 lit. f DSGVO dient als Rechtsgrundlage, wenn wir uns zur Verarbeitung personenbezogener Daten auf berechtigte Interessen berufen können, z.B. für Cookies, die für den technischen Betrieb unserer Website erforderlich sind.</li>
</ul>
<h2>1.3. Datenverarbeitung außerhalb des EWR</h2>
<p>Soweit wir Daten an Dienstleister oder sonstige Dritte außerhalb des EWR übermitteln, garantieren die Sicherheit der Daten bei der Weitergabe, soweit (z.B. für Großbritannien, Kanada und Israel) vorhanden, Angemessenheitsbeschlüsse der EU-Kommission (Art. 45 Ab. 3 DSGVO).</p>
<p>Wenn kein Angemessenheitsbeschluss existiert (z.B. für die USA), sind Rechtsgrundlage für die Datenweitergabe im Regelfall, also soweit wir keinen abweichenden Hinweis geben, Standardvertragsklauseln. Diese sind ein von der EU-Kommission verabschiedetes Regelwerk und Teil des Vertrags mit dem jeweiligen Dritten. Nach Art. 46 Abs. 2 lit. b DSGVO gewährleisten sie die Sicherheit der Datenweitergabe. Viele der Anbieter haben über die Standardvertragsklauseln hinausgehende vertragliche Garantien abgegeben, die die Daten über die Standardvertragsklauseln hinaus schützen. Das sind z.B. Garantien hinsichtlich der Verschlüsselung der Daten oder hinsichtlich einer Pflicht des Dritten zum Hinweis an Betroffene, wenn Strafverfolgungsorgane auf Daten zugreifen wollen.</p>
<h2>1.4. Speicherdauer</h2>
<p>Sofern nicht im Rahmen dieser Datenschutzerklärung ausdrücklich angegeben, werden die bei uns gespeicherten Daten gelöscht, sobald sie für ihre Zweckbestimmung nicht mehr erforderlich sind und der Löschung keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Sofern die Daten nicht gelöscht werden, weil sie für andere und gesetzlich zulässige Zwecke erforderlich sind, wird ihre Verarbeitung eingeschränkt, d.h. die Daten werden gesperrt und nicht für andere Zwecke verarbeitet. Das gilt z.B. für Daten, die wir aus handels- oder steuerrechtlichen Gründen aufbewahren müssen.</p>
<h2>1.5. Rechte der Betroffenen</h2>
<p>Betroffene haben gegenüber uns folgende Rechte hinsichtlich der sie betreffenden personenbezogenen Daten:</p>
<ul>
<li>Recht auf Auskunft,</li>
<li>Recht auf Berichtigung oder Löschung,</li>
<li>Recht auf Einschränkung der Verarbeitung,</li>
<li><strong>Recht auf Widerspruch gegen die Verarbeitung</strong>,</li>
<li>Recht auf Datenübertragbarkeit,</li>
<li><strong>Recht, eine erteilte Einwilligung jederzeit zu widerrufen</strong>.</li>
</ul>
<p>Betroffene haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung ihrer personenbezogenen Daten zu beschweren.</p>
<h2>1.6. Pflicht zur Bereitstellung von Daten</h2>
<p>Kunden, Interessenten oder Dritte müssen uns im Rahmen einer Geschäftsbeziehung oder sonstigen Beziehung nur diejenigen personenbezogenen Daten bereitstellen, die für die Begründung, Durchführung und Beendigung der Geschäftsbeziehung oder für die sonstige Beziehung erforderlich sind oder zu deren Erhebung wir gesetzlich verpflichtet sind. Ohne diese Daten werden wir in der Regel den Abschluss eines Vertrages oder die Bereitstellung einer Leistung ablehnen müssen oder einen bestehenden Vertrag oder sonstige Beziehung nicht mehr durchführen können.</p>
<p>Pflichtangaben sind als solche gekennzeichnet.</p>
<h2>1.7. Keine automatische Entscheidungsfindung im Einzelfall</h2>
<p>Zur Begründung und Durchführung einer Geschäftsbeziehung oder sonstigen Beziehung nutzen wir grundsätzlich keine vollautomatisierte Entscheidungsfindung gemäß Artikel 22 DSGVO. Sollten wir diese Verfahren in Einzelfällen einsetzen, werden wir hierüber gesondert informieren, sofern dies gesetzlich geboten ist.</p>
<h2>1.8. Kontaktaufnahme</h2>
<p>Bei der Kontaktaufnahme mit uns, z.B. per E-Mail oder Telefon, werden die uns mitgeteilten Daten (z.B. Namen und E-Mail-Adressen) von uns gespeichert, um Fragen zu beantworten. Rechtsgrundlage für die Verarbeitung ist unser berechtigtes Interesse (Art. 6 Abs. 1 S. 1 lit. f DSGVO), an uns gerichtete Anfragen zu beantworten. Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung nicht mehr erforderlich ist, oder schränken die Verarbeitung ein, falls gesetzliche Aufbewahrungspflichten bestehen.</p>
<h2>1.9. Gewinnspiele</h2>
<p>Gelegentlich bieten wir über unsere Website oder auf andere Weise Gewinnspiele an. Die dabei abgefragten Daten verarbeiten wir, um die Gewinner zu ermitteln und zu benachrichtigen. Danach löschen wir die Daten. Es kann auch sein, dass wir Gewinnspiele nur für Bestandskunden anbieten. Dann verarbeiten wir nur den Namen zur Ermittlung der Gewinner und die Kontaktdaten, um die Gewinner zu benachrichtigen. Es ist unser berechtigtes Interesse, zur Kundengewinnung oder zur Interaktion mit unseren Bestandskunden Gewinnspiele anzubieten. Rechtsgrundlage der Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO.</p>
<h2>1.10. Kundenumfragen</h2>
<p>Von Zeit zu Zeit führen wir Kundenumfragen durch, um unsere Kunden und ihre Wünsche besser kennenzulernen. Dabei erheben wir die jeweils abgefragten Daten. Es ist unser berechtigtes Interesse, unsere Kunden und ihre Wünsche besser kennenzulernen, so dass Rechtsgrundlage der damit einhergehenden Datenverarbeitung Art. 6 Abs. 1 S. 1 lit f DSGVO ist. Die Daten löschen wir, wenn die Ergebnisse der Umfragen ausgewertet sind.</p>
<h2>2. Newsletter</h2>
<p>Wir behalten uns vor, Kunden, die bereits Dienstleistungen von uns in Anspruch genommen haben oder Waren gekauft gekauft haben, von Zeit zu Zeit per E-Mail oder auf anderem Weg elektronisch über unsere Angebote zu informieren, falls sie dem nicht widersprochen haben. Rechtsgrundlage für diese Datenverarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in der Direktwerbung (Erwägungsgrund 47 DSGVO). Kunden können der Verwendung ihrer E-Mail-Adresse zu Werbezwecken jederzeit ohne zusätzliche Kosten widersprechen, zum Beispiel über den Link am Ende einer jeden E-Mail oder per E-Mail an unsere oben genannte E-Mail-Adresse.</p>
<p>Auf Grundlage der Einwilligung der Empfänger (Art. 6 Abs. 1 S. 1 lit. a DSGVO)&nbsp;messen wir auch die Öffnungs- und Klickrate unserer Newsletter, um zu verstehen, welche Inhalte relevant für unsere Empfänger sind.</p>
<p>Wir versenden Newsletter mit dem Tool Klaviyo des Anbieters Klaviyo, Inc., 125 Summer St, Floor 6 Boston, MA 02111, USA (Datenschutzerklärung: https://www.klaviyo.com/privacy/policy). Der Anbieter verarbeitet dabei Inhalts-, Nutzungs-, Meta-/Kommunikationsdaten und Kontaktdaten in den USA.</p>
<h2>3. Datenverarbeitung auf unserer Website</h2>
<h2>3.1. Informatorische Nutzung der Website</h2>
<p>Bei der informatorischen Nutzung der Website, also wenn Seitenbesucher uns nicht gesondert Informationen übermitteln, erheben wir die personenbezogenen Daten, die der Browser an unseren Server übermittelt, um die Stabilität und Sicherheit unserer Website zu gewährleisten. Darin liegt unser berechtigtes Interesse, so dass Rechtsgrundlage ist Art. 6 Abs. 1 S. 1 lit. f DSGVO ist.</p>
<p>Diese Daten sind:</p>
<ul>
<li>IP-Adresse</li>
<li>Datum und Uhrzeit der Anfrage</li>
<li>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</li>
<li>Inhalt der Anfrage (konkrete Seite)</li>
<li>Zugriffsstatus/HTTP-Statuscode</li>
<li>jeweils übertragene Datenmenge</li>
<li>Website, von der die Anfrage kommt</li>
<li>Browser</li>
<li>Betriebssystem und dessen Oberfläche</li>
<li>Sprache und Version der Browsersoftware.</li>
</ul>
<p>Diese Daten werden außerdem in Logfiles gespeichert. Sie werden gelöscht, wenn ihre Speicherung nicht mehr erforderlich ist, spätestens nach 14 Tagen.</p>
<h2>3.2. Webhosting und Bereitstellung der Website</h2>
<p>Unsere Website hostet Shopify International Limited, Victoria Buildings, 2. Etage, 1-2 Haddington Road, Dublin 4, D04 XN32, Irland. Der Anbieter verarbeitet dabei die über die Website übermittelten personenbezogene Daten, z.B. auf Inhalts-, Nutzungs-, Meta-/Kommunikationsdaten oder Kontaktdaten. Es ist unser berechtigtes Interesse, eine Website zur Verfügung zu stellen, so dass die Rechtsgrundlage der Datenverarbeitung Art. 6 Abs. 1 S. 1 lit. f DSGVO ist.</p>
<h2>3.3. Kontaktformular</h2>
<p>Bei Kontaktaufnahme über das Kontaktformular auf unserer Website speichern wir die dort abgefragten Daten und den Inhalt der Nachricht.<br>Rechtsgrundlage für die Verarbeitung ist unser berechtigtes Interesse, an uns gerichtete Anfragen zu beantworten. Rechtsgrundlage für die Verarbeitung ist deshalb Art. 6 Abs. 1 S. 1 lit. f DSGVO.<br>Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung nicht mehr erforderlich ist, oder schränken die Verarbeitung ein, falls gesetzliche Aufbewahrungspflichten bestehen.</p>
<h2>3.4. Stellenanzeigen</h2>
<p>Wir veröffentlichen Stellen, die in unserem Unternehmen frei sind, auf unserer Website, auf mit der Website verbundenen Seiten oder auf Websites von Dritten.<br>Die Verarbeitung der im Rahmen der Bewerbung angegebenen Daten erfolgt zur Durchführung des Bewerbungsverfahrens. Soweit diese für unsere Entscheidung, ein Beschäftigungsverhältnis zu begründen, erforderlich sind, ist Rechtsgrundlage Art. 88 Abs. 1 DSGVO i. V. m. § 26 Abs. 1 BDSG. Die zur Durchführung des Bewerbungsverfahrens erforderlichen Daten haben wir entsprechend gekennzeichnet oder weisen auf sie hin. Wenn Bewerber diese Daten nicht angeben, können wir die Bewerbung nicht bearbeiten.<br>Weitere Daten sind freiwillig und nicht für eine Bewerbung erforderlich. Falls Bewerber weitere Angaben machen, ist Grundlage ihre Einwilligung (Art. 6 Abs. 1 S. 1 lit. a DSGVO).</p>
<p>Wir bitten Bewerber, in Lebenslauf und Anschreiben auf Angaben zu politischen Meinungen, religiösen Anschauungen und ähnlich sensiblen Daten zu verzichten. Sie sind nicht für eine Bewerbung erforderlich. Wenn Bewerber dennoch entsprechende Angaben machen, können wir ihre Verarbeitung im Rahmen der Verarbeitung des Lebenslaufes oder Anschreibens nicht verhindern. Ihre Verarbeitung beruht dann auch auf der Einwilligung der Bewerber (Art. 9 Abs. 2 lit. a DSGVO).</p>
<p>Schließlich verarbeiten wir die Daten der Bewerber für weitere Bewerbungsverfahren, wenn sie uns dazu ihre Einwilligung erteilt haben. In diesem Fall ist Rechtsgrundlage Art. 6 Abs. 1 S. 1 lit. a DSGVO.</p>
<p>Die Daten der Bewerber geben wir an die zuständigen Mitarbeiter der Personalabteilung, an unsere Auftragsverarbeiter im Bereich Recruiting und an die im Übrigen im Bewerbungsverfahren beteiligten Mitarbeiter weiter.</p>
<p>Wenn wir im Anschluss an das Bewerbungsverfahren ein Beschäftigungsverhältnis mit dem Bewerber eingehen, löschen wir die Daten erst nach Beendigung des Beschäftigungsverhältnisses. Andernfalls löschen wir die Daten spätestens sechs Monate nach Ablehnung eines Bewerbers.</p>
<p>Wenn Bewerber uns ihre Einwilligung erteilt haben, ihre Daten auch für weitere Bewerbungsverfahren zu verwenden, löschen wir ihre Daten erst ein Jahr nach Erhalt der Bewerbung.</p>
<h2>3.5. Bewertungen</h2>
<p>Seitenbesucher können auf unserer Website Bewertungen für unsere Waren, Dienstleistungen oder allgemein zu unserem Unternehmen hinterlassen. Dafür verarbeiten wir neben den eingegebenen Daten Meta- oder Kommunikationsdaten. Wir haben ein berechtigtes Interesse daran, von Seitenbesuchern eine Rückmeldung zu unserem Angebot zu erhalten. Deshalb ist Rechtsgrundlage der Datenverarbeitung Art. 6 Abs. 1 S. 1 lit. f DSGVO. Soweit wir für die Vereinbarung ein Tool eines Drittanbieters verwenden, sind die Informationen dazu unter "Drittanbieter" zu finden.</p>
<h2>3.6. Kundenbereich</h2>
<p>Seitenbesucher können auf unserer Website ein Kundenkonto eröffnen. Die in diesem Rahmen abgefragten Daten verarbeiten wir zur Erfüllung des jeweils geschlossenen Nutzungsvertrages über das Konto, so dass Rechtsgrundlage der Verarbeitung Art. 6 Abs. 1 S. 1 lit. b DSGVO ist.</p>
<h2>3.7. Angebot von Waren</h2>
<p>Wir bieten über unsere Website Waren an. In den Bestellvorgang oder Versand binden wir die folgenden Dienstleister ein, die zur Erbringung einer Leistung nur die jeweils erforderlichen personenbezogenen Daten erhalten:</p>
<ul>
<li>ProPerfect GmbH, Gottlieb-Daimler-Straße 8, 86462 Langweid am Lech</li>
<li>JTL-Software-GmbH, Rheinstr. 7, 41836 Hückelhoven</li>
<li>ReCharge, Inc., 3030 Nebraska Avenue, Suite 301, Santa Monica, CA 90025, USA</li>
</ul>
<p>Die Verarbeitung der Daten erfolgt zur Erbringung des mit dem jeweiligen Seitenbesucher geschlossenen Vertrags (Art. 6 Abs. 1 S. 1 lit. b DSGVO).</p>
<h2>3.8. Zahlungsdienstleister</h2>
<p>Zur Abwicklung von Zahlungen nutzen wir Zahlungsabwickler, die selbst datenschutzrechtlich Verantwortliche im Sinne von Art. 4 Nr. 7 DSGVO sind. Soweit diese von uns im Bestellprozess eingegebene Daten und Zahlungsdaten erhalten, erfüllen wir damit den mit unseren Kunden geschlossenen Vertrag (Art. 6 Abs. 1 S. 1 lit. b DSGVO).</p>
<p>Diese Zahlungsdienstleister sind:</p>
<ul>
<li>Amazon Payments Europe s.c.a., Luxemburg</li>
<li><span>Apple Inc., USA (für Apple Pay)</span></li>
<li><span>Google Ireland Limited, Irland (für Google Pay)</span></li>
<li>Klarna Bank AB (publ), Schweden</li>
<li>Mastercard Europe SA, Belgien</li>
<li>PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxemburg</li>
<li><span>Shopify Inc., Kanada (für Shop Pay)</span></li>
<li>Visa Europe Services Inc., Großbritannien</li>
</ul>
<h2>3.9. Drittanbieter</h2>
<h3>3.9.1. LinkedIn Share button</h3>
<p>Wir verwenden LinkedIn Share button zum Teilen von Interessen in sozialen Medien. Der Anbieter ist LinkedIn Ireland Unlimited Company, Wilton Place, Dublin 2, Irland. Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) und Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in der EU.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.linkedin.com/legal/privacy-policy? abrufbar.</p>
<h3>3.9.2. Strato</h3>
<p>Wir verwenden Strato zur Speicherung in der Cloud und Hosting. Der Anbieter ist STRATO AG, Pascalstraße 10, 10587 Berlin. Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) und Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in der EU.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse, Daten auf einfachem und günstigen Weg zu speichern.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.strato.de/datenschutz/ abrufbar.</p>
<h3>3.9.3. Shopify</h3>
<p>Wir verwenden Shopify zur Unterhaltung eines Online-Shops. <span>Der Anbieter ist Shopify International Limited, Victoria Buildings, 2. </span>Etage, 1-2 Haddington Road, Dublin 4, D04 XN32, Irland. Der Anbieter verarbeitet Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in der EU.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.shopify.de/legal/datenschutz abrufbar.</p>
<h3>3.9.4. Facebook Custom Audiences</h3>
<p>Wir verwenden Facebook Custom Audiences für Werbung. <span>Der Anbieter ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Wir löschen die Daten, wenn der Zweck ihrer Erhebung entfallen ist. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.facebook.com/policy.php abrufbar.</p>
<h3>3.9.5. Facebook Pixel</h3>
<p>Wir verwenden Facebook Pixel zur Analyse. <span>Der Anbieter ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.facebook.com/policy.php abrufbar.</p>
<h3>3.9.6. Klaviyo</h3>
<p>Wir verwenden Klaviyo zum E-Mail-Marketing und Management von Kundenbeziehungen. Der Anbieter ist Klaviyo, Inc., 125 Summer St, Floor 6 Boston, MA 02111, USA. Der Anbieter verarbeitet Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.klaviyo.com/privacy/policy abrufbar.</p>
<h3>3.9.7. Google Conversion Tag</h3>
<p>Wir verwenden Google Conversion Tag zum Konvertierungs-Tracking. <span>Der Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. </span>Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://policies.google.com/privacy?hl=de https://support.google.com/tagmanager/answer/9323295?hl=de&amp;ref_topic=3441532 abrufbar.</p>
<h3>3.9.8. Facebook Conversion API</h3>
<p>Wir verwenden Facebook Conversion API zur Analyse. <span>Der Anbieter ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) und Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://www.facebook.com/policy.php abrufbar.</p>
<h3>3.9.9. Google Analytics</h3>
<p>Wir verwenden Google Analytics zur Analyse. Der Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Dublin, D04e5w5, Irland. Der Anbieter verarbeitet Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten) und Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen) in den USA.</p>
<p>Die Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 S. 1 lit. a DSGVO. Die Verarbeitung erfolgt auf der Basis von Einwilligungen. Betroffene können ihre Einwilligung jederzeit widerrufen, indem sie uns z.B. unter den in unser Datenschutzerklärung angegebenen Kontaktdaten kontaktieren. Der Widerruf berührt nicht die Rechtmäßigkeit der Verarbeitung bis zum Widerruf.</p>
<p>Rechtsgrundlage der Übermittlung in ein Land außerhalb des EWR sind Standardvertragsklauseln. Die Sicherheit der in das Drittland (also einem Land außerhalb des EWR) übermittelten Daten ist durch gemäß dem Prüfverfahren nach Art. 93 Abs. 2 DSGVO erlassene Standarddatenschutzklauseln gewährleistet (Art. 46 Abs. 2 lit. c DSGVO), die wir mit dem Anbieter vereinbart haben.</p>
<p>Die Daten werden gelöscht, wenn der Zweck ihrer Erhebung entfallen ist und keine Aufbewahrungspflicht entgegensteht. Weitere Informationen sind in der Datenschutzerklärung des Anbieters unter https://policies.google.com/privacy?hl=de abrufbar.</p>
<h2>4. Datenverarbeitung auf Social Media-Plattformen</h2>
<p>Wir sind in Social Media-Netzwerken vertreten, um dort unser Unternehmen und unsere Leistungen vorzustellen. Die Betreiber dieser Netzwerke verarbeiten Daten ihrer Nutzer regelmäßig zu Werbezwecken. Unter anderem erstellen sie aus ihrem Onlineverhalten Nutzerprofile, die beispielsweise dazu verwendet werden, um auf den Seiten der Netzwerke und auch sonst im Internet Werbung zu zeigen, die den Interessen der Nutzer entspricht. Dazu speichern die Betreiber der Netzwerke Informationen zu dem Nutzungsverhalten in Cookies auf dem Rechner der Nutzer. Es ist außerdem nicht auszuschließen, dass die Betreiber diese Informationen mit weiteren Daten zusammenführen. Weitere Informationen sowie Hinweise, wie Nutzer der Verarbeitung durch die Seitenbetreiber widersprechen können, erhalten Nutzer in den unten aufgeführten Datenschutzerklärungen der jeweiligen Betreiber. Es kann auch sein, dass die Betreiber oder ihre Server in Nicht-EU-Staaten sitzen, so dass sie Daten dort verarbeiten. Hierdurch können sich für die Nutzer Risiken ergeben, z.B. weil die Durchsetzung ihrer Rechte erschwert wird oder staatliche Stellen Zugriff auf die Daten nehmen.</p>
<p>Wenn Nutzer der Netzwerke mit uns über unsere Profile in Kontakt treten, verarbeiten wir die uns mitgeteilten Daten, um die Anfragen zu beantworten. Darin liegt unser berechtigtes Interesse, so dass Rechtsgrundlage Art. 6 Abs. 1 S. 1 lit. f DSGVO ist.</p>
<h2>4.1. Facebook</h2>
<p>Wir unterhalten ein Profil auf Facebook. <span>Betreiber ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Die Datenschutzerklärung ist hier abrufbar: https://www.facebook.com/policy.php. Eine Möglichkeit, der Datenverarbeitung zu widersprechen, ergibt sich über Einstellungen für Werbeanzeigen: https://www.facebook.com/settings?tab=ads.<br>Wir sind auf Grundlage einer Vereinbarung gemeinsam im Sinne von Art. 26 DSGVO mit Facebook für die Verarbeitung der Daten der Besucher unseres Profils verantwortlich. Welche Daten genau verarbeitet werden, erklärt Facebook unter https://www.facebook.com/legal/terms/information_about_page_insights_data. Betroffene können ihre Rechte sowohl gegenüber uns als auch gegenüber Facebook wahrnehmen. Nach unserer Vereinbarung mit Facebook sind wir aber dazu verpflichtet, Anfragen an Facebook weiterzuleiten. Betroffene erhalten also eine schnellere Rückmeldung, wenn sie sich direkt an Facebook wenden.</p>
<h2>4.2. Instagram</h2>
<p>Wir unterhalten ein Profil auf Instagram. <span>Betreiber ist Facebook Ireland Ltd., 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. </span>Die Datenschutzerklärung ist hier abrufbar: https://help.instagram.com/519522125107875.</p>
<h2>4.3. Twitter</h2>
<p>Wir unterhalten ein Profil auf Twitter. <span>Betreiber ist Twitter Inc., 1355 Market Street, Suite 900, San Francisco, CA 94103, USA. </span>Die Datenschutzerklärung ist hier abrufbar: https://twitter.com/de/privacy. Eine Möglichkeit, der Datenverarbeitung zu widersprechen, ergibt sich über die Einstellungen für Werbeanzeigen: https://twitter.com/personalization.</p>
<h2>4.4. LinkedIn</h2>
<p>Wir unterhalten ein Profil auf LinkedIn. <span>Betreiber ist LinkedIn Ireland Unlimited Company, Wilton Place, Dublin 2, Irland. </span>Die Datenschutzerklärung ist hier abrufbar: https://https://www.linkedin.com/legal/privacy-policy?_l=de_DE. Eine Möglichkeit, der Datenverarbeitung zu widersprechen, ergibt sich über die Einstellungen für Werbeanzeigen: https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out.</p>
<h2>4.5. Whats App</h2>
<p dir="ltr"><span>Der für die Verarbeitung Verantwortliche setzt WhatsApp als Mittel zur Kommunikation zwischen Mitarbeitern, Kunden, Geschäftspartnern, Shareholdern und Steakholdern ein.</span><b></b></p>
<p dir="ltr"><span>Bei WhatsApp handelt es sich um eine weit verbreitete Applikation mit der man unter anderem chatten, telefonieren und Sprachnachrichten versenden kann.&nbsp;</span><b></b></p>
<p dir="ltr"><span>Betreibergesellschaft des Dienstes ist die WhatsApp Ireland Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Ireland. Wir setzen als </span><a href="https://chatarmin.com/"><span>WhatsApp Marketing Tool</span></a><span> von der Firma </span><a href="http://chatarmin.com/"><span>chatarmin.com</span></a><span> mit Sitz in Wien, Österreich, ein. Zweck der Verarbeitung ist es, betriebliche Kommunikation abzuwickeln.</span><b></b></p>
<p dir="ltr"><span>Die Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DS-GVO. WhatsApp wird eingesetzt, um Kommunikation abzuwickeln. WhatsApp speichert personenbezogene Kommunikationsdaten und nimmt selbst Zugriff auf personenbezogene Daten, insbesondere auf das Telefonbuch von Mobilfunkgeräten, genauer: Alle Rufnummern der im Telefon gespeicherten Personen werden ausgelesen.</span><b></b></p>
<p dir="ltr"><span>Die über WhatsApp abgewickelte Kommunikation, die erhobenen Rufnummern und alle sonstigen Daten werden oder könnten Dritten, insbesondere Facebook oder anderen Unternehmen sowie amerikanischen oder internationalen Geheimdiensten übermittelt werden. Sofern Sie nicht möchten, dass wir Ihre Rufnummer in einem unserer Mobilfunkgeräte speichern und/oder Kommunikation mit Ihnen über WhatsApp abwickeln, bitte informieren Sie uns einfach. In einem solchen Fall würden wir selbstverständlich auf alternativ zur Verfügung stehende Möglichkeiten der Kommunikation (z.B. Telefonanruf) zurückgreifen.</span><b></b></p>
<p dir="ltr"><span>Weitere Informationen und die geltenden Datenschutzbestimmungen von WhatsApp können unter </span><a href="https://www.whatsapp.com/legal/#privacy-policy"><span>https://www.whatsapp.com/legal/#privacy-policy</span></a><span> abgerufen werden. Weitere Informationen zu unsererer </span><a href="https://chatarmin.com/"><span>WhatsApp Software</span></a><span> auf der Website von Chatarmin.</span></p>
<h2>5. Änderungen dieser Datenschutzerklärung</h2>
<p>Wir behalten uns das Recht vor, diese Datenschutzerklärung mit Wirkung für die Zukunft zu ändern. Eine aktuelle Version ist jeweils hier verfügbar.</p>
<h2>6. Fragen und Kommentare</h2>
<p>Für Fragen oder Kommentare bezüglich dieser Datenschutzerklärung stehen wir gern unter den oben angegebenen Kontaktdaten zur Verfügung.</p>
`;

const AGB_TEXT = `
Inhaltsverzeichnis


Geltungsbereich
Vertragsschluss
Widerrufsrecht
Preise und Zahlungsbedingungen
Liefer- und Versandbedingungen
Eigentumsvorbehalt
Mängelhaftung (Gewährleistung)
Besondere Bedingungen für die Verarbeitung von Waren nach bestimmten Vorgaben des Kunden
Abonnement-Richtlinien
Einlösung von Aktionsgutscheinen
Anwendbares Recht
Gerichtsstand

1) Geltungsbereich

1.1 Diese Allgemeinen Geschäftsbedingungen (nachfolgend “AGB”) der be tanics GmbH (nachfolgend “Verkäufer”), gelten für alle Verträge über die Lieferung von Waren, die ein Verbraucher oder Unternehmer (nachfolgend „Kunde“) mit dem Verkäufer hinsichtlich der vom Verkäufer in seinem Online-Shop dargestellten Waren abschließt. Hiermit wird der Einbeziehung von eigenen Bedingungen des Kunden widersprochen, es sei denn, es ist etwas anderes vereinbart.

1.2 Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können. Unternehmer im Sinne dieser AGB ist eine natürliche oder juristische Person oder eine rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt.

1.3 Gegenstand des Vertrages kann – je nach Produktbeschreibung des Verkäufers – sowohl der Bezug von Waren im Wege einer Einmallieferung als auch der Bezug von Waren im Wege einer dauerhaften Lieferung (nachfolgend „Abonnementvertrag“) sein. Beim Abonnementvertrag verpflichtet sich der Verkäufer, dem Kunden die vertraglich geschuldete Ware für die Dauer der vereinbarten Vertragslaufzeit in den vertraglich geschuldeten Zeitintervallen zu liefern.

2) Vertragsschluss

2.1 Die im Online-Shop des Verkäufers enthaltenen Produktbeschreibungen stellen keine verbindlichen Angebote seitens des Verkäufers dar, sondern dienen zur Abgabe eines verbindlichen Angebots durch den Kunden.

2.2 Der Kunde kann das Angebot über das in den Online-Shop des Verkäufers integrierte Online-Bestellformular abgeben. Dabei gibt der Kunde, nachdem er die ausgewählten Waren in den virtuellen Warenkorb gelegt und den elektronischen Bestellprozess durchlaufen hat, durch Klicken des den Bestellvorgang abschließenden Buttons ein rechtlich verbindliches Vertragsangebot in Bezug auf die im Warenkorb enthaltenen Waren ab.

2.3 Der Verkäufer kann das Angebot des Kunden innerhalb von fünf Tagen annehmen,

indem er dem Kunden eine schriftliche Auftragsbestätigung oder eine Auftragsbestätigung in Textform (Fax oder E-Mail) übermittelt, wobei insoweit der Zugang der Auftragsbestätigung beim Kunden maßgeblich ist, oder
indem er dem Kunden die bestellte Ware liefert, wobei insoweit der Zugang der Ware beim Kunden maßgeblich ist, oder
indem er den Kunden nach Abgabe von dessen Bestellung zur Zahlung auffordert.

Liegen mehrere der vorgenannten Alternativen vor, kommt der Vertrag in dem Zeitpunkt zustande, in dem eine der vorgenannten Alternativen zuerst eintritt. Die Frist zur Annahme des Angebots beginnt am Tag nach der Absendung des Angebots durch den Kunden zu laufen und endet mit dem Ablauf des fünften Tages, welcher auf die Absendung des Angebots folgt. Nimmt der Verkäufer das Angebot des Kunden innerhalb vorgenannter Frist nicht an, so gilt dies als Ablehnung des Angebots mit der Folge, dass der Kunde nicht mehr an seine Willenserklärung gebunden ist.

2.4 Bei Auswahl einer von PayPal angebotenen Zahlungsart erfolgt die Zahlungsabwicklung über den Zahlungsdienstleister PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg (im Folgenden: „PayPal“), unter Geltung der PayPal-Nutzungsbedingungen, einsehbar unter&nbsp;https://www.paypal.com/de/webapps/mpp/ua/useragreement-full&nbsp;oder – falls der Kunde nicht über ein PayPal-Konto verfügt – unter Geltung der Bedingungen für Zahlungen ohne PayPal-Konto, einsehbar unter&nbsp;https://www.paypal.com/de/webapps/mpp/ua/privacywax-full. Zahlt der Kunde mittels einer im Online-Bestellvorgang auswählbaren von PayPal angebotenen Zahlungsart, erklärt der Verkäufer schon jetzt die Annahme des Angebots des Kunden in dem Zeitpunkt, in dem der Kunde den den Bestellvorgang abschließenden Button anklickt.

2.5 Bei der Abgabe eines Angebots über das Online-Bestellformular des Verkäufers wird der Vertragstext nach dem Vertragsschluss vom Verkäufer gespeichert und dem Kunden nach Absendung von dessen Bestellung in Textform (z. B. E-Mail, Fax oder Brief) übermittelt. Eine darüber hinausgehende Zugänglichmachung des Vertragstextes durch den Verkäufer erfolgt nicht. Sofern der Kunde vor Absendung seiner Bestellung ein Nutzerkonto im Online-Shop des Verkäufers eingerichtet hat, werden die Bestelldaten auf der Website des Verkäufers archiviert und können vom Kunden über dessen passwortgeschütztes Nutzerkonto unter Angabe der entsprechenden Login-Daten kostenlos abgerufen werden.

2.6 Vor verbindlicher Abgabe der Bestellung über das Online-Bestellformular des Verkäufers kann der Kunde mögliche Eingabefehler durch aufmerksames Lesen der auf dem Bildschirm dargestellten Informationen erkennen. Ein wirksames technisches Mittel zur besseren Erkennung von Eingabefehlern kann dabei die Vergrößerungsfunktion des Browsers sein, mit deren Hilfe die Darstellung auf dem Bildschirm vergrößert wird. Seine Eingaben kann der Kunde im Rahmen des elektronischen Bestellprozesses so lange über die üblichen Tastatur- und Mausfunktionen korrigieren, bis er den Bestellvorgang abschließenden Button anklickt.

2.7 Für den Vertragsschluss steht ausschließlich die deutsche Sprache zur Verfügung.

2.8 Die Bestellabwicklung und Kontaktaufnahme finden in der Regel per E-Mail und automatisierter Bestellabwicklung statt. Der Kunde hat sicherzustellen, dass die von ihm zur Bestellabwicklung angegebene E-Mail-Adresse zutreffend ist, so dass unter dieser Adresse die vom Verkäufer versandten E-Mails empfangen werden können. Insbesondere hat der Kunde bei dem Einsatz von SPAM-Filtern sicherzustellen, dass alle vom Verkäufer oder von diesem mit der Bestellabwicklung beauftragten Dritten versandten E-Mails zugestellt werden können.

3) Widerrufsrecht

3.1 Verbrauchern steht grundsätzlich ein Widerrufsrecht zu.

3.2 Nähere Informationen zum Widerrufsrecht ergeben sich aus der Widerrufsbelehrung des Verkäufers.

4) Preise und Zahlungsbedingungen

4.1 Sofern sich aus der Produktbeschreibung des Verkäufers nichts anderes ergibt, handelt es sich bei den angegebenen Preisen um Gesamtpreise, die die gesetzliche Umsatzsteuer enthalten. Gegebenenfalls zusätzlich anfallende Liefer- und Versandkosten werden in der jeweiligen Produktbeschreibung gesondert angegeben.

4.2 Die Zahlungsmöglichkeit/en wird/werden dem Kunden im Online-Shop des Verkäufers mitgeteilt.

4.3 Bei Auswahl der Zahlungsart „SOFORT“ erfolgt die Zahlungsabwicklung über den Zahlungsdienstleister SOFORT GmbH, Theresienhöhe 12, 80339 München (im Folgenden „SOFORT“). Um den Rechnungsbetrag über „SOFORT“ bezahlen zu können, muss der Kunde über ein für die Teilnahme an „SOFORT“ frei geschaltetes Online-Banking-Konto verfügen, sich beim Zahlungsvorgang entsprechend legitimieren und die Zahlungsanweisung gegenüber „SOFORT“ bestätigen. Die Zahlungstransaktion wird unmittelbar danach von „SOFORT“ durchgeführt und das Bankkonto des Kunden belastet. Nähere Informationen zur Zahlungsart „SOFORT“ kann der Kunde im Internet unter&nbsp;https://www.klarna.com/sofort/&nbsp;abrufen.

4.4 Bei Auswahl einer über den Zahlungsdienst “Klarna” angebotenen Zahlungsart erfolgt die Zahlungsabwicklung über die Klarna Bank AB (publ), Sveavägen 46, 111 34 Stockholm, Schweden (nachfolgend „Klarna“). Nähere Informationen sowie die Bedingungen von Klarna hierzu finden sich in den Zahlungsinformationen des Verkäufers, welche hier einsehbar sind:&nbsp;https://www.klarna.com/

5) Liefer- und Versandbedingungen

5.1 Die Lieferung von Waren erfolgt auf dem Versandweg an die vom Kunden angegebene Lieferanschrift, sofern nichts anderes vereinbart ist. Bei der Abwicklung der Transaktion ist die in der Bestellabwicklung des Verkäufers angegebene Lieferanschrift maßgeblich.

5.2 Scheitert die Zustellung der Ware aus Gründen, die der Kunde zu vertreten hat, trägt der Kunde die dem Verkäufer hierdurch entstehenden angemessenen Kosten. Dies gilt im Hinblick auf die Kosten für die Hinsendung nicht, wenn der Kunde sein Widerrufsrecht wirksam ausübt. Für die Rücksendekosten gilt bei wirksamer Ausübung des Widerrufsrechts durch den Kunden die in der Widerrufsbelehrung des Verkäufers hierzu getroffene Regelung.

5.3 Der Verkäufer behält sich das Recht vor, im Falle nicht richtiger oder nicht ordnungsgemäßer Selbstbelieferung vom Vertrag zurückzutreten. Dies gilt nur für den Fall, dass die Nichtlieferung nicht vom Verkäufer zu vertreten ist und dieser mit der gebotenen Sorgfalt ein konkretes Deckungsgeschäft mit dem Zulieferer abgeschlossen hat. Der Verkäufer wird alle zumutbaren Anstrengungen unternehmen, um die Ware zu beschaffen. Im Falle der Nichtverfügbarkeit oder der nur teilweisen Verfügbarkeit der Ware wird der Kunde unverzüglich informiert und die Gegenleistung unverzüglich erstattet.

5.4 Selbstabholung ist aus logistischen Gründen nicht möglich.

6) Eigentumsvorbehalt

Tritt der Verkäufer in Vorleistung, behält er sich bis zur vollständigen Bezahlung des geschuldeten Kaufpreises das Eigentum an der gelieferten Ware vor.

7) Mängelhaftung (Gewährleistung)

7.1 Ist die Kaufsache mangelhaft, gelten die Vorschriften der gesetzlichen Mängelhaftung.

7.2 Handelt der Kunde als Verbraucher, so wird er gebeten, angelieferte Waren mit offensichtlichen Transportschäden bei dem Zusteller zu reklamieren und den Verkäufer hiervon in Kenntnis zu setzen. Kommt der Kunde dem nicht nach, hat dies keinerlei Auswirkungen auf seine gesetzlichen oder vertraglichen Mängelansprüche.

8) Besondere Bedingungen für die Verarbeitung von Waren nach bestimmten Vorgaben des Kunden

8.1 Schuldet der Verkäufer nach dem Inhalt des Vertrages neben der Warenlieferung auch die Verarbeitung der Ware nach bestimmten Vorgaben des Kunden, hat der Kunde dem Verkäufer alle für die Verarbeitung erforderlichen Inhalte wie Texte, Bilder oder Grafiken in den vom Verkäufer vorgegebenen Dateiformaten, Formatierungen, Bild- und Dateigrößen zur Verfügung zu stellen und ihm die hierfür erforderlichen Nutzungsrechte einzuräumen. Für die Beschaffung und den Rechteerwerb an diesen Inhalten ist allein der Kunde verantwortlich. Der Kunde erklärt und übernimmt die Verantwortung dafür, dass er das Recht besitzt, die dem Verkäufer überlassenen Inhalte zu nutzen. Er trägt insbesondere dafür Sorge, dass hierdurch keine Rechte Dritter verletzt werden, insbesondere Urheber-, Marken- und Persönlichkeitsrechte.

8.2 Der Kunde stellt den Verkäufer von Ansprüchen Dritter frei, die diese im Zusammenhang mit einer Verletzung ihrer Rechte durch die vertragsgemäße Nutzung der Inhalte des Kunden durch den Verkäufer diesem gegenüber geltend machen können. Der Kunde übernimmt hierbei auch die angemessenen Kosten der notwendigen Rechtsverteidigung einschließlich aller Gerichts- und Anwaltskosten in gesetzlicher Höhe. Dies gilt nicht, wenn die Rechtsverletzung vom Kunden nicht zu vertreten ist. Der Kunde ist verpflichtet, dem Verkäufer im Falle einer Inanspruchnahme durch Dritte unverzüglich, wahrheitsgemäß und vollständig alle Informationen zur Verfügung zu stellen, die für die Prüfung der Ansprüche und eine Verteidigung erforderlich sind.

8.3 Der Verkäufer behält sich vor, Verarbeitungsaufträge abzulehnen, wenn die vom Kunden hierfür überlassenen Inhalte gegen gesetzliche oder behördliche Verbote oder gegen die guten Sitten verstoßen. Dies gilt insbesondere bei Überlassung verfassungsfeindlicher, rassistischer, fremdenfeindlicher, diskriminierender, beleidigender, Jugend gefährdender und/oder Gewalt verherrlichender Inhalte.

9)&nbsp;Vertragsdauer und Vertragsbeendigung bei Abonnementverträgen


Abonnementverträge werden unbefristet geschlossen und können vom Kunden jederzeit ohne Einhaltung einer Kündigungsfrist gekündigt werden.


 Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Ein wichtiger Grund liegt vor, wenn dem kündigenden Teil unter Berücksichtigung aller Umstände des Einzelfalls und unter Abwägung der beiderseitigen Interessen die Fortsetzung des Vertragsverhältnisses bis zur vereinbarten Beendigung oder bis zum Ablauf einer Kündigungsfrist nicht zugemutet werden kann.

Kündigungen haben über den Webshop zu erfolgen.

10) Einlösung von Aktionsgutscheinen

10.1 Gutscheine, die vom Verkäufer im Rahmen von Werbeaktionen mit einer bestimmten Gültigkeitsdauer unentgeltlich ausgegeben werden und die vom Kunden nicht käuflich erworben werden können (nachfolgend “Aktionsgutscheine”), können nur im Online-Shop des Verkäufers und nur im angegebenen Zeitraum eingelöst werden.

10.2 Aktionsgutscheine können nur von Verbrauchern eingelöst werden.

10.3 Einzelne Produkte können von der Gutscheinaktion ausgeschlossen sein, sofern sich eine entsprechende Einschränkung aus dem Inhalt des Aktionsgutscheins ergibt.

10.4 Aktionsgutscheine können nur vor Abschluss des Bestellvorgangs eingelöst werden. Eine nachträgliche Verrechnung ist nicht möglich.

10.5 Pro Bestellung kann immer nur ein Aktionsgutschein eingelöst werden.

10.6 Der Warenwert muss mindestens dem Betrag des Aktionsgutscheins entsprechen. Etwaiges Restguthaben wird vom Verkäufer nicht erstattet.

10.7 Reicht der Wert des Aktionsgutscheins zur Deckung der Bestellung nicht aus, kann zur Begleichung des Differenzbetrages eine der übrigen vom Verkäufer angebotenen Zahlungsarten gewählt werden.

10.8 Das Guthaben eines Aktionsgutscheins wird weder in Bargeld ausgezahlt noch verzinst.

10.9 Der Aktionsgutschein wird nicht erstattet, wenn der Kunde die mit dem Aktionsgutschein ganz oder teilweise bezahlte Ware im Rahmen seines gesetzlichen Widerrufsrechts zurückgibt.

11) Anwendbares Recht

Für sämtliche Rechtsbeziehungen der Parteien gilt das Recht der Bundesrepublik Deutschland unter Ausschluss der Gesetze über den internationalen Kauf beweglicher Waren. Bei Verbrauchern gilt diese Rechtswahl nur insoweit, als nicht der gewährte Schutz durch zwingende Bestimmungen des Rechts des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, entzogen wird.

12) Gerichtsstand

Handelt der Kunde als Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen mit Sitz im Hoheitsgebiet der Bundesrepublik Deutschland, ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag der Geschäftssitz des Verkäufers. Hat der Kunde seinen Sitz außerhalb des Hoheitsgebiets der Bundesrepublik Deutschland, so ist der Geschäftssitz des Verkäufers ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag, wenn der Vertrag oder Ansprüche aus dem Vertrag der beruflichen oder gewerblichen Tätigkeit des Kunden zugerechnet werden können. Der Verkäufer ist in den vorstehenden Fällen jedoch in jedem Fall berechtigt, das Gericht am Sitz des Kunden anzurufen.
`;

/** === Assets – passend zu deiner Struktur === */
const ASSETS = {
  // Videos
  videoHeroDesktop: "/video/hero-desktop.mp4",
  videoHeroMobile:  "/video/hero-mobile.mp4",

  // Produkt
  heroProductDesktop: "/img/hero-product-mobile.png",
  heroProductMobile:  "/img/hero-product-mobile.png",
  productClose:       "/img/product-close.png",

  // Lifestyle
  lifestyle1Desktop: "/img/lifestyle-1-desktop.jpg",
  lifestyle1Mobile:  "/img/lifestyle-1-mobile.jpg",
  lifestyle2Desktop: "/img/lifestyle-2-desktop.jpg",
  lifestyle2Mobile:  "/img/lifestyle-2-mobile.jpg",

  // Logos
  logos: ["/img/logos/amazon.svg", "/img/logos/Handelsblatt.svg", "/img/logos/tegut.svg"],

  // Ingredients
  ingredients: {
    elektrolyte:  "/img/ing/Elektrolyte.svg",
    kaktusfeige:  "/img/ing/Kaktusfeige.svg",
    choline:      "/img/ing/Choline.svg",
    mariendistel: "/img/ing/Mariendistel.svg",
  },

  // UGC Videos und Thumbs
  ugcVideos: [
    { src: "/video/ugc/scene1.mp4", poster: "/img/ugc/scene1.jpg" },
    { src: "/video/ugc/scene2.mp4", poster: "/img/ugc/scene2.jpg" },
    { src: "/video/ugc/scene3.mp4", poster: "/img/ugc/scene3.jpg" },
    { src: "/video/ugc/scene4.mp4", poster: "/img/ugc/scene4.jpg" },
  ],


  // Optional Grain
  bgGrain: "/img/bg/grain.png",

  // Capsule Story
  capsule: {
    closed: "/img/capsule/capsule.png",
    open:   "/img/capsule/capsule-open.png",
  },

  // Capsule Icons
  capsuleIcons: {
    electrolytes: "/img/capsule/icons/electrolytes.png",
    magnesium:    "/img/capsule/icons/magnesium.png",
    kalium:       "/img/capsule/icons/kalium.png",
    choline:      "/img/capsule/icons/choline.png",
    b2:           "/img/capsule/icons/vitamin-b2.png",
    b5:           "/img/capsule/icons/vitamin-b5.png",
    mariendistel: "/img/capsule/icons/mariendistel.png",
    kaktusfeige:  "/img/capsule/icons/kaktusfeige.png",
  },

  // Audio + Sound Icons
  audio: {
    trackMp3: "/audio/hydrated-elevated.mp3",
    trackOgg: "/audio/hydrated-elevated.ogg",
  },
  icons: {
    soundOn:    "/img/icons/sound-on.png",
    soundOff:   "/img/icons/sound-off.png",
    spotify:    "/img/icons/spotify.png",
  },
  links: {
    spotify:    "https://open.spotify.com/intl-de/track/2FJ9aD64rJsjJydTeBHaMA?si=dffd2830a5184504",
  }
};

/** UTM passthrough */
function buildCheckoutUrl(currentUrl: string) {
  const src = new URL(currentUrl);
  const dest = new URL(CHECKOUT_BASE);
  const keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","ttclid","gclid","fbclid","msclkid","ad","adset","creative","placement"];
  keys.forEach(k => { const v = src.searchParams.get(k); if (v) dest.searchParams.set(k, v); });
  if (DEFAULT_DISCOUNT) dest.searchParams.set("discount", DEFAULT_DISCOUNT);
  return dest.toString();
}

/** Checkout für 1/3/6 */
function buildCheckoutQtyUrl(currentUrl: string, qty: number) {
  const base = `https://www.betanics.de/cart/49251074867468:${qty}`;
  const src = new URL(currentUrl);
  const dest = new URL(base);
  const keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","ttclid","gclid","fbclid","msclkid","ad","adset","creative","placement"];
  keys.forEach(k => { const v = src.searchParams.get(k); if (v) dest.searchParams.set(k, v); });
  if (DEFAULT_DISCOUNT) dest.searchParams.set("discount", DEFAULT_DISCOUNT);
  return dest.toString();
}

/* ---------- kleine Helfer ---------- */
function useParallax(ref: React.RefObject<HTMLElement>, range = [30, -30] as [number, number]) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useTransform(scrollYProgress, [0, 1], range);
}
function HoverTilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      className={className + " will-change-transform"}
      onMouseMove={e => {
        if (reduce) return;
        const el = e.currentTarget as HTMLDivElement;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateZ(0)`;
      }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; }}
    >
      {children}
    </div>
  );
}

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1 text-amber-300">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} aria-hidden>★</span>
      ))}
    </div>
  );
}

function LegalModal({
  open,
  title,
  content,
  onClose,
}: {
  open: boolean;
  title: string;
  content: string; // wir rendern als HTML
  onClose: () => void;
}) {
  // Esc schließen + Body-Scroll locken
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) {
      document.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative z-[101] w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950 text-white shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-neutral-300 hover:bg-neutral-800"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 max-h-[75vh] overflow-y-auto text-sm leading-relaxed prose prose-invert prose-p:my-3 prose-li:my-1">
          {/* sichere HTML-Ausgabe wenn du HTML einfügst */}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="px-5 py-3 border-t border-neutral-800 text-right">
          <button
            onClick={onClose}
            className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-neutral-200"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote, meta, delay = 0
}: {
  quote: string; meta: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // eigener Scroll-Progress je Karte
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 15%"] });
  // sanftes „Wobble“ + seitliches Driften
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const x = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay }}
      style={{ rotate, x }}
      className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-6"
    >
      <div className="flex items-center justify-between">
        <StarRow />
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80">
          verifiziert
        </span>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed">“{quote}”</p>
      <p className="mt-2 text-neutral-400 text-sm">— {meta}</p>
    </motion.div>
  );
}

function Testimonials() {
  const items = [
    { q: "Endlich mal ein Produkt ohne Zucker & ohne Rumgerühre.", m: "Lukas, Hamburg" },
    { q: "Schmeckt nach… nix. Und das ist das Beste daran.",       m: "Sarah, Köln" },
    { q: "Perfekt fürs Reisegepäck. Muss mit.",                    m: "Melina, München" },
    { q: "Kapsel > Pulver. Punkt.",                                m: "Tom, Leipzig" },
  ];
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 md:px-8 py-14">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
        Was echte Nutzer:innen sagen:
      </h2>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {items.map((t, i) => (
          <TestimonialCard key={i} quote={t.q} meta={t.m} delay={i * 0.05} />
        ))}
      </div>
    </section>
  );
}

function UGCVideoTile({ src, poster }: { src: string; poster: string }) {
  const vRef = React.useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = React.useState(false);

  const toggle = () => {
    const v = vRef.current;
    if (!v) return;

    // iOS/Autoplay-Policy: Aktion kommt aus User-Geste, daher erlaubt
    if (v.paused) {
      v.muted = false;       // mit Ton abspielen
      v.volume = 1;
      v.play().then(() => setPlaying(true)).catch(() => {/* ignore */});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  // Wenn das Video zu Ende ist, wieder Poster zeigen
  React.useEffect(() => {
    const v = vRef.current;
    if (!v) return;
    const onEnd = () => setPlaying(false);
    v.addEventListener("ended", onEnd);
    return () => v.removeEventListener("ended", onEnd);
  }, []);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 cursor-pointer"
      onClick={toggle}
      role="button"
      aria-label={playing ? "Video pausieren" : "Video abspielen"}
    >
      {/* Poster solange nicht gespielt wird */}
      {!playing && (
        <>
          <img src={poster} alt="" className="w-full h-full object-cover" />
          <span className="absolute bottom-2 right-2 text-[11px] bg-white/10 backdrop-blur text-white px-2 py-1 rounded border border-white/20">
            Play
          </span>
        </>
      )}

      {/* Video – startet erst nach Klick, mit Ton */}
      <video
        ref={vRef}
        src={src}
        poster={poster}
        className={`w-full h-full object-cover ${playing ? "block" : "hidden"}`}
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        muted={false}
        controls={false}
        preload="metadata"
      />

      {/* kleines Overlay-Icon während Wiedergabe (visuelles Feedback) */}
      {playing && (
        <span className="pointer-events-none absolute top-2 left-2 text-[11px] bg-black/40 text-white px-2 py-0.5 rounded">
          Tap = Pause
        </span>
      )}
    </div>
  );
}

function PressLogos() {
  const logos = [
    "/img/logos/amazon.svg",
    "/img/logos/Handelsblatt.svg",
    "/img/logos/tegut.svg",
  ];
  return (
    <section className="border-y border-neutral-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 grid grid-cols-3 gap-6 items-center">
        {logos.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt="Bekannt aus"
            className="h-7 w-auto opacity-80 mx-auto"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ opacity: 1, scale: 1.04 }}
          />
        ))}
      </div>
    </section>
  );
}

function SoundSection() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isOn, setIsOn] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [pulse, setPulse] = useState(1);       // Bass-Pulse 1..~1.1

  // Visualizer zeichnen + Bass-Pulse berechnen
  const draw = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // HiDPI scharf zeichnen
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cssW = 260, cssH = 90;
    if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, cssW, cssH);

    const bufferLen = 64;
    const data = new Uint8Array(bufferLen);
    analyser.getByteFrequencyData(data);

    // Bass-Anteil (untere 8 Bins)
    const bassBins = 8;
    let bassSum = 0;
    for (let i = 0; i < bassBins; i++) bassSum += data[i];
    const bassNorm = bassSum / (bassBins * 255);              // 0..1
    const targetPulse = 1 + bassNorm * 0.12;                  // bis ~1.12
    // weiches Nachführen (low-pass)
    setPulse(p => p + (targetPulse - p) * 0.14);

    // Balken zeichnen
    const barW = cssW / bufferLen;
    for (let i = 0; i < bufferLen; i++) {
      const val = data[i] / 255; // 0..1
      const barH = Math.max(2, val * (cssH * 0.9));
      const x = i * barW;
      const y = cssH - barH;

      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, "#E70089"); // fuchsia
      grad.addColorStop(1, "#FFC43A"); // amber

      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, y, barW - 2, barH);
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  // Progress-Handler & Ready
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onReady = () => setReady(true);
    const onTime  = () => { if (a.duration > 0) setProgress(a.currentTime / a.duration); };
    a.addEventListener("loadeddata", onReady, { once: true });
    a.addEventListener("canplay", onReady, { once: true });
    a.addEventListener("timeupdate", onTime);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadeddata", onReady);
      a.removeEventListener("canplay", onReady);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const a = audioRef.current;
      if (a) { a.pause(); a.src = ""; }
      analyserRef.current?.disconnect();
      srcRef.current?.disconnect();
      ctxRef.current?.close().catch(()=>{});
    };
  }, []);

  // Toggle Play/Pause – AudioContext erst beim ersten Klick
  async function toggle() {
    const a = audioRef.current!;
    try {
      if (!ctxRef.current) {
        const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();
        ctxRef.current = ctx;

        const src = ctx.createMediaElementSource(a);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        src.connect(analyser);
        analyser.connect(ctx.destination);
        srcRef.current = src;
        analyserRef.current = analyser;
      }
      if (ctxRef.current!.state === "suspended") await ctxRef.current!.resume();

      if (!isOn) {
        a.currentTime = 0;
        a.volume = 1;           // bewusst ohne Fade für iOS-Stabilität
        await a.play();         // erlaubt, weil in Button-Click
        setIsOn(true);
        if (!rafRef.current) rafRef.current = requestAnimationFrame(draw);
      } else {
        a.pause();
        setIsOn(false);
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      }
    } catch (e) {
      console.warn("Audio play blocked:", e);
      setIsOn(false);
    }
  }

  // Progress-Ring
  const R = 26, C = Math.PI * 2 * R, dash = C * progress;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950/60 overflow-hidden">
        <div className="grid md:grid-cols-[1.1fr_.9fr]">
          {/* Left: Copy + Spotify */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
              The Sound of Partylyte: Hydrated & Elevated
            </h2>
            <p className="mt-3 text-neutral-300 max-w-prose">
              Starte den Vibe – Audio beginnt nach deinem Tap. Den kompletten Track gibt’s auf Spotify.
            </p>
            <div className="mt-6">
              <a href={ASSETS.links.spotify} target="_blank" className="inline-flex items-center gap-3 border border-neutral-700 rounded-2xl px-4 py-3 hover:bg-neutral-900">
                <img src={ASSETS.icons.spotify} alt="Spotify" className="h-8 w-8" />
                <span className="text-base font-medium">Auf Spotify anhören</span>
              </a>
            </div>
            <p className="mt-3 text-xs text-neutral-500">iOS: Stummschalter & Systemlautstärke prüfen.</p>
          </div>

          {/* Right: Player mit Visualizer + Bass-Pulse */}
          <div className="p-10 md:p-12 flex items-center justify-center bg-[radial-gradient(60%_60%_at_50%_50%,rgba(231,0,137,0.15),transparent)]">
            <audio
              ref={audioRef}
              src={ASSETS.audio.trackMp3}
              preload="auto"
              loop
              playsInline
              // @ts-ignore
              webkit-playsinline="true"
            />

            <div className="relative">
              {/* Mini-Visualizer */}
              <canvas
                ref={canvasRef}
                width={260}
                height={90}
                className="block mx-auto mb-6 opacity-90"
                style={{ filter: "drop-shadow(0 0 10px rgba(231,0,137,0.25))" }}
              />

              {/* Progress-Ring + großer Button */}
              <div className="relative mx-auto w-[200px] h-[200px]">
                <svg width="200" height="200" viewBox="0 0 200 200" className="block">
                  <circle cx="100" cy="100" r={R} transform="translate(74 74)" stroke="rgba(255,255,255,0.15)" strokeWidth="5" fill="none"/>
                  <circle
                    cx="100" cy="100" r={R}
                    transform="translate(74 74) rotate(-90 100 100)"
                    stroke="url(#plgrad)"
                    strokeWidth="5"
                    strokeDasharray={C}
                    strokeDashoffset={C - dash}
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="plgrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#E70089"/>
                      <stop offset="100%" stopColor="#FFC43A"/>
                    </linearGradient>
                  </defs>
                </svg>

                <motion.button
                  onClick={toggle}
                  className={`absolute inset-0 m-auto h-20 w-20 md:h-24 md:w-24 rounded-full border z-10
                    ${isOn ? "bg-white text-black border-white" : "bg-black/70 text-white border-neutral-700 hover:bg-neutral-900"}
                  `}
                  aria-pressed={isOn}
                  title={isOn ? "Sound aus" : "Sound an"}
                  style={{ scale: isOn ? pulse : 1 }}
                >
                  <img
                    src={isOn ? ASSETS.icons.soundOff : ASSETS.icons.soundOn}
                    alt={isOn ? "Sound aus" : "Sound an"}
                    className="h-8 w-8 md:h-10 md:w-10 mx-auto"
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Page ================= */
export default function Page() {
  const [checkoutUrl, setCheckoutUrl] = useState(CHECKOUT_BASE);
  useEffect(() => setCheckoutUrl(buildCheckoutUrl(window.location.href)), []);

const [legalOpen, setLegalOpen] = useState(false);
const [legalTitle, setLegalTitle] = useState<string>("");
const [legalContent, setLegalContent] = useState<string>("");

function openLegal(kind: "impressum" | "datenschutz" | "agb") {
  if (kind === "impressum") { setLegalTitle("Impressum"); setLegalContent(IMPRESSUM_TEXT); }
  if (kind === "datenschutz") { setLegalTitle("Datenschutz"); setLegalContent(DATENSCHUTZ_TEXT); }
  if (kind === "agb") { setLegalTitle("AGB"); setLegalContent(AGB_TEXT); }
  setLegalOpen(true);
}

  return (
    <main className="min-h-screen bg-black text-white">
      <Header checkoutUrl={checkoutUrl} />
      <Hero checkoutUrl={checkoutUrl} />
      <PressBar />
      <SoundSection />
   
      <CapsuleSection />
      <RealitySection />
      <Lifestyle />
<Testimonials />
<PressLogos />
      <Bundles currentUrl={typeof window !== "undefined" ? window.location.href : "https://partylyte.de"} />
      <Cta checkoutUrl={checkoutUrl} />
      <Faq />
      <Footer openLegal={openLegal} />
<LegalModal
  open={legalOpen}
  title={legalTitle}
  content={legalContent}
  onClose={() => setLegalOpen(false)}
/>
    </main>
  );
}

/* ================= Sections ================= */

function Header({ checkoutUrl }: { checkoutUrl: string }) {
  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="inline-block h-8 w-8 rounded-xl bg-gradient-to-br from-fuchsia-500 to-amber-400 group-hover:scale-110 transition" />
          <span className="font-semibold tracking-tight">Partylyte®</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
          <a href="#benefits" className="hover:text-white">Vorteile</a>
          <a href="#how" className="hover:text-white">So funktioniert’s</a>
          <a href="#science" className="hover:text-white">Wirkstoffe</a>
          <a href="#reality" className="hover:text-white">Reality-Check</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </nav>
        <a
  href={checkoutUrl}
  className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold bg-white text-black hover:bg-neutral-200"
  title="Weiterleitung zu Amazon"
>
  Jetzt bei Amazon
</a>
      </div>
    </header>
  );
}

function Hero({ checkoutUrl }: { checkoutUrl: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const yTitle = useParallax(sectionRef, [10, -10]);
  const yProduct = useParallax(sectionRef, [30, -30]);
  const reduce = useReducedMotion();

  return (
    <section id="top" ref={sectionRef} className="relative w-full min-h-[92svh] overflow-hidden">
      {/* iPhone-sicher: getrennte Video-Tags */}
      <video className="absolute inset-0 w-full h-full object-cover opacity-60 hidden md:block" autoPlay muted playsInline loop preload="auto" {...{ 'webkit-playsinline': 'true' as any }}>
        <source src={ASSETS.videoHeroDesktop} type="video/mp4" />
      </video>
      <video className="absolute inset-0 w-full h-full object-cover opacity-60 block md:hidden" autoPlay muted playsInline loop preload="auto" {...{ 'webkit-playsinline': 'true' as any }}>
        <source src={ASSETS.videoHeroMobile} type="video/mp4" />
      </video>

      {/* Grain & Neon Glows */}
      <div className="absolute inset-0 mix-blend-overlay opacity-10" style={{ backgroundImage: `url(${ASSETS.bgGrain})` }} />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-30 bg-fuchsia-600" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30 bg-amber-500" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <motion.div style={{ y: yTitle }}>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            <span className="bg-gradient-to-br from-fuchsia-400 to-amber-300 bg-clip-text text-transparent">Feiern ohne Reue.</span>
          </h1>
          <p className="mt-5 text-lg text-neutral-300">2 Kapseln nach der Nacht – mit Elektrolyten, Vitaminen & pflanzlichen Extrakten.</p>
          <div className="mt-8 flex items-center gap-3">
            <motion.a whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(255,255,255,0.15)" }} href={checkoutUrl} className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-base font-semibold bg-white text-black">
              Jetzt bei Amazon bestellen
            </motion.a>
          </div>
        </motion.div>

        {/* Produktvisual mit Parallax + HoverTilt */}
        <HoverTilt className="relative">
          <motion.div style={{ y: reduce ? 0 : yProduct }} className="relative aspect-[4/5] rounded-3xl border border-neutral-800 bg-neutral-950/60 backdrop-blur p-4 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <picture>
              <source media="(max-width: 767px)" srcSet={ASSETS.heroProductMobile} />
              <img src={ASSETS.heroProductDesktop} alt="Partylyte Render" className="relative z-10 mx-auto h-full w-full object-contain drop-shadow-[0_10px_40px_rgba(255,0,180,0.25)]" />
            </picture>
          </motion.div>
        </HoverTilt>
      </div>
    </section>
  );
}

function PressBar() {
  return (
    <section className="border-y border-neutral-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-3 gap-6 items-center text-sm text-neutral-400">
        {ASSETS.logos.map((src, i) => (
          <motion.img key={i} src={src} alt="Logo" className="h-7 w-auto opacity-80" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 0.8, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }} />
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { t: "1.137 mg Elektrolyte pro Portion", d: "Natrium, Kalium & Magnesium – für Balance & Muskeln." },
    { t: "Cholin trägt zu normaler Leberfunktion bei", d: "Clever dosiert, ohne Zucker." },
    { t: "Magnesium für Elektrolytgleichgewicht", d: "Unterstützt Nerven & Muskeln." },
    { t: "B2 & B5: Müdigkeit ↓", d: "Verringern Müdigkeit & Ermüdung." },
    { t: "Pflanzenextrakte", d: "Mariendistel & Kaktusfeige – beliebt für Magen/Leber-Komfort." },
    { t: "Vegan, ohne Zucker, ohne künstliche Zusätze", d: "" },
  ];
  return (
    <section id="benefits" className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Warum Partylyte? Weil’s Sinn macht.</h2>
      <p className="mt-3 text-neutral-300 max-w-2xl">In jeder Portion steckt genau das, was dein Körper nach intensiven Tagen braucht – ganz ohne Zucker oder chemischen Geschmack.</p>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
  {items.map((b, i) => (
    <HighlightCard key={i} className="rounded-3xl">
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: i * 0.04 }}
      >
        <h3 className="font-semibold text-base">{b.t}</h3>
        {b.d && <p className="mt-2 text-sm text-neutral-300">{b.d}</p>}
      </motion.div>
    </HighlightCard>
  ))}
</div>
    </section>
  );
}

function HowTo() {
  const steps = ["2 Kapseln mit Wasser nach der Nacht einnehmen.", "Am Morgen: Wasser trinken & leicht frühstücken.", "Regelmäßig nutzen – Routine macht den Unterschied."];
  return (
    <section id="how" className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight">So funktioniert’s</h2>
      <ol className="mt-8 grid md:grid-cols-3 gap-6 text-sm text-neutral-300">
        {steps.map((s, i) => (
          <HoverTilt key={i} className="rounded-3xl border border-neutral-800 bg-neutral-950/60">
            <motion.li className="p-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}>
              {s}
            </motion.li>
          </HoverTilt>
        ))}
      </ol>
    </section>
  );
}

function Science() {
  return (
    <section id="science" className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Wirkstoffprofil</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm">
        <HoverTilt className="rounded-3xl border border-neutral-800 bg-neutral-950/60">
          <div className="p-6">
            <h3 className="font-semibold">Elektrolyte & Cholin</h3>
            <p className="mt-2 text-neutral-300">Magnesium trägt zum Elektrolytgleichgewicht bei. Cholin trägt zu einer normalen Leberfunktion bei.</p>
            <div className="mt-4 flex items-center gap-4 opacity-90">
              <img src={ASSETS.ingredients.elektrolyte} alt="Elektrolyte" className="h-8" />
              <img src={ASSETS.ingredients.choline} alt="Cholin" className="h-8" />
            </div>
          </div>
        </HoverTilt>
        <HoverTilt className="rounded-3xl border border-neutral-800 bg-neutral-950/60">
          <div className="p-6">
            <h3 className="font-semibold">Pflanzenstoffe</h3>
            <p className="mt-2 text-neutral-300">Mariendistel & Kaktusfeige – traditionell genutzt für Magen-/Leber-Wohlbefinden.</p>
            <div className="mt-4 flex items-center gap-4 opacity-90">
              <img src={ASSETS.ingredients.kaktusfeige} alt="Kaktusfeige" className="h-8" />
              <img src={ASSETS.ingredients.mariendistel} alt="Mariendistel" className="h-8" />
            </div>
          </div>
        </HoverTilt>
      </div>
    </section>
  );
}

/* ============= NEW: Capsule Scroll Story (früh öffnen + zielgerichtete Flugbahnen) ============= */
function CapsuleSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress: capsuleScroll } = useScroll({
    target: ref,
    offset: ["start 75%", "end 10%"],
  });

  const yCapsule   = useTransform(capsuleScroll, [0, 1], [18, -18]);
  const rotCapsule = useTransform(capsuleScroll, [0, 1], [-3, 3]);

  const fadeClosed = useTransform(capsuleScroll, [0.00, 0.15], [1, 0]);
  const fadeOpen   = useTransform(capsuleScroll, [0.15, 0.20], [0, 1]);

  const targets = [
    { x: -200, y: -120 },
    { x: -120, y:  160 },
    { x:  170, y: -140 },
    { x:  210, y:  120 },
    { x:    0, y: -220 },
    { x:    0, y:  210 },
    { x: -240, y:   30 },
    { x:  240, y:   20 },
  ];
  const launchStart = 0.15;
  const ICONS = [
    ASSETS.capsuleIcons.electrolytes,
    ASSETS.capsuleIcons.magnesium,
    ASSETS.capsuleIcons.kalium,
    ASSETS.capsuleIcons.choline,
    ASSETS.capsuleIcons.b2,
    ASSETS.capsuleIcons.b5,
    ASSETS.capsuleIcons.mariendistel,
    ASSETS.capsuleIcons.kaktusfeige,
  ]
    .filter(Boolean)
    .map((src, i) => ({
      src: src as string,
      x: useTransform(capsuleScroll, [launchStart, 1], [0, targets[i].x]),
      y: useTransform(capsuleScroll, [launchStart, 1], [0, targets[i].y]),
      opacity: useTransform(capsuleScroll, [launchStart - 0.02, launchStart + 0.08], [0, 1]),
      scale: useTransform(capsuleScroll, [launchStart, 1], [0.85, 1]),
      className: i <= 3 ? "w-12 md:w-14" : "w-10 md:w-12",
    }));

  const textItems = [
    { k: "⚡ Elektrolyte", d: "1.137 mg pro Portion" },
    { k: "💧 Magnesium",  d: "trägt zum Elektrolytgleichgewicht bei" },
    { k: "⚡ Kalium",     d: "trägt zur normalen Muskelfunktion bei" },
    { k: "🧠 Cholin",     d: "trägt zu einer normalen Leberfunktion bei" },
    { k: "💊 B2 & B5",    d: "verringern Müdigkeit & Ermüdung" },
    { k: "🌿 Pflanzen",   d: "Mariendistel & Kaktusfeige" },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Hintergrund-Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(255,0,128,0.16), transparent 60%), radial-gradient(1000px 500px at 90% 90%, rgba(255,191,0,0.16), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        {/* Linke Spalte: nur Desktop */}
        <div className="relative hidden md:block">
          <motion.div
            style={{ y: reduce ? 0 : yCapsule, rotateZ: reduce ? 0 : rotCapsule }}
            className="relative aspect-[4/5] w-full max-w-md mx-auto"
          >
            {/* CLOSED */}
            <motion.img
              src={ASSETS.capsule.closed}
              alt="Closed capsule"
              style={{ opacity: fadeClosed }}
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
            {/* OPEN */}
            <motion.img
              src={ASSETS.capsule.open}
              alt="Open capsule"
              style={{ opacity: fadeOpen }}
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          </motion.div>

          {/* ICONS */}
          <div className="pointer-events-none">
            {ICONS.map((ic, i) => (
              <motion.img
                key={i}
                src={ic.src}
                alt=""
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow ${ic.className}`}
                style={{ x: ic.x, y: ic.y, opacity: ic.opacity, scale: ic.scale }}
                whileHover={{ scale: 1.12, filter: "drop-shadow(0 0 18px rgba(255,0,128,0.65))" }}
              />
            ))}
          </div>
        </div>

        {/* Rechte Spalte: Texte */}
        <div>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Was in 2 Kapseln steckt.</h2>
          <p className="mt-3 text-neutral-300 max-w-prose">
            Elektrolyte, Vitamine & pflanzliche Extrakte – dosiert, clean, ohne Zucker.
          </p>
          <div className="mt-8 space-y-4">
            {textItems.map((t, i) => (
              <HighlightCard key={i}>
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.05 * i }}
                >
                  <p className="font-medium">{t.k}</p>
                  <p className="text-sm text-neutral-300">{t.d}</p>
                </motion.div>
              </HighlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
/* ===================================================== */

function RealitySection() {
  return (
    <section id="reality" className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <motion.h2 className="text-2xl md:text-4xl font-bold tracking-tight" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        Lange Nacht gehabt?
      </motion.h2>
      <motion.p className="mt-3 text-neutral-300 max-w-2xl" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        Dann kennst du das Gefühl am Morgen. Aber du kannst deinen Alltag trotzdem im Griff haben – mit einer smarten Kapsel-Routine.
      </motion.p>

      {/* Desktop: Slider */}
      <div className="mt-8 hidden md:block">
        <CompareSlider beforeSrc="/img/reality/before_v2.jpg" afterSrc="/img/reality/after_v2.jpg" />
      </div>

      {/* Mobile: gestapelt */}
     {/* Mobile: Swipe-to-Reveal */}
<div className="mt-8 md:hidden">
  <MobileSwipeCompare
    beforeSrc="/img/reality/before_v2.jpg"
    afterSrc="/img/reality/after_v2.jpg"
  />
</div>
    </section>
  );
}

function MobileSwipeCompare({ beforeSrc, afterSrc }: { beforeSrc: string; afterSrc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50); // Prozent
  const dragging = useRef(false);
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const SEAM = 0.3; // kleine Überlappung in %, verhindert 1px-Spalt

  function handlePointer(e: React.PointerEvent) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = clamp(((e.clientX - r.left) / r.width) * 100);
    setPos(x);
  }

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 touch-none select-none"
      onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); handlePointer(e); }}
      onPointerMove={(e) => dragging.current && handlePointer(e)}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}
      style={{ touchAction: "none" }}
    >
      {/* Mobile-Format 4:5 für Fingerfläche */}
      <div className="relative aspect-[4/5]">
        {/* After = Vollfläche */}
        <img
          src={afterSrc}
          alt="Nachher"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Before = via clip-path, mit minimalem Überzug */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            // statt width nutzen wir clip-path; rechtskante = 100% - pos
            clipPath: `inset(0 ${Math.max(0, 100 - (pos + SEAM))}% 0 0)`,
          }}
        >
          <img
            src={beforeSrc}
            alt="Vorher"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          {/* Soft edge direkt unter der Schnittkante */}
          <div
            className="absolute top-0 right-0 h-full w-[20px] bg-gradient-to-r from-black/0 to-black/30"
            style={{ transform: "translateX(100%)" }}
          />
        </div>

        {/* Griff – exakt mittig auf pos% */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="h-full w-[2px] bg-white/85" />
          <div className="absolute top-1/2 -translate-y-1/2">
            <div className="h-10 w-10 rounded-full bg-white text-black text-xs flex items-center justify-center shadow-[0_8px_24px_rgba(255,255,255,0.25)] border border-white/80">
              ◄ ►
            </div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute bottom-3 left-3 text-[11px] bg-black/55 px-2 py-1 rounded">Vorher</span>
      <span className="absolute bottom-3 right-3 text-[11px] bg-black/55 px-2 py-1 rounded">Nachher</span>
    </div>
  );
}

function CompareSlider({ beforeSrc, afterSrc }: { beforeSrc: string; afterSrc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  function update(e: React.PointerEvent) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = clamp(((e.clientX - r.left) / r.width) * 100);
    setPos(x);
  }
  return (
  <div ref={ref} className="relative w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900">
    <div className="aspect-[16/9] md:aspect-[21/9] relative">
      <img
        src={afterSrc}
        alt="Nachher"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={beforeSrc}
          alt="Vorher"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Griff/Linie */}
      <div
        className="absolute top-0 bottom-0 cursor-ew-resize"
        style={{ left: `calc(${pos}% - 1px)` }}
        onPointerDown={e => { dragging.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); update(e); }}
        onPointerMove={e => dragging.current && update(e)}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
        onPointerLeave={() => { dragging.current = false; }}
      >
        <div className="h-full w-0.5 bg-white/80" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded-full shadow">
          ◄ ►
        </div>
      </div>

      {/* Labels Desktop */}
      <span className="absolute bottom-3 left-3 text-xs bg-black/60 px-2 py-1 rounded">Vorher</span>
      <span className="absolute bottom-3 right-3 text-xs bg-black/60 px-2 py-1 rounded">Nachher</span>
    </div>
  </div>
);
}

function Lifestyle() {
  const ref = useRef<HTMLDivElement>(null);
  const y1 = useParallax(ref, [20, -20]);
  const y2 = useParallax(ref, [-15, 15]);

  return (
    <section
      ref={ref}
      id="reviews"
      className="mx-auto max-w-7xl px-4 md:px-8 py-16"
    >
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
        Nicht mehr absagen, weil du Angst vor dem Morgen hast.
      </h2>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {ASSETS.ugcVideos && ASSETS.ugcVideos.length > 0 ? (
          ASSETS.ugcVideos.map((v, i) => (
            <UGCVideoTile key={i} src={v.src} poster={v.poster} />
          ))
        ) : (
          <p className="col-span-full text-neutral-400 text-sm">
            Keine UGC-Videos gefunden. Erwartet: /public/video/ugc/scene1.mp4
            sowie Poster unter /public/img/ugc/scene1.jpg
          </p>
        )}
      </div>
    </section>
  );
}

function Bundles({ currentUrl }: { currentUrl: string }) {
  const cards = [
  {
    key: "starter",
    title: "Starter – 1 Packung",
    img: "/img/bundles/starter2.png",         // Bild siehe Abschnitt 6
    details: "1 Packung",
    price: "14,90 €",
    note: "Weiterleitung zu Amazon",
    href: "https://amzn.eu/d/1pRnzzV",       // 1x → Amazon
    cta: "Jetzt bei Amazon"
  },
  {
    key: "pro",
    title: "Party-Profi – 3 Packungen",
    img: "/img/bundles/pro2.png",
    details: "3 Packungen",
    price: "39,90 €",
    note: "–5 € & versandfrei",
    href: "https://www.betanics.de/cart/49251074867468:3?discount=PartyProfi", // 3x → Shopify mit Rabatt
    cta: "3er-Paket sichern"
  },
  {
    key: "festival",
    title: "Festival-Edition – 6 Packungen",
    img: "/img/bundles/festival2.png",
    details: "6 Packungen",
    price: "74,90 €",
    note: "–10 € & versandfrei",
    href: "https://www.betanics.de/cart/49251074867468:6?discount=FestivalEdition", // 6x → Shopify mit Rabatt
    cta: "6er-Paket sichern"
  },
];
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Wähle dein Paket. Versandkosten gehen auf uns.</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div key={c.key} className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-6 flex flex-col" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(255,255,255,0.08)" }}>
            <div className="relative aspect-[4/3] rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden mb-4">
              <motion.img src={c.img} alt={c.title} className="w-full h-full object-contain" whileHover={{ scale: 1.03, rotate: 0.3 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} />
            </div>
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="text-sm text-neutral-300 mt-1">{c.details}</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-bold">{c.price}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/15">{c.note}</span>
            </div>
            <a
  href={c.href}
  className="mt-6 inline-flex items-center justify-center rounded-2xl px-4 py-3 bg-white text-black font-semibold hover:bg-neutral-200"
  title={c.key === "starter" ? "Weiterleitung zu Amazon" : "Checkout bei betanics.de"}
>
  {c.cta}
</a>
<p className="mt-2 text-[11px] text-neutral-400">
  {c.key === "starter" ? "Hinweis: Link führt zu Amazon." : "Hinweis: Checkout erfolgt bei betanics.de."}
</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Cta({ checkoutUrl }: { checkoutUrl: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 pb-20">
      <HoverTilt className="rounded-3xl border border-neutral-800">
        <div className="p-8 md:p-12 bg-[radial-gradient(100%_100%_at_0%_0%,rgba(255,0,128,0.12),transparent),radial-gradient(100%_100%_at_100%_100%,rgba(255,191,0,0.12),transparent)]">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">Feiern. Funktionieren. Wiederholen.</h3>
              <p className="mt-2 text-neutral-300 text-sm">Partylyte passt in dein Leben – jetzt versandkostenfrei sichern.</p>
            </div>
            <motion.a whileHover={{ y: -2, boxShadow: "0 10px 24px rgba(255,255,255,0.15)" }} href={checkoutUrl} className="inline-flex items-center justify-center rounded-2xl px-6 py-3 text-base font-semibold bg-white text-black">
              Jetzt bestellen
            </motion.a>
          </div>
        </div>
      </HoverTilt>
    </section>
  );
}

function Faq() {
  const items = [
    { q: "Wann nehme ich Partylyte am besten?", a: "Nach der Nacht: 2 Kapseln mit Wasser. Am Morgen zusätzlich Wasser trinken." },
    { q: "Ist es vegan und ohne Zusätze?", a: "Ja – vegan, ohne Zucker, ohne künstliche Farbstoffe." },
    { q: "Was ist drin?", a: "Elektrolyte, Cholin, Vitamine (B2, B5) und pflanzliche Extrakte (Mariendistel, Kaktusfeige)." },
    { q: "Wie oft kann ich es nehmen?", a: "Wie empfohlen: 2 Kapseln pro Tag. Empfohlene Tagesdosis nicht überschreiten." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 md:px-8 py-16">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Fragen? Wir feiern Antworten.</h2>
      <div className="mt-6 divide-y divide-neutral-800 border border-neutral-800 rounded-3xl overflow-hidden">
        {items.map((f, i) => (
          <details key={i} className="group p-5 open:bg-neutral-950/60">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="font-medium">{f.q}</span>
              <span className="text-neutral-500 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-sm text-neutral-300">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer({ openLegal }: { openLegal: (kind: "impressum" | "datenschutz" | "agb") => void }) {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 text-sm text-neutral-400 grid md:grid-cols-4 gap-6">
        <div>
          <p className="font-semibold text-white">Partylyte®</p>
          <p>Ein Produkt der be tanics GmbH</p>
        </div>
        <div className="space-y-2">
  <button onClick={() => openLegal("impressum")} className="hover:text-white text-left">
    Impressum
  </button><br/>
  <button onClick={() => openLegal("datenschutz")} className="hover:text-white text-left">
    Datenschutz
  </button><br/>
  <button onClick={() => openLegal("agb")} className="hover:text-white text-left">
    AGB
  </button>
</div>
        
        <div>
          <p className="text-[12px]">Nahrungsergänzungsmittel sind kein Ersatz für eine ausgewogene und abwechslungsreiche Ernährung. Die empfohlene tägliche Verzehrsmenge darf nicht überschritten werden. Außerhalb der Reichweite von kleinen Kindern aufbewahren. Empfohlene Tagesdosis: 2 Kapseln.</p>
        </div>
      </div>
    </footer>
  );
}