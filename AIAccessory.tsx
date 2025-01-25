/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { React } from "@webpack/common";

import { AIIcon } from "./AIIcon";
import { cl } from "./utils";

export interface EnhancedMessage {
    id: string;
    content?: string;
    channel_id: string;
    aiEnhanced?: {
        type: "spelling" | "summary" | "expansion";
        enhancedText: string;
    };
}

export function handleEnhance(message: EnhancedMessage, type: "spelling" | "summary" | "expansion", enhancedText: string) {
    message.aiEnhanced = { type, enhancedText };
}

export function AIAccessory({ message }: { message: EnhancedMessage; }) {
    if (!message.aiEnhanced) return null;

    return (
        <div className={cl("result")}>
            <AIIcon />
            <span>{message.aiEnhanced.type === "spelling" ? "Corrected" :
                message.aiEnhanced.type === "summary" ? "Summarized" : "Expanded"}</span>
        </div>
    );
}
