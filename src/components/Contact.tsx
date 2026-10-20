import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { business } from '../config/business';
import {
  createWhatsAppUrl,
  isSafeHttpsUrl,
  normalizeWhatsApp,
  validateContact,
} from '../lib/contact';
import type { ContactErrors } from '../lib/contact';
import './contact.css';

type ContactProps = {
  selectedService: string;
  onServiceChange: (value: string) => void;
};

function PinIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function Contact({ selectedService, onServiceChange }: ContactProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [feedback, setFeedback] = useState('');
  const [conversationUrl, setConversationUrl] = useState('');
  const [submittedService, setSubmittedService] = useState('');
  const [showMap, setShowMap] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const hasWhatsApp = normalizeWhatsApp(business.whatsapp) !== null;
  const hasAddress = Boolean(business.address.trim());
  const hasMap = hasAddress && isSafeHttpsUrl(business.mapUrl);
  const hasDirections = hasAddress && isSafeHttpsUrl(business.directionsUrl);

  function clearFeedback() {
    setFeedback('');
    setConversationUrl('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFeedback();
    const fields = { name, service: selectedService, message };
    const nextErrors = validateContact(fields, business.services.map((service) => service.id));
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }
    const service = business.services.find((item) => item.id === selectedService);
    if (!service) return;
    const url = createWhatsAppUrl(business.whatsapp, fields, service.name);
    if (!url) {
      setFeedback(
        'O atendimento pelo WhatsApp ainda não está disponível nesta demonstração. Nenhuma mensagem foi enviada.',
      );
      return;
    }
    setConversationUrl(url);
    setSubmittedService(selectedService);
    setFeedback('Continue a conversa no WhatsApp. A equipe confirmará a disponibilidade e o agendamento.');
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <section className="contact-section" id="contato" tabIndex={-1} aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-heading">
          <p className="eyebrow">SEU MOMENTO, SEM PRESSA</p>
          <h2 className="section-heading" id="contact-heading">Vamos conversar?</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-location" aria-labelledby="location-heading">
            <div className="contact-column-title">
              <span className="contact-step" aria-hidden="true">01</span>
              <h3 id="location-heading">Onde nos encontrar</h3>
            </div>
            <div className={`location-panel${showMap ? ' location-panel-with-map' : ''}`}>
              {showMap && hasMap ? (
                <iframe
                  src={business.mapUrl}
                  title={`Localização de ${business.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  allowFullScreen
                />
              ) : (
                <>
                  <span className="location-icon"><PinIcon /></span>
                  <p className="location-panel-title">
                    {hasAddress ? 'Esperamos por você.' : 'Localização em breve'}
                  </p>
                  <p className="location-panel-copy">
                    {hasAddress
                      ? business.address
                      : 'Um espaço pensado para receber você com cuidado, do primeiro ao último detalhe.'}
                  </p>
                  {hasMap && (
                    <button
                      type="button"
                      className="location-map-button"
                      onClick={() => setShowMap(true)}
                    >
                      Ver mapa
                    </button>
                  )}
                </>
              )}
            </div>
            {(hasAddress || business.hours.length > 0 || hasDirections) && (
              <div className="location-details">
                {hasAddress && <p>{business.address}</p>}
                {business.hours.length > 0 && (
                  <ul aria-label="Horários de atendimento">
                    {business.hours.map((hours) => <li key={hours}>{hours}</li>)}
                  </ul>
                )}
                {hasDirections && (
                  <a className="contact-route" href={business.directionsUrl} target="_blank" rel="noopener noreferrer">
                    Como chegar <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="contact-form-column">
            <div className="contact-column-title">
              <span className="contact-step" aria-hidden="true">02</span>
              <h3>O primeiro passo é seu</h3>
            </div>
            <form ref={formRef} className="contact-form" onSubmit={submit} noValidate>
              <div className="contact-field-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">Seu nome <span className="field-required">*</span></label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Como podemos chamar você?"
                    value={name}
                    onChange={(event) => { setName(event.target.value); clearFeedback(); }}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                  {errors.name && <p className="field-error" id="contact-name-error">{errors.name}</p>}
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-service">Serviço de interesse <span className="field-required">*</span></label>
                  <select
                    id="contact-service"
                    name="service"
                    required
                    value={selectedService}
                    onChange={(event) => { onServiceChange(event.target.value); clearFeedback(); }}
                    aria-invalid={Boolean(errors.service)}
                    aria-describedby={errors.service ? 'contact-service-error' : undefined}
                  >
                    <option value="">Escolha seu cuidado</option>
                    {business.services.map((service) => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                  {errors.service && <p className="field-error" id="contact-service-error">{errors.service}</p>}
                </div>
              </div>
              <div className="contact-field">
                <label htmlFor="contact-message">Mensagem <span className="field-optional">(opcional)</span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={3}
                  maxLength={1000}
                  placeholder="Conte o que você tem em mente."
                  value={message}
                  onChange={(event) => { setMessage(event.target.value); clearFeedback(); }}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                />
                {errors.message && <p className="field-error" id="contact-message-error">{errors.message}</p>}
              </div>
              {!hasWhatsApp && (
                <p className="contact-demo-note">
                  Esta é uma demonstração. Os dados de atendimento ainda precisam ser configurados.
                </p>
              )}
              <div className="contact-submit-row">
                <p className="contact-confirmation-note">
                  {hasWhatsApp
                    ? 'O agendamento será confirmado pela equipe no WhatsApp.'
                    : 'Você pode explorar os serviços e preencher o formulário.'}
                </p>
                <button type="submit" className="button button-primary contact-submit">
                  Continuar no WhatsApp
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="contact-feedback" role="status" aria-live="polite">
                {feedback && (!conversationUrl || submittedService === selectedService) && <p>{feedback}</p>}
                {conversationUrl && submittedService === selectedService && (
                  <a href={conversationUrl} target="_blank" rel="noopener noreferrer">
                    Abrir conversa no WhatsApp <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
