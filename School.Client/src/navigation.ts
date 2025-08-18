export interface Navigation{
    name: string,
    route: string,
    icon: string
}

export const navigations: Navigation[] = [
    {
        name: 'Ana Sayfa',
        route: '/',
        icon: 'bi-house-fill'
    },
    {
        name: 'Öğrenciler',
        route: '/students',
        icon: 'bi-people'
    },
    {
        name: 'Sınıflar',
        route: '/class-rooms',
        icon: 'bi-buildings'
    },
    {
        name: 'Dersler',
        route: '/lessons',
        icon: 'bi-card-heading'
    }
]