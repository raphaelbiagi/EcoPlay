import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
    variable: '--font-montserrat',
});

export const metadata = {
    title: 'EcoPlay - Educação Sustentável Interativa',
    description: 'Transformando o futuro através do aprendizado sustentável. Aprenda sobre reciclagem, economia de energia e sustentabilidade de forma divertida e interativa.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={montserrat.className} style={{ fontFamily: 'var(--font-montserrat), Montserrat, sans-serif' }}>
                {children}
            </body>
        </html>
    );
}
