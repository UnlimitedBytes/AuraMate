/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { AnthropicProvider } from "./anthropic";
import { BedrockProvider } from "./bedrock";
import { DeepSeekProvider } from "./deepseek";
import { GeminiProvider } from "./gemini";
import { LMStudioProvider } from "./lmstudio";
import { MistralProvider } from "./mistral";
import { OllamaProvider } from "./ollama";
import { OpenAIProvider } from "./openAI";
import { OpenRouterProvider } from "./openrouter";
import { VertexProvider } from "./vertex";

export const providers = {
    openai: new OpenAIProvider(),
    anthropic: new AnthropicProvider(),
    gemini: new GeminiProvider(),
    deepseek: new DeepSeekProvider(),
    openrouter: new OpenRouterProvider(),
    bedrock: new BedrockProvider(),
    lmstudio: new LMStudioProvider(),
    mistral: new MistralProvider(),
    ollama: new OllamaProvider(),
    vertex: new VertexProvider()
} as const;

export type ProviderType = keyof typeof providers;
