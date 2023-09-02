export function zeroPad(number: number): string {
    return number < 10 ? String(number) : `0${number}`;
}

export function brBuilder(...text: string[]) {
    return text.join("\n");
}

/**
 * Removes template string indentation.
 */
export function dedent(callSite: TemplateStringsArray, ...args: unknown[]) {
    function format(str: string): string {
        let size = -1;
        return str.replace(/\n(\s+)/g, (m: string, m1: string) => {
            if (size < 0) size = m1.replace(/\t/g, "    ").length;
            return "\n" + m1.slice(Math.min(m1.length, size));
        });
    }
    if (typeof callSite === "string") return format(callSite);
    const output = callSite
        .slice(0, args.length + 1)
        .map((text: string, i: number) => (i === 0 ? "" : args[i - 1]) + text)
        .join("");

    return format(output);
}
