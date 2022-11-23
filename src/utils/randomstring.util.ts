export const generateRandomShortened = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const generatedAt = new Date();
    let generated: string = '';
    for (let i: number = 0; i < 5; i++) {
        generated += chars.at(Math.floor(Math.random() * chars.length));
        generated.replace(generated[i], Math.round(Math.random()) === 0 ? generated[i].toLowerCase() : generated[i].toUpperCase());
    }
    generated += String(generatedAt.getTime()).substring(String(generatedAt.getTime()).length - 3);
    return generated;
}