export default function readFile(file) {
    const metadata = {
        name: file.name,
        type: file.type,
        size: String(file.size),
        lastModified: String(file.lastModified),
    };
    if (file.name.toLowerCase().endsWith(".pdf")) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
                resolve({
                    ...metadata,
                    content: String(reader.result).split(",")[1] || "",
                });
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }
    return file.text().then((content) => ({ ...metadata, content }));
}
