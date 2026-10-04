export const slugify = (value: string): string => {
    return value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
}
