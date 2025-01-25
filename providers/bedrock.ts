/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { AIProvider } from "./types";

export class BedrockProvider implements AIProvider {
    async makeRequest(text: string, prompt: string, apiKey: string, model: string): Promise<string> {
        const [accessKey, secretKey, region = "us-east-1"] = apiKey.split(":");
        const response = await fetch(`https://bedrock-runtime.${region}.amazonaws.com/model/${model}/invoke`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
                "Authorization": `AWS4-HMAC-SHA256 Credential=${accessKey}/${region}/bedrock/aws4_request`,
                "X-Amz-Security-Token": secretKey
            },
            body: JSON.stringify({
                prompt: `${prompt}\n${text}`,
                max_tokens: 1000,
            })
        });
        const data = await response.json();
        return data.completion;
    }

    async getModels(apiKey: string): Promise<string[]> {
        const [accessKey, secretKey, region = "us-east-1"] = apiKey.split(":");
        const response = await fetch(`https://bedrock.${region}.amazonaws.com/foundation-models`, {
            headers: {
                "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
                "Authorization": `AWS4-HMAC-SHA256 Credential=${accessKey}/${region}/bedrock/aws4_request`,
                "X-Amz-Security-Token": secretKey
            }
        });
        const data = await response.json();
        return data.modelSummaries.map(model => model.modelId);
    }
}
