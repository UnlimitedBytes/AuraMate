/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { AIProvider } from "./types";

export class DeepSeekProvider implements AIProvider {
    async makeRequest(text: string, prompt: string, apiKey: string, model: string): Promise<string> {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: text }
                ]
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }

    async getModels(apiKey: string): Promise<string[]> {
        const response = await fetch("https://api.deepseek.com/v1/models", {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });
        const data = await response.json();
        return data.data.map(model => model.id);
    }
}
