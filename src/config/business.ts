export type Service = {
  id: string;
  name: string;
  description: string;
  cta: string;
  price?: string;
  duration?: string;
};

export type BusinessConfig = {
  name: string;
  description: string;
  whatsapp: string;
  address: string;
  hours: string[];
  instagram: string;
  bookingUrl: string;
  mapUrl: string;
  directionsUrl: string;
  services: Service[];
};

// Preencha somente com dados confirmados antes de disponibilizar o atendimento.
// WhatsApp: código do país + DDD + número. URLs: endereço completo com https://.
export const business: BusinessConfig = {
  name: 'ÂMBAR BARBEARIA',
  description:
    'Corte, barba e cuidado pessoal em um ambiente pensado para você desacelerar e sair com a sua melhor versão.',
  whatsapp: '',
  address: '',
  hours: [],
  instagram: '',
  bookingUrl: '',
  mapUrl: '',
  directionsUrl: '',
  services: [
    {
      id: 'corte',
      name: 'Corte',
      description:
        'Um corte alinhado ao seu estilo, com atenção ao acabamento e aos detalhes.',
      cta: 'Quero agendar um corte',
    },
    {
      id: 'barba',
      name: 'Barba',
      description:
        'Desenho e acabamento para valorizar seus traços e renovar o visual.',
      cta: 'Quero cuidar da barba',
    },
    {
      id: 'completo',
      name: 'Corte + barba',
      description:
        'Uma experiência completa para deixar cabelo e barba em sintonia.',
      cta: 'Quero o cuidado completo',
    },
  ],
};
