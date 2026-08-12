import type { VoiceConnection, createAudioPlayer } from "@discordjs/voice";

export type VoiceSession = {
    connection: VoiceConnection;
    player: ReturnType<typeof createAudioPlayer>;
};

export const voiceSessions = new Map<string, VoiceSession>();

export function getSession(guildId: string | null | undefined): VoiceSession | undefined {
    return guildId ? voiceSessions.get(guildId) : undefined;
}
