/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { AIProvider } from "./types";

export class AnthropicProvider implements AIProvider {
    async makeRequest(text: string, prompt: string, apiKey: string, model: string): Promise<string> {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`
            },
            method: "POST",
            body: JSON.stringify({
                model,
                messages: [{ role: "user", content: `${prompt}\n${text}` }]
            })
        });
        const data = await response.json();
        return data.content[0].text;
    }

    async getModels(apiKey: string): Promise<string[]> {
        const response = await fetch("https://api.anthropic.com/v1/models", {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });
        const data = await response.json();
        return data.models.map(model => model.id);
    }
}
