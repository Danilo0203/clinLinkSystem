export const connectDB = async (url: string, method: string, data?: any) => {
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
};
export const getDB = async (url: string) => {
    return await connectDB(url, 'GET');
};