export function Footer() {
    return (
        <footer className='mt-auto pt-8 pb-2 text-center text-[13px]' style={{ color: 'var(--label-secondary)' }}>
            Сделано с ❤️{' '}
            <a
                className='link text-[13px]'
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/Denobraz'
            >
                Denobraz
            </a>
        </footer>
    );
}
