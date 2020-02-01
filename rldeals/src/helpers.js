export function isAdmin(user) {
    if (user && (user.role === 'Admin' || user.role === 'Moderator')) {
        return true;
    }
}

