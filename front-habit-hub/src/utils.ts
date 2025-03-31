export const formatFieldName = (str: string): string => {
    return str
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/^./, (char) => char.toUpperCase());
};