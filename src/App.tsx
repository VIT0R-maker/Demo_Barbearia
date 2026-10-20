import { useEffect, useRef, useState } from 'react'
import { business } from './config/business'
import Contact from './components/Contact'

const image = (name: string) => `${import.meta.env.BASE_URL}images/${name}.webp`
const navigation = [
  ['Serviços', 'servicos'],
  ['Sobre', 'sobre'],
  ['Experiência', 'experiencia'],
  ['Contato', 'contato'],
] as const

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {diagonal
      ? <path d="M6 18 18 6M6 6h12v12" />
      : <path d="M4 12h15m-6-6 6 6-6 6" />}
  </svg>
}

function Wordmark() {
  return <span className="wordmark">
    <span>{business.name.replace(/\s+BARBEARIA$/i, '')}</span>
    {/BARBEARIA$/i.test(business.name) && <span className="wordmark-sub">BARBEARIA</span>}
  </span>
}

function Header() {
  const menu = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const menuDestination = useRef<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const breakpoint = window.matchMedia('(min-width: 769px)')
    const onResize = () => { if (breakpoint.matches) menu.current?.close() }
    breakpoint.addEventListener('change', onResize)
    return () => {
      document.body.style.overflow = previous
      breakpoint.removeEventListener('change', onResize)
    }
  }, [open])

  function openMenu() {
    menuDestination.current = null
    menu.current?.showModal()
    setOpen(true)
  }

  function followLink(id: string) {
    menuDestination.current = id
    menu.current?.close()
  }

  return <header className="site-header">
    <div className="container header-inner">
      <a href="#inicio" className="brand-link" aria-label={`${business.name} — início`}><Wordmark /></a>
      <nav className="desktop-navigation" aria-label="Navegação principal">
        {navigation.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </nav>
      <a href="#contato" className="button button-primary header-cta">Agendar horário <Arrow diagonal /></a>
      <button ref={trigger} type="button" className="menu-trigger" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-menu" onClick={openMenu}>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
      </button>
    </div>
    <dialog ref={menu} id="mobile-menu" className="mobile-menu" aria-label="Menu de navegação" onClose={() => {
      setOpen(false)
      if (menuDestination.current) document.getElementById(menuDestination.current)?.focus({ preventScroll: true })
      else trigger.current?.focus()
      menuDestination.current = null
    }} onClick={(event) => { if (event.target === menu.current) menu.current.close() }}>
      <div className="mobile-menu-top">
        <Wordmark />
        <button type="button" className="menu-trigger" aria-label="Fechar menu" onClick={() => menu.current?.close()}><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
      </div>
      <nav aria-label="Navegação no celular">
        {navigation.map(([label, id], index) => <a key={id} href={`#${id}`} onClick={() => followLink(id)}><span className="menu-index">0{index + 1}</span>{label}<Arrow diagonal /></a>)}
        <a className="button button-primary" href="#contato" onClick={() => followLink('contato')}>Agendar horário <Arrow /></a>
      </nav>
    </dialog>
  </header>
}

function App() {
  const [selectedService, setSelectedService] = useState('')

  function chooseService(id: string) {
    setSelectedService(id)
    requestAnimationFrame(() => document.getElementById('contact-service')?.focus({ preventScroll: true }))
  }

  return <>
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <Header />
    <main id="conteudo">
      <section id="inicio" className="hero" aria-labelledby="hero-title">
        <div className="hero-photo">
          <img src={image('hero')} srcSet={`${image('hero-640')} 640w, ${image('hero')} 912w`} sizes="(max-width: 640px) 100vw, 64vw" alt="Cadeira de barbeiro em couro caramelo em um interior com madeira e iluminação quente" width="912" height="922" fetchPriority="high" />
        </div>
        <div className="container hero-inner">
          <div className="hero-content">
            <p className="eyebrow"><span className="gold-line" /> BARBEARIA · ESTILO · CUIDADO</p>
            <h1 id="hero-title">Seu estilo.<br />Nos mínimos<br /><em>detalhes.</em></h1>
            <p className="hero-description">{business.description}</p>
            <div className="hero-actions">
              <a href="#contato" className="button button-primary">Agendar meu horário <Arrow diagonal /></a>
              <a href="#servicos" className="text-link">Conhecer os serviços <Arrow /></a>
            </div>
            <p className="hero-support">Seu próximo momento de cuidado começa aqui.</p>
          </div>
          <a href="#servicos" className="scroll-cue"><span className="scroll-line" /> DESCUBRA A EXPERIÊNCIA</a>
          <span className="hero-side-note" aria-hidden="true">O CUIDADO ESTÁ NOS DETALHES</span>
        </div>
      </section>

      <section className="services section-space" id="servicos" tabIndex={-1} aria-labelledby="services-title">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow">O SEU ESTILO, O NOSSO CUIDADO</p><h2 id="services-title">Precisão em cada detalhe.</h2></div>
            <p>Escolha o cuidado que combina<br className="desktop-break" /> com o seu momento.</p>
          </div>
          <div className="services-grid">
            {business.services.map((service, index) => <article className="service-card" key={service.id}>
              <div className="service-image"><img src={image(['service-cut', 'service-beard', 'service-complete'][index])} alt={['Tesoura e pente sobre uma bancada de madeira', 'Navalha e pincel de barbear sobre uma toalha', 'Máquina de corte e produtos de cuidado pessoal'][index]} width="430" height="212" loading="lazy" /></div>
              <div className="service-body">
                <div className="service-title-row"><h3>{service.name}</h3><span aria-hidden="true">0{index + 1}</span></div>
                <p>{service.description}</p>
                <a href="#contato" onClick={() => chooseService(service.id)} className="service-link">{service.cta}<Arrow diagonal /></a>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="about section-space" id="sobre" tabIndex={-1} aria-labelledby="about-title">
        <div className="container about-grid">
          <figure className="about-photo">
            <img src={image('barber')} srcSet={`${image('barber-640')} 640w, ${image('barber')} 731w`} sizes="(max-width: 768px) 100vw, 55vw" alt="Barbeiro de avental preparando seus instrumentos na bancada" width="731" height="306" loading="lazy" />
            <figcaption><span className="small-diamond" /> FEITO COM ATENÇÃO. PENSADO PARA VOCÊ.</figcaption>
          </figure>
          <div className="about-content">
            <p className="eyebrow">SOBRE A EXPERIÊNCIA</p>
            <h2 id="about-title">Mais que um corte.<br /><em>Um tempo para você.</em></h2>
            <p>Um ambiente acolhedor, atenção ao seu estilo e cuidado em cada etapa. Aqui, a experiência começa na conversa e termina nos detalhes.</p>
            <ul className="details-list">
              <li>Atenção ao seu estilo.</li>
              <li>Cuidado no acabamento.</li>
              <li>Ambiente para desacelerar.</li>
            </ul>
            <a href="#experiencia" className="text-link">Conhecer o ambiente <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="experience section-space" id="experiencia" tabIndex={-1} aria-labelledby="experience-title">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow">UM ESPAÇO PARA ESTAR BEM</p><h2 id="experience-title">Seu momento começa aqui.</h2></div>
            <p>Conheça os detalhes que dão<br className="desktop-break" /> personalidade ao nosso espaço.</p>
          </div>
          <div className="gallery">
            <figure className="gallery-lounge"><img src={image('lounge')} srcSet={`${image('lounge-640')} 640w, ${image('lounge')} 891w`} sizes="(max-width: 640px) 100vw, 60vw" width="891" height="573" loading="lazy" alt="Duas pessoas conversando em um sofá de couro no lounge da barbearia" /><figcaption>Boas conversas. Sem pressa.</figcaption></figure>
            <figure className="gallery-mirror"><img src={image('mirror')} width="490" height="265" loading="lazy" alt="Homem observando o acabamento da barba diante do espelho" /></figure>
            <figure className="gallery-coffee"><img src={image('coffee')} width="490" height="284" loading="lazy" alt="Xícara de café sobre uma mesa de madeira no lounge" /></figure>
          </div>
          <div className="editorial-strip"><p>Estilo também é <em>se sentir à vontade.</em></p><a href="#contato" className="button button-secondary">Agendar minha visita <Arrow diagonal /></a></div>
        </div>
      </section>

      <section className="visit" aria-labelledby="visit-title">
        <div className="visit-photo"><img src={image('facade')} srcSet={`${image('facade-640')} 640w, ${image('facade')} 907w`} sizes="(max-width: 640px) 100vw, 65vw" alt="Fachada de vidro da barbearia com iluminação acolhedora e plantas junto à entrada" width="907" height="568" loading="lazy" /></div>
        <div className="container visit-inner">
          <div className="visit-content">
            <p className="eyebrow">RESERVE UM TEMPO PARA VOCÊ</p>
            <h2 id="visit-title">Seu próximo visual<br />começa com <em>um horário.</em></h2>
            <p>Fale com a gente, escolha o serviço e consulte a disponibilidade.</p>
            <a href="#contato" className="button button-primary">Consultar horários <Arrow diagonal /></a>
          </div>
        </div>
      </section>

      <Contact selectedService={selectedService} onServiceChange={setSelectedService} />
    </main>
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div><a className="brand-link" href="#inicio" aria-label={`${business.name} — início`}><Wordmark /></a><p>Seu estilo. Nosso cuidado.</p></div>
          <nav aria-label="Navegação do rodapé">{navigation.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
          {/^https:\/\/(?:www\.)?instagram\.com\//i.test(business.instagram) && <a className="text-link" href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram <Arrow diagonal /></a>}
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {business.name}. Todos os direitos reservados.</span><span>Cuidado que se revela nos detalhes.</span></div>
      </div>
    </footer>
  </>
}

export default App
