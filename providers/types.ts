/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export interface AIProvider {
    makeRequest(text: string, prompt: string, apiKey: string, model: string): Promise<string>;
    getModels(apiKey: string): Promise<string[]>;
}
