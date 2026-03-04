// Itens de reciclagem para a Fase 1 — pool expandido (3 de cada tipo)
export const recyclingItems = [
    { id: 'item1', icon: '📄', type: 'papel', name: 'Jornal' },
    { id: 'item2', icon: '📦', type: 'papel', name: 'Caixa de Papelão' },
    { id: 'item3', icon: '📰', type: 'papel', name: 'Revista' },
    { id: 'item4', icon: '🥤', type: 'plastico', name: 'Copo Plástico' },
    { id: 'item5', icon: '🧴', type: 'plastico', name: 'Frasco de Shampoo' },
    { id: 'item6', icon: '🛍️', type: 'plastico', name: 'Sacola Plástica' },
    { id: 'item7', icon: '🍾', type: 'vidro', name: 'Garrafa de Vidro' },
    { id: 'item8', icon: '🫙', type: 'vidro', name: 'Pote de Conserva' },
    { id: 'item9', icon: '🪞', type: 'vidro', name: 'Espelho Quebrado' },
    { id: 'item10', icon: '🥫', type: 'metal', name: 'Lata de Alumínio' },
    { id: 'item11', icon: '🔩', type: 'metal', name: 'Parafuso' },
    { id: 'item12', icon: '🪙', type: 'metal', name: 'Tampa de Metal' },
];

// Dados das lixeiras
export const binData = [
    { type: 'papel', color: '#0056b3', icon: 'description', label: 'Papel' },
    { type: 'plastico', color: '#d93025', icon: 'water_bottle', label: 'Plástico' },
    { type: 'vidro', color: '#2d7d32', icon: 'liquor', label: 'Vidro' },
    { type: 'metal', color: '#f9ab00', icon: 'recycling', label: 'Metal' },
];

// Aparelhos para a Fase 2
export const devices = [
    { id: 'tv', icon: 'tv', name: 'TV LIGADA', category: 'Sala de Estar' },
    { id: 'ac', icon: 'ac_unit', name: 'AR-CONDICIONADO', category: 'Quarto' },
    { id: 'light', icon: 'lightbulb', name: 'LUZES ACESAS', category: 'Cozinha' },
    { id: 'pc', icon: 'computer', name: 'COMPUTADOR', category: 'Escritório' },
];

// Perguntas do Quiz - Fase 3 (10 questões)
export const quizQuestions = [
    {
        q: 'Qual a melhor forma de economizar água ao escovar os dentes?',
        options: [
            'Deixar a torneira aberta',
            'Usar um copo de água',
            'Fechar a torneira enquanto escova',
            'Escovar mais rápido',
        ],
        correct: 2,
        feedback: 'Fechar a torneira pode economizar até 12 litros de água por minuto!',
    },
    {
        q: 'O que deve ser feito com pilhas e baterias velhas?',
        options: [
            'Jogar no lixo comum',
            'Enterrar no jardim',
            'Levar a pontos de coleta específicos',
            'Queimar',
        ],
        correct: 2,
        feedback: 'Pilhas contêm metais pesados tóxicos que contaminam o solo e a água.',
    },
    {
        q: 'Qual fonte de energia é considerada renovável e limpa?',
        options: [
            'Carvão mineral',
            'Petróleo',
            'Gás natural',
            'Energia Solar',
        ],
        correct: 3,
        feedback: 'A energia solar não emite gases poluentes durante sua geração e é inesgotável.',
    },
    {
        q: 'O que significa o símbolo dos "3 Rs" da sustentabilidade?',
        options: [
            'Reciclar, Reutilizar, Repensar',
            'Reduzir, Reutilizar, Reciclar',
            'Recuperar, Renovar, Reciclar',
            'Reflorestar, Reutilizar, Reduzir',
        ],
        correct: 1,
        feedback: 'Os 3 Rs ajudam a diminuir a quantidade de lixo e o uso de recursos naturais.',
    },
    {
        q: 'Qual é o principal gás responsável pelo efeito estufa?',
        options: [
            'Oxigênio',
            'Nitrogênio',
            'Dióxido de Carbono (CO₂)',
            'Hélio',
        ],
        correct: 2,
        feedback: 'O CO₂ retém calor na atmosfera, contribuindo para o aquecimento global.',
    },
    {
        q: 'Quanto tempo uma garrafa de plástico leva para se decompor na natureza?',
        options: [
            'Cerca de 10 anos',
            'Cerca de 50 anos',
            'Cerca de 100 anos',
            'Mais de 400 anos',
        ],
        correct: 3,
        feedback: 'Garrafas plásticas podem levar até 450 anos para se decompor completamente!',
    },
    {
        q: 'Qual é a forma mais sustentável de transporte urbano?',
        options: [
            'Carro particular a gasolina',
            'Bicicleta ou transporte público',
            'Moto a combustão',
            'Helicóptero',
        ],
        correct: 1,
        feedback: 'Bicicleta não emite poluentes e transporte público reduz emissões per capita.',
    },
    {
        q: 'O que é agricultura orgânica?',
        options: [
            'Usar muitos agrotóxicos',
            'Plantar apenas em estufas',
            'Cultivar sem agrotóxicos e respeitando o meio ambiente',
            'Usar máquinas pesadas',
        ],
        correct: 2,
        feedback: 'A agricultura orgânica preserva o solo, a água e a biodiversidade.',
    },
    {
        q: 'Por que as florestas são importantes para o planeta?',
        options: [
            'Apenas pela madeira',
            'Produzem oxigênio e absorvem CO₂',
            'Não são importantes',
            'Apenas para os animais',
        ],
        correct: 1,
        feedback: 'Florestas regulam o clima, produzem oxigênio e são lar de milhões de espécies.',
    },
    {
        q: 'Qual é o principal problema causado pelo descarte incorreto de lixo nos oceanos?',
        options: [
            'Poluição sonora',
            'Aumento da temperatura',
            'Morte de animais marinhos e microplásticos na cadeia alimentar',
            'Aumento do nível do mar',
        ],
        correct: 2,
        feedback: 'Milhões de animais marinhos morrem por ano devido ao plástico nos oceanos.',
    },
];

// Features da tela inicial
export const features = [
    {
        icon: 'psychology',
        title: 'Aprenda Brincando',
        description: 'Missões educativas que fixam o conhecimento de forma leve e divertida para todas as idades.',
    },
    {
        icon: 'public',
        title: 'Impacto Real',
        description: 'Cada conquista no jogo reflete uma ação que você pode replicar no mundo real para salvar o planeta.',
    },
];
