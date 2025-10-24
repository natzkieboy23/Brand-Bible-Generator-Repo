import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { ChatIcon, CloseIcon, SendIcon } from './icons';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chatRef.current) {
            chatRef.current = createChatSession();
            setMessages([{ role: 'model', text: 'Hello! How can I help you with your brand today?' }]);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chatRef.current || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Fix: The `sendMessage` method expects an object with a `message` property.
            const result = await chatRef.current.sendMessage({ message: currentInput });
            const modelMessage: ChatMessage = { role: 'model', text: result.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-transform duration-300 transform hover:scale-110 z-50"
                aria-label="Toggle Chat"
            >
                {isOpen ? <CloseIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
            </Button>

            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] flex flex-col z-40 shadow-2xl">
                    <CardHeader className="p-4 bg-primary text-primary-foreground">
                        <CardTitle className="text-lg">Branding Assistant</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/40">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-background text-foreground rounded-bl-none shadow-sm'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl bg-background text-foreground rounded-bl-none flex items-center space-x-2 shadow-sm">
                                   <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                   <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                   <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                        <div className="flex items-center space-x-2 w-full">
                            <Input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask a question..."
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button onClick={handleSend} disabled={isLoading} size="icon">
                                <SendIcon className="h-4 w-4"/>
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </>
    );
};
