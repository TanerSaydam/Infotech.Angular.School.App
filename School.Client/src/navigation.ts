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
    }
]